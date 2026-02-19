import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, HttpClientModule, FormsModule, CommonModule, RecaptchaModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  environment = environment; // Hacer disponible para el template
  contactData = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
    captchaToken: ''
  };

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) { }

  onResolved(token: string | null) {
    this.contactData.captchaToken = token || '';
  }

  onSubmit() {
    if (this.isLoading) return;

    if (!this.contactData.captchaToken) {
      this.errorMessage = 'Por favor verifica que no eres un robot.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.post(`${environment.apiUrl}/api/landing/contact`, this.contactData)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.successMessage = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
          this.contactData = { nombre: '', email: '', asunto: '', mensaje: '', captchaToken: '' }; // Reset form
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error enviando contacto', err);
          this.errorMessage = err.error?.message || 'Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.';
        }
      });
  }
}
