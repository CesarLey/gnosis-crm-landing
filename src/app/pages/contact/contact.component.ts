import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, HttpClientModule, FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contactData = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  };

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) { }

  onSubmit() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.post(`${environment.apiUrl}/api/landing/contact`, this.contactData)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.successMessage = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
          this.contactData = { nombre: '', email: '', asunto: '', mensaje: '' }; // Reset form
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error enviando contacto', err);
          this.errorMessage = err.error?.message || 'Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.';
        }
      });
  }
}
