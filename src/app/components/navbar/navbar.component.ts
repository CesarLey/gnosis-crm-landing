import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit() {
        this.checkLoginStatus();
    }

    checkLoginStatus() {
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

    openLoginModal() {
        this.showLoginModal = true;
    }

    closeLoginModal() {
        this.showLoginModal = false;
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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

        this.http.post<any>(`${environment.apiUrl}/api/auth/login`, this.loginData)
            .subscribe({
                next: (res) => {
                    this.isLoading = false;
                    if (res.token) {
                        localStorage.setItem('token', res.token);
                        localStorage.setItem('user', JSON.stringify(res.usuario));

                        // Forzar recarga para actualizar Navbar y estado global
                        window.location.reload();
                    }
                },
                error: (err) => {
                    this.isLoading = false;
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: err.error?.message || 'Correo o contraseña incorrectos',
                        confirmButtonText: 'Intentar de nuevo'
                    });
                }
            });
    }
}
