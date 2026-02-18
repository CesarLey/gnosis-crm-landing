
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { loadScript } from "@paypal/paypal-js";
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class Checkout implements OnInit {

  @ViewChild('paypalContainer', { static: false }) paypalContainer!: ElementRef;

  plan: string = '';
  billing: string = '';
  amount: number = 0;
  originalAmount: number = 0;
  description: string = '';
  availablePlans: any[] = [];

  // Estados de carga e interfaz
  loading: boolean = true;
  paymentSuccess: boolean = false;
  paymentError: boolean = false;
  errorMessage: string = '';
  mpLoading: boolean = false;
  stripeLoading: boolean = false;

  // Variables para cupones
  couponCode: string = '';
  discountApplied: boolean = false;
  discountAmount: number = 0;
  couponMessage: string = '';
  couponError: string = '';

  // Variable prueba gratis
  trialLoading: boolean = false;

  public crmUrl = environment.crmUrl;

  goToDashboard() {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = `${this.crmUrl}/auth/token?t=${token}`;
    } else {
      window.location.href = `${this.crmUrl}/auth/login`;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.fetchPlans();

    // VERIFICAR SI EL USUARIO ESTÁ LOGUEADO
    if (typeof localStorage !== 'undefined') {
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
    }

    this.route.queryParams.subscribe(params => {
      // Si falta plan o billing, redirigir al pricing
      if (!params['plan'] || !params['billing']) {
        if (params['status'] === 'success') {
          this.paymentSuccess = true;
          return;
        }

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

      this.plan = params['plan'];
      this.billing = params['billing'];

      this.calculateTotal();
      this.loadPaypalScript();
    });
  }

  fetchPlans() {
    this.http.get<any[]>(`${environment.apiUrl}/api/planes`).subscribe({
      next: (plans: any[]) => {
        this.availablePlans = plans;
        console.log('Planes cargados:', plans);
      },
      error: (err: any) => console.error('Error cargando planes:', err)
    });
  }

  calculateTotal() {
    // PRECIOS BASE (Fallback) - Deben coincidir con Backend
    const prices: any = {
      'basic': { monthly: 399, annual: 3588, id: 1 },
      'pro': { monthly: 999, annual: 8988, id: 2 }
    };

    const planData = prices[this.plan] || { monthly: 0, annual: 0 };

    if (this.billing === 'anual') {
      this.originalAmount = planData.annual;
      this.description = `Suscripción Anual Plan ${this.plan.toUpperCase()} - Gnosis CRM`;
    } else {
      this.originalAmount = planData.monthly;
      this.description = `Suscripción Mensual Plan ${this.plan.toUpperCase()} - Gnosis CRM`;
    }

    this.amount = this.originalAmount;
  }

  // ============== CUPONES ==============
  applyCoupon() {
    if (!this.couponCode.trim()) return;

    const token = localStorage.getItem('token');

    // Obtener ID del plan
    let dbPlan = this.availablePlans.find(p => p.slug === (this.plan === 'basic' ? 'basico' : this.plan));
    const planIdMap: any = { 'basic': 4, 'pro': 5 };
    const planId = dbPlan ? (dbPlan.id || dbPlan.id_plan) : (planIdMap[this.plan] || 4);

    this.http.post<any>(`${environment.apiUrl}/api/cupones/validar`, {
      codigo: this.couponCode.trim(),
      monto: this.originalAmount,
      planId: planId
    }, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    }).subscribe({
      next: (res: any) => {
        this.discountApplied = true;
        this.amount = res.nuevoTotal;
        this.discountAmount = res.descuento;
        this.couponMessage = `¡Cupón aplicado! Ahorras $${res.descuento}`;
        this.couponError = '';
      },
      error: (err: any) => {
        this.discountApplied = false;
        this.couponMessage = err.error?.message || 'Cupón no válido o expirado';
        this.discountAmount = 0;
        this.amount = this.originalAmount;
      }
    });
  }

  // ============== PRUEBA GRATIS ==============
  startFreeTrial() {
    const token = localStorage.getItem('token');
    this.trialLoading = true;

    // Obtener ID del plan
    let dbPlan = this.availablePlans.find(p => p.slug === (this.plan === 'basic' ? 'basico' : this.plan));
    const planIdMap: any = { 'basic': 4, 'pro': 5 };
    const planId = dbPlan ? (dbPlan.id || dbPlan.id_plan) : (planIdMap[this.plan] || 4);

    this.http.post<any>(`${environment.apiUrl}/api/suscripcion/prueba-gratis`, {
      id_plan: planId
    }, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    }).subscribe({
      next: (res: any) => {
        this.trialLoading = false;
        this.paymentSuccess = true; // Mostrar pantalla de éxito
        Swal.fire({
          title: '¡Prueba Iniciada!',
          text: 'Disfruta de 7 días gratis. Te hemos enviado un correo.',
          icon: 'success'
        });
      },
      error: (err: any) => {
        this.trialLoading = false;
        Swal.fire({
          title: 'No elegible',
          text: err.error?.message || 'Ya has usado tu prueba gratis o tienes una suscripción activa.',
          icon: 'error'
        });
      }
    });
  }

  // ============== PAYPAL ==============
  paypalRetries = 0;

  async loadPaypalScript() {
    try {
      this.loading = true;
      const paypal = await loadScript({
        clientId: environment.paypalClientId || "sb",
        currency: "MXN",
        intent: "capture"
      });

      if (paypal && paypal.Buttons) {
        const checkContainer = () => {
          const container = document.getElementById('paypal-button-container');
          if (container) {
            this.renderPaypalButtons(paypal, container);
          } else {
            this.paypalRetries++;
            if (this.paypalRetries < 20) {
              setTimeout(checkContainer, 500);
            } else {
              console.error('No se encontró contenedor PayPal');
              this.loading = false;
            }
          }
        };
        checkContainer();
      } else {
        this.loading = false;
      }
    } catch (error) {
      console.error("Error cargando SDK PayPal", error);
      this.loading = false;
    }
  }

  async renderPaypalButtons(paypal: any, container: any) {
    try {
      await paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return this.createPaypalOrder();
        },
        onApprove: (data: any, actions: any) => {
          return this.capturePaypalOrder(data);
        },
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          this.paymentError = true;
          this.errorMessage = 'Error en la conexión con PayPal.';
        }
      }).render(container);
      this.loading = false;
    } catch (err) {
      console.error('Error renderizando botones:', err);
      this.loading = false;
    }
  }

  createPaypalOrder() {
    const token = localStorage.getItem('token');
    let dbPlan = this.availablePlans.find(p => p.slug === (this.plan === 'basic' ? 'basico' : this.plan));
    const planIdMap: any = { 'basic': 4, 'pro': 5 };
    const planId = dbPlan ? (dbPlan.id || dbPlan.id_plan) : (planIdMap[this.plan] || 2);

    return this.http.post<any>(`${environment.apiUrl}/api/payments/paypal/create-order-paypal`, {
      planId: planId,
      billingCycle: this.billing
    }, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    }).toPromise()
      .then((order: any) => order.id)
      .catch((err: any) => {
        this.paymentError = true;
        this.errorMessage = 'No se pudo iniciar el pago. ¿Iniciaste sesión?';
        throw err;
      });
  }

  async capturePaypalOrder(data: any) {
    try {
      const token = localStorage.getItem('token');
      await this.http.post<any>(`${environment.apiUrl}/api/payments/paypal/capture-order-paypal`, {
        orderId: data.orderID
      }, {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
      }).toPromise();

      this.paymentSuccess = true;

    } catch (err: any) {
      this.paymentError = true;
      this.errorMessage = 'El pago se procesó en PayPal pero hubo un error al activarlo en Gnosis.';
    }
  }

  // ==================== STRIPE ====================
  payWithStripe() {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Sesión requerida', 'Debes iniciar sesión para continuar.', 'warning');
      return;
    }

    this.stripeLoading = true;
    this.paymentError = false;

    let dbPlan = this.availablePlans.find(p => p.slug === (this.plan === 'basic' ? 'basico' : this.plan));
    const planIdMap: any = { 'basic': 4, 'pro': 5 };
    const planId = dbPlan ? (dbPlan.id || dbPlan.id_plan) : (planIdMap[this.plan] || 4);

    this.http.post<any>(`${environment.apiUrl}/api/payments/stripe/create-checkout`, {
      planId: planId,
      billingCycle: this.billing
    }, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    }).subscribe({
      next: (response: any) => {
        if (response.url) {
          window.location.href = response.url;
        } else {
          this.stripeLoading = false;
          this.paymentError = true;
          this.errorMessage = 'Error: No se recibió URL de pago.';
        }
      },
      error: (err: any) => {
        this.stripeLoading = false;
        this.paymentError = true;
        if (err.status === 503) {
          this.errorMessage = 'El pago con Tarjeta/OXXO no está disponible temporalmente. Por favor usa PayPal.';
        } else {
          this.errorMessage = 'Error al conectar con el sistema de pagos.';
        }
      }
    });
  }
}
