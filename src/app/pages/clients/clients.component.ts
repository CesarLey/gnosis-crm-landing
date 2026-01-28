import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent {
  testimonials = [
    {
      name: 'Carlos R.',
      role: 'Dueño de Restaurante',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: 'La mejor inversión para mi negocio. El soporte es increíble y la plataforma nunca falla.',
      rating: 5
    },
    {
      name: 'Ana M.',
      role: 'Veterinaria',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: 'Antes usaba Excel y era un caos. Gnosis me dio paz mental y control total.',
      rating: 4.5
    },
    {
      name: 'Roberto G.',
      role: 'Tienda de Abarrotes',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      text: 'Intuitivo y poderoso. Mis empleados aprendieron a usarlo en menos de una hora.',
      rating: 4
    },
    {
      name: 'Elena S.',
      role: 'Diseñadora Freelance',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      text: 'Como freelance, el caos era mi día a día. Gnosis puso orden en mis proyectos y facturación.',
      rating: 5
    },
    {
      name: 'Javier D.',
      role: 'CEO Startup Tech',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      text: 'Necesitábamos algo que escalara con nosotros. Gnosis ha crecido junto a nuestra base de usuarios.',
      rating: 4.5
    },
    {
      name: 'Maria F.',
      role: 'Gerente de Ventas',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      text: 'Mi equipo está más coordinado que nunca. La duplicidad de tareas desapareció por completo.',
      rating: 4
    }
  ];
}
