import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { loadScript } from "@paypal/paypal-js";
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class Checkout implements OnInit {

  @ViewChild('paypalContainer', { static: false }) paypalContainer!: ElementRef;

  plan: string = '';
  billing: string = '';
  amount: number = 0;
  description: string = '';
  availablePlans: any[] = []; // Lista de planes desde backend

  // Estados de carga e interfaz
  loading: boolean = true;
  paymentSuccess: boolean = false;
  paymentError: boolean = false;
  errorMessage: string = '';
  mpLoading: boolean = false;
  stripeLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.fetchPlans();

    // VERIFICAR SI EL USUARIO ESTÁ LOGUEADO
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Sesión requerida',
        text: 'Debes iniciar sesión o registrarte para proceder con el pago.',
        icon: 'warning',
        confirmButtonText: 'Ir a Registrarse'
      }).then(() => {
        this.router.navigate(['/register'], { queryParams: { returnUrl: this.router.url } });
      });
      return;
    }

    this.route.queryParams.subscribe(params => {
      // Si falta plan o billing, redirigir al pricing
      if (!params['plan'] || !params['billing']) {
        Swal.fire({
          title: 'Parámetros faltantes',
          text: 'Por favor selecciona un plan de precios.',
          icon: 'warning',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/pricing']);
        });
        return;
      }

      // Validar billing y plan
      if (params['billing'] !== 'mensual' && params['billing'] !== 'anual') {
        Swal.fire({
          title: 'Parámetros inválidos',
          text: 'Ciclo de facturación no válido.',
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/pricing']);
        });
        return;
      }

      if (params['plan'] !== 'basic' && params['plan'] !== 'pro') {
        Swal.fire({
          title: 'Parámetros inválidos',
          text: 'Plan seleccionado no válido.',
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/pricing']);
        });
        return;
      }

      this.plan = params['plan'];
      this.billing = params['billing'];

      this.calculateTotal();
      this.loadPaypalScript();
    });
  }

  fetchPlans() {
    this.http.get<any[]>(`${environment.apiUrl}/api/planes`).subscribe({
      next: (plans) => {
        this.availablePlans = plans;
        console.log('Planes cargados:', plans);
      },
      error: (err) => console.error('Error cargando planes:', err)
    });
  }

  calculateTotal() {
    // Lógica simple de precios (debe coincidir con pricing.component y backend)
    // PRECIOS BASE
    const prices: any = {
      'basic': { monthly: 399, annual: 3588, id: 1 }, // 299 * 12
      'pro': { monthly: 999, annual: 8988, id: 2 }    // 749 * 12
    };

    if (!prices[this.plan]) {
      this.router.navigate(['/pricing']); // Plan inválido
      return;
    }

    if (this.billing === 'anual') {
      this.amount = prices[this.plan].annual;
      this.description = `Suscripción Anual Plan ${this.plan.toUpperCase()} - Gnosis CRM`;
    } else {
      this.amount = prices[this.plan].monthly;
      this.description = `Suscripción Mensual Plan ${this.plan.toUpperCase()} - Gnosis CRM`;
    }
  }

  paypalRetries = 0;

  async loadPaypalScript() {
    console.log('Iniciando carga de PayPal SDK...');
    try {
      this.loading = true;

      const paypal = await loadScript({
        clientId: environment.paypalClientId || "test",
        currency: "MXN",
        intent: "capture"
      });

      console.log('PayPal SDK cargado:', paypal ? 'OK' : 'Error');

      if (paypal && paypal.Buttons) {

        // Buscar contenedor por ViewChild O por getElementById
        const container = this.paypalContainer?.nativeElement || document.getElementById('paypal-button-container');

        if (!container) {
          this.paypalRetries++;
          if (this.paypalRetries < 10) {
            console.warn(`Contenedor PayPal no encontrado, reintento ${this.paypalRetries}/10...`);
            setTimeout(() => this.loadPaypalScript(), 500);
            return;
          } else {
            console.error('No se encontró el contenedor de PayPal después de 10 intentos');
            this.loading = false;
            return;
          }
        }

        try {
          console.log('Renderizando botones de PayPal...');
          await paypal.Buttons({
            // 1. CREAR ORDEN (Llamando al Backend)
            createOrder: (data: any, actions: any) => {
              console.log('Creando orden de PayPal...');
              const token = localStorage.getItem('token');
              console.log('Token obtenido:', token ? 'Sí' : 'No');

              // Buscar ID real del plan en la lista obtenida del backend
              let dbPlan = this.availablePlans.find(p => p.slug === (this.plan === 'basic' ? 'basico' : this.plan));

              const planIdMap: any = { 'basic': 4, 'pro': 5 }; // Fallback IDs reales de la BD
              const planId = dbPlan ? (dbPlan.id || dbPlan.id_plan) : (planIdMap[this.plan] || 2);

              if (dbPlan) {
                console.log(`Plan encontrado en frontend: ${dbPlan.nombre} (ID: ${dbPlan.id || dbPlan.id_plan})`);
              } else {
                console.warn(`Plan '${this.plan}' no encontrado en lista, usando ID fallback: ${planId}`);
              }

              return this.http.post<any>(`${environment.apiUrl}/api/payments/paypal/create-order-paypal`, {
                planId: planId,
                billingCycle: this.billing
              }, {
                headers: new HttpHeaders({
                  'Authorization': `Bearer ${token}`
                })
              }).toPromise()
                .then((order: any) => {
                  console.log('Orden creada en backend:', order);
                  return order.id;
                })
                .catch((err) => {
                  console.error('Error creando orden en backend:', err);
                  this.paymentError = true;
                  this.errorMessage = 'No se pudo iniciar el pago. ¿Iniciaste sesión?';
                  throw err;
                });
            },

            // 2. APROBAR PAGO (Llamando al Backend)
            onApprove: async (data: any, actions: any) => {
              console.log('Pago aprobado por usuario, capturando...', data);
              try {
                const token = localStorage.getItem('token');

                const response = await this.http.post<any>(`${environment.apiUrl}/api/payments/paypal/capture-order-paypal`, {
                  orderId: data.orderID
                }, {
                  headers: new HttpHeaders({
                    'Authorization': `Bearer ${token}`
                  })
                }).toPromise();

                console.log('Pago Aprobado y Confirmado:', response);
                this.paymentSuccess = true;

              } catch (err: any) {
                console.error('Error capturando pago en backend:', err);
                this.paymentError = true;
                this.errorMessage = 'El pago se procesó en PayPal pero hubo un error al activarlo en Gnosis. Contáctanos.';
              }
            },

            onError: (err: any) => {
              console.error('PayPal Error:', err);
              this.paymentError = true;
              this.errorMessage = 'Error en la conexión con PayPal.';
            }
          }).render(container);

          console.log('Botones de PayPal renderizados exitosamente.');
          this.loading = false;

        } catch (error) {
          console.error("Error rendering paypal buttons", error);
          this.loading = false;
        }
      } else {
        console.warn('PayPal SDK no cargó correctamente o no tiene Buttons.');
        this.loading = false;
      }
    } catch (error) {
      console.error("Error cargando SDK PayPal", error);
      this.loading = false;
    }
  }

  // ==================== MERCADO PAGO ====================
  payWithMercadoPago() {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Sesión requerida', 'Debes iniciar sesión para continuar.', 'warning');
      return;
    }

    this.mpLoading = true;
    this.paymentError = false;

    // Buscar ID real del plan
    let dbPlan = this.availablePlans.find(p => p.slug === (this.plan === 'basic' ? 'basico' : this.plan));
    const planIdMap: any = { 'basic': 4, 'pro': 5 };
    const planId = dbPlan ? (dbPlan.id || dbPlan.id_plan) : (planIdMap[this.plan] || 4);

    console.log(`MP: Enviando planId=${planId}, billing=${this.billing}`);

    this.http.post<any>(`${environment.apiUrl}/api/payments/create-order`, {
      planId: planId,
      billingCycle: this.billing
    }, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).subscribe({
      next: (response) => {
        console.log('MP Preference creada:', response);
        // Redirigir a Mercado Pago
        const checkoutUrl = response.sandbox_init_point || response.init_point;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          this.mpLoading = false;
          this.paymentError = true;
          this.errorMessage = 'No se pudo generar el enlace de pago de Mercado Pago.';
        }
      },
      error: (err) => {
        console.error('Error creando preferencia MP:', err);
        this.mpLoading = false;
        this.paymentError = true;
        this.errorMessage = 'Error al conectar con Mercado Pago. Intenta de nuevo.';
      }
    });
  }

  // ==================== STRIPE (OXXO + TARJETA) ====================
  payWithStripe() {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Sesión requerida', 'Debes iniciar sesión para continuar.', 'warning');
      return;
    }

    this.stripeLoading = true;
    this.paymentError = false;

    // Buscar ID real del plan
    let dbPlan = this.availablePlans.find(p => p.slug === (this.plan === 'basic' ? 'basico' : this.plan));
    const planIdMap: any = { 'basic': 4, 'pro': 5 };
    const planId = dbPlan ? (dbPlan.id || dbPlan.id_plan) : (planIdMap[this.plan] || 4);

    console.log(`Stripe: Enviando planId=${planId}, billing=${this.billing}`);

    this.http.post<any>(`${environment.apiUrl}/api/payments/stripe/create-checkout`, {
      planId: planId,
      billingCycle: this.billing
    }, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).subscribe({
      next: (response) => {
        console.log('Stripe Session creada:', response);
        if (response.url) {
          window.location.href = response.url;
        } else {
          this.stripeLoading = false;
          this.paymentError = true;
          this.errorMessage = 'No se pudo generar el enlace de pago.';
        }
      },
      error: (err) => {
        console.error('Error creando sesión Stripe:', err);
        this.stripeLoading = false;
        this.paymentError = true;
        this.errorMessage = 'Error al conectar con el sistema de pago. Intenta de nuevo.';
      }
    });
  }
}
