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
        lastName: ''
    };

    isLoading = false;
    errorMessage = '';
    returnUrl: string | null = null;
    queryParams: any = {};

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
            this.queryParams = params;
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
        if (!this.registerData.name || !this.registerData.lastName || !this.registerData.email || !this.registerData.password) {
            this.errorMessage = 'Por favor completa todos los campos requeridos.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const payload = {
            fullName: `${this.registerData.name} ${this.registerData.lastName}`,
            email: this.registerData.email,
            password: this.registerData.password,
            id_rol: 2
        };

        this.http.post<any>(`${environment.apiUrl}/api/auth/register`, payload)
            .subscribe({
                next: (res) => {
                    this.isLoading = false;
                    console.log('Registro exitoso', res);

                    if (res.token) {
                        localStorage.setItem('token', res.token);
                        // El backend devuelve 'usuario' en el objeto de respuesta
                        localStorage.setItem('user', JSON.stringify(res.usuario || {}));

                        if (this.returnUrl) {
                            const { returnUrl, ...restParams } = this.queryParams;
                            // Construct query string manually or use router.createUrlTree then serialize
                            const urlTree = this.router.createUrlTree([this.returnUrl], { queryParams: restParams });
                            const url = this.router.serializeUrl(urlTree);
                            window.location.href = url;
                        } else {
                            // Redirigir al CRM (ngx-admin) en el puerto 4201
                            window.location.href = 'http://localhost:4201';
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
