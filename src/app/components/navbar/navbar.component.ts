import { Component, OnInit, ChangeDetectorRef, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, CommonModule, HttpClientModule, FormsModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
    isLoggedIn = false;
    user: any = null;
    showLoginModal = false;

    loginData = { email: '', password: '' };
    isLoading = false;
    errorMessage: string = '';

    constructor(
        private http: HttpClient,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.checkLoginStatus();
    }

    checkLoginStatus() {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token');
            if (token) {
                this.isLoggedIn = true;
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    try {
                        this.user = JSON.parse(userStr);
                    } catch (e) {
                        this.user = { nombre: 'Usuario' };
                    }
                }
            } else {
                this.isLoggedIn = false;
                this.user = null;
            }
        }
    }

    openLoginModal() {
        this.showLoginModal = true;
        this.errorMessage = '';
    }

    closeLoginModal() {
        this.showLoginModal = false;
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        this.isLoggedIn = false;
        this.user = null;
        this.router.navigate(['/']);

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        Toast.fire({
            icon: 'info',
            title: 'Sesión cerrada'
        });
    }

    onLoginSubmit() {
        if (this.isLoading) return;
        this.isLoading = true;
        this.errorMessage = '';

        this.http.post<any>(`${environment.apiUrl}/api/auth/login`, this.loginData)
            .subscribe({
                next: (res) => {
                    this.isLoading = false;
                    if (res.token) {
                        if (isPlatformBrowser(this.platformId)) {
                            localStorage.setItem('token', res.token);
                            localStorage.setItem('user', JSON.stringify(res.usuario));
                            window.location.reload();
                        }
                    }
                },
                error: (err) => {
                    console.error('Login Error:', err);

                    // ALERTA VISUAL INMEDIATA (SweetAlert)
                    // Garantiza que el usuario vea el error independientemente del estado de Angular
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Acceso',
                        text: err.error?.message || 'Correo o contraseña incorrectos.',
                        confirmButtonColor: '#00BFA6',
                        heightAuto: false
                    });

                    // Actualización del estado interno
                    this.ngZone.run(() => {
                        this.isLoading = false;
                        this.errorMessage = err.error?.message || 'Correo o contraseña incorrectos.';
                        this.cdr.detectChanges();
                    });
                }
            });
    }
}
