import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css',
})
export class HelpComponent {
  activeCategory: number | null = null;
  activeFaq: number | null = null;

  constructor(private router: Router) { }

  navigateToArticle(id: string): void {
    this.router.navigate(['/help', id]);
  }

  categories = [
    {
      id: 'onboarding',
      title: 'Comenzando',
      description: 'Configuración inicial, primeros pasos y personalización básica.',
      icon: 'fa-solid fa-rocket',
      image: '/images/help/onboarding.png'
    },
    {
      id: 'ventas',
      title: 'Ventas y Caja',
      description: 'Cómo registrar ventas, hacer cortes de caja y devoluciones.',
      icon: 'fa-solid fa-cash-register',
      image: '/images/help/sales.png'
    },
    {
      id: 'inventario',
      title: 'Inventario',
      description: 'Gestión de productos, stock, proveedores y almacenes.',
      icon: 'fa-solid fa-boxes-stacked',
      image: '/images/help/inventory.png'
    },
    {
      id: 'reportes',
      title: 'Reportes',
      description: 'Entiende tus métricas, exporta datos y analiza tu crecimiento.',
      icon: 'fa-solid fa-chart-pie',
      image: '/images/help/reports.png'
    },
    {
      id: 'pagos',
      title: 'Cuenta y Pagos',
      description: 'Gestión de suscripción, facturación y detalles de la cuenta.',
      icon: 'fa-regular fa-credit-card',
      image: '/images/help/account.png'
    },
    {
      id: 'soporte',
      title: 'Solución de Problemas',
      description: 'Resolución de errores comunes y herramientas de diagnóstico.',
      icon: 'fa-solid fa-screwdriver-wrench',
      image: '/images/help/troubleshooting.png'
    }
  ];

  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? null : index;
  }

  faqs = [
    {
      q: '¿Cómo puedo restablecer mi contraseña?',
      a: 'Ve a la pantalla de inicio de sesión y selecciona "¿Olvidaste tu contraseña?". Recibirás un correo electrónico con un enlace seguro para crear una nueva.'
    },
    {
      q: '¿Puedo usar Gnosis CRM sin conexión a internet?',
      a: 'Sí, la versión de escritorio permite realizar ventas básicas en modo offline. Los datos se sincronizarán automáticamente cuando recuperes la conexión.'
    },
    {
      q: '¿Cómo exporto mis reportes a Excel?',
      a: 'En la sección de "Reportes", selecciona el rango de fechas deseado y haz clic en el botón "Exportar" situado en la esquina superior derecha de la tabla.'
    },
    {
      q: '¿Cómo agrego a mis empleados como usuarios?',
      a: 'En la sección de "Cuenta", ve a "Usuarios" y haz clic en "Nuevo Usuario". Podrás definir su rol (cajero, administrador, etc.) y sus permisos específicos.'
    },
    {
      q: '¿Gnosis CRM trabaja con lectores de códigos de barras?',
      a: '¡Totalmente! El sistema es compatible con cualquier lector láser o inalámbrico USB. Solo conéctalo y escanea tus productos en la pantalla de ventas.'
    },
    {
      q: '¿Dónde puedo descargar las facturas de mi suscripción?',
      a: 'Entra a "Configuración" > "Suscripción" y encontrarás el historial completo de tus pagos con enlaces para descargar cada factura en PDF.'
    },
    {
      q: '¿Cómo realizo un traspaso entre sucursales?',
      a: 'Ve al módulo de "Almacén", selecciona "Nueva Transferencia", elige el origen, el destino y los productos. El sistema actualizará el stock automáticamente.'
    },
    {
      q: '¿Tienen soporte por WhatsApp?',
      a: 'Sí, nuestro equipo técnico atiende consultas rápidas por WhatsApp. Puedes encontrar el enlace directo en la burbuja de ayuda dentro de la aplicación.'
    }
  ];
}
