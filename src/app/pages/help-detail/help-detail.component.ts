import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface HelpArticle {
    title: string;
    description: string;
    icon: string;
    image: string;
    links: { title: string; desc: string }[];
}

@Component({
    selector: 'app-help-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './help-detail.component.html',
    styleUrl: './help-detail.component.css'
})
export class HelpDetailComponent implements OnInit {
    articleId: string | null = null;
    article: HelpArticle | null = null;

    articles: { [key: string]: HelpArticle } = {
        'onboarding': {
            title: 'Comenzando',
            description: 'Configuración inicial, primeros pasos y personalización básica.',
            icon: 'fa-solid fa-rocket',
            image: '/images/help/onboarding.png',
            links: [
                { title: 'Crear mi cuenta', desc: 'Regístrate con tu correo y configura tu perfil de administrador.' },
                { title: 'Instalar la App Desktop', desc: 'Descarga e instala Gnosis en Windows o Mac para mejor rendimiento.' },
                { title: 'Importar productos (Excel)', desc: 'Carga tu inventario masivamente usando nuestra plantilla CSV.' },
                { title: 'Configurar impresora', desc: 'Conecta tu impresora térmica para tickets y etiquetas.' }
            ]
        },
        'ventas': {
            title: 'Ventas y Caja',
            description: 'Cómo registrar ventas, hacer cortes de caja y devoluciones.',
            icon: 'fa-solid fa-cash-register',
            image: '/images/help/sales.png',
            links: [
                { title: 'Registrar nueva venta', desc: 'Escanea productos, selecciona cliente y procesa el pago.' },
                { title: 'Realizar corte de caja', desc: 'Cierra el turno, cuenta el efectivo y genera el reporte del día.' },
                { title: 'Aplicar descuentos', desc: 'Configura promociones automáticas o descuentos manuales.' },
                { title: 'Gestionar devoluciones', desc: 'Procesa reembolsos y reingresa productos al stock.' }
            ]
        },
        'inventario': {
            title: 'Inventario',
            description: 'Gestión de productos, stock, proveedores y almacenes.',
            icon: 'fa-solid fa-boxes-stacked',
            image: '/images/help/inventory.png',
            links: [
                { title: 'Agregar productos', desc: 'Crea fichas de producto con precio, costo, imágenes y códigos.' },
                { title: 'Ajustes de stock', desc: 'Registra entradas por compra, salidas por merma o uso interno.' },
                { title: 'Gestionar proveedores', desc: 'Administra tu lista de proveedores y órdenes de compra.' },
                { title: 'Transferencias entre almacenes', desc: 'Mueve mercancía entre sucursales o bodegas fácilmente.' }
            ]
        },
        'reportes': {
            title: 'Reportes',
            description: 'Entiende tus métricas, exporta datos y analiza tu crecimiento.',
            icon: 'fa-solid fa-chart-pie',
            image: '/images/help/reports.png',
            links: [
                { title: 'Reporte de ventas diarias', desc: 'Visualiza ingresos por hora, método de pago y vendedor.' },
                { title: 'Productos más vendidos', desc: 'Identifica tus estrellas y optimiza tu mix de productos.' },
                { title: 'Exportar a Excel/PDF', desc: 'Descarga cualquier tabla de datos para análisis externo.' },
                { title: 'Análisis de ganancias', desc: 'Calcula utilidad bruta y neta descontando costos operativos.' }
            ]
        },
        'pagos': {
            title: 'Cuenta y Pagos',
            description: 'Gestión de suscripción, facturación y detalles de la cuenta.',
            icon: 'fa-regular fa-credit-card',
            image: '/images/help/account.png',
            links: [
                { title: 'Cambiar plan de suscripción', desc: 'Mejora tu plan o cambia la frecuencia de facturación.' },
                { title: 'Descargar facturas', desc: 'Obtén los comprobantes fiscales de tus pagos a Gnosis.' },
                { title: 'Actualizar método de pago', desc: 'Cambia tu tarjeta de crédito o datos de facturación.' },
                { title: 'Administrar usuarios', desc: 'Agrega cajas o vendedores y define sus permisos.' }
            ]
        },
        'soporte': {
            title: 'Solución de Problemas',
            description: 'Resolución de errores comunes y herramientas de diagnóstico.',
            icon: 'fa-solid fa-screwdriver-wrench',
            image: '/images/help/troubleshooting.png',
            links: [
                { title: 'Error de conexión', desc: 'Pasos para diagnosticar y restablecer la conexión al servidor.' },
                { title: 'Problemas con la impresora', desc: 'Guía para calibrar y reconectar impresoras térmicas.' },
                { title: 'Restablecer contraseña', desc: 'Recupera el acceso a tu cuenta si olvidaste tus credenciales.' },
                { title: 'Contactar soporte técnico', desc: 'Abre un ticket de ayuda o chatea con un agente en vivo.' }
            ]
        }
    };

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.articleId = params.get('id');
            if (this.articleId && this.articles[this.articleId]) {
                this.article = this.articles[this.articleId];
                window.scrollTo(0, 0);
            }
        });
    }
}
