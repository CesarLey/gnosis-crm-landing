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

        // Esperar a que el contenedor exista
        if (!this.paypalContainer) {
          console.warn('Contenedor PayPal no encontrado, reintentando en 500ms...');
          setTimeout(() => this.loadPaypalScript(), 500);
          return;
        }

        try {
          console.log('Renderizando botones de PayPal...');
          await paypal.Buttons({
            // 1. CREAR ORDEN (Llamando al Backend)
            createOrder: (data: any, actions: any) => {
              console.log('Creando orden de PayPal...');
              // Necesitamos token de auth si el backend lo pide.
              const token = localStorage.getItem('token');
              console.log('Token obtenido:', token ? 'Sí' : 'No');

              // Buscar ID real del plan en la lista obtenida del backend
              let dbPlan = this.availablePlans.find(p => p.slug === (this.plan === 'basic' ? 'basico' : this.plan));

              const planIdMap: any = { 'basic': 4, 'pro': 5 }; // Fallback IDs reales de la BD
              // FIX: Verificar 'id' o 'id_plan' ya que el modelo define id_plan como PK
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
                  'Authorization': `Bearer ${token}` // Enviar token si existe
                })
              }).toPromise()
                .then((order: any) => {
                  console.log('Orden creada en backend:', order);
                  return order.id; // Retornar OrderID de PayPal al botón
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
                const token = localStorage.getItem('token'); // <--- CORREGIDO: 'token' en lugar de 'auth_token'

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
          }).render(this.paypalContainer.nativeElement);

          console.log('Botones de PayPal renderizados exitosamente.');
          this.loading = false; // Ocultar spinner DESPUÉS de renderizar

        } catch (error) {
          console.error("Error rendering paypal buttons", error);
          this.loading = false; // También ocultarlo si falla
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
}
