import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Country {
    name: string;
    code: string;
    flag: string;
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [RouterLink, FormsModule, NgIf, NgFor, HttpClientModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
    registerData = {
        email: '',
        phone: '',
        password: '',
        name: '',
        lastName: '',
        companyName: '' // Nuevo campo
    };

    isLoading = false;
    errorMessage = '';
    returnUrl: string | null = null;
    queryParams: any = {};

    // Datos del plan seleccionado
    selectedPlan: string = 'free';
    selectedBilling: string = 'mensual';

    countries: Country[] = [
        { name: 'México', code: '+52', flag: 'https://flagcdn.com/w20/mx.png' },
        { name: 'Estados Unidos', code: '+1', flag: 'https://flagcdn.com/w20/us.png' },
    ];

    selectedCountry: Country = this.countries[0];
    showCountryDropdown = false;

    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.returnUrl = params['returnUrl'];
            // Capturar plan y billing si existen
            if (params['plan']) this.selectedPlan = params['plan'];
            if (params['billing']) this.selectedBilling = params['billing'];

            this.queryParams = params;
            console.log('Plan seleccionado:', this.selectedPlan, 'Billing:', this.selectedBilling);
        });
    }

    toggleCountryDropdown() {
        this.showCountryDropdown = !this.showCountryDropdown;
    }

    selectCountry(country: Country) {
        this.selectedCountry = country;
        this.showCountryDropdown = false;
    }

    onSubmit() {
        // Validar campos requeridos (incluyendo companyName)
        if (!this.registerData.name || !this.registerData.lastName ||
            !this.registerData.email || !this.registerData.password ||
            !this.registerData.companyName) {
            this.errorMessage = 'Por favor completa todos los campos requeridos, incluyendo el nombre de tu empresa.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const payload = {
            fullName: `${this.registerData.name} ${this.registerData.lastName}`,
            email: this.registerData.email,
            password: this.registerData.password,
            id_rol: 2,
            companyName: this.registerData.companyName, // Enviar nombre empresa
            plan: this.selectedPlan,                    // Enviar plan
            billing: this.selectedBilling               // Enviar facturación
        };

        this.http.post<any>(`${environment.apiUrl}/api/auth/register`, payload)
            .subscribe({
                next: (res) => {
                    this.isLoading = false;
                    console.log('Registro exitoso', res);

                    if (res.token) {
                        localStorage.setItem('token', res.token);
                        localStorage.setItem('user', JSON.stringify(res.usuario || {}));

                        // Lógica de redirección basada en si requiere pago
                        // Si el plan NO es free, redirigir a checkout (o si el backend lo indica)
                        // Por ahora, asumimos que basic/pro van a checkout, free a CRM.
                        // Idealmente el backend nos devolvería un flag `requiresPayment`

                        // NOTA: Para este MVP, si es Basic o Pro, vamos a Checkout.
                        if (this.selectedPlan === 'basic' || this.selectedPlan === 'pro') {
                            this.router.navigate(['/checkout'], {
                                queryParams: {
                                    plan: this.selectedPlan,
                                    billing: this.selectedBilling
                                }
                            });
                        } else {
                            // Si es Free, directo al CRM
                            window.location.href = `http://localhost:4201/auth/token?t=${res.token}`;
                        }
                    }
                },
                error: (err) => {
                    console.error('Error registro', err);
                    this.isLoading = false;

                    if (err.status === 409) {
                        this.errorMessage = 'Este correo ya tiene una cuenta registrada. Intenta iniciar sesión.';
                    } else {
                        this.errorMessage = err.error?.message || 'Error al procesar el registro.';
                    }
                }
            });
    }
}
