import { Component } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass, CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, FormsModule, HttpClientModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginData = {
        email: '',
        password: '',
        rememberMe: false
    };
    isLoading = false;
    errorMessage = '';
    returnUrl: string | null = null;
    queryParams: any = {};

    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute
    ) {
        // Capturar returnUrl
        this.route.queryParams.subscribe(params => {
            this.returnUrl = params['returnUrl'];
            this.queryParams = params;
        });
    }

    onSubmit() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.errorMessage = '';

        this.http.post<any>(`${environment.apiUrl}/api/auth/login`, {
            email: this.loginData.email,
            password: this.loginData.password
        }).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.token) {
                    // GUADAR TOKEN CON LA CLAVE CORRECTA 'token'
                    localStorage.setItem('token', response.token);
                    if (response.usuario) {
                        localStorage.setItem('user', JSON.stringify(response.usuario));
                    }

                    // Mensaje de éxito
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true
                    });
                    Toast.fire({
                        icon: 'success',
                        title: 'Sesión iniciada correctamente'
                    });

                    // Redirección inteligente
                    if (this.returnUrl) {
                        // Pasar los parámetros (como plan y billing) de vuelta
                        const { returnUrl, ...restParams } = this.queryParams;
                        this.router.navigate([this.returnUrl], { queryParams: restParams });
                    } else {
                        // Ir al inicio o dashboard
                        this.router.navigate(['/']);
                    }
                }
            },
            error: (err) => {
                this.isLoading = false;
                console.error('Login error', err);
                this.errorMessage = err.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';

                Swal.fire({
                    title: 'Error',
                    text: this.errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo'
                });
            }
        });
    }
}
