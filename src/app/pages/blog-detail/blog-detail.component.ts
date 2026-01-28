import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Article {
    title: string;
    tag: string;
    author: string;
    readTime: string;
    image: string;
    content: string;
    highlights?: string[];
    quote?: string;
}

@Component({
    selector: 'app-blog-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './blog-detail.component.html',
    styleUrl: './blog-detail.component.css'
})
export class BlogDetailComponent implements OnInit {
    articleId: string | null = null;
    article: Article | null = null;

    articles: { [key: string]: Article } = {
        'crm-ventas': {
            title: 'Cómo aumentar tus ventas un 30% con un CRM',
            tag: 'Destacado',
            author: 'Carlos Gnosis',
            readTime: '8 min',
            image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            content: 'Descubre las estrategias probadas que están utilizando los negocios más exitosos para aprovechar los datos de sus clientes y multiplicar sus ingresos. Implementar un CRM no es solo instalar un software, es cambiar la cultura de tu empresa hacia el cliente.',
            highlights: [
                'Automatiza el seguimiento de prospectos.',
                'Centraliza la comunicación de tu equipo.',
                'Mide cada etapa del embudo de ventas.'
            ]
        },
        'inventario': {
            title: 'Inventario: 5 errores comunes que te cuestan dinero',
            tag: 'Gestión',
            author: 'Ana Torres',
            readTime: '4 min',
            image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            content: 'El inventario es dinero en forma de mercancía. Si no lo cuidas, estás perdiendo capital. Muchos negocios cometen errores simples que, acumulados, representan una fuga de utilidades masiva.',
            highlights: [
                'Falta de Conteos Físicos Regulares: Confiar solo en el sistema es peligroso.',
                'Exceso de Stock (Overstocking): Ata tu flujo de caja innecesariamente.',
                'No usar reportes de rotación para identificar productos estancados.'
            ]
        },
        'seguridad-datos': {
            title: 'Seguridad de datos: Por qué la nube es tu mejor aliado',
            tag: 'Tecnología',
            author: 'Miguel Rivera',
            readTime: '6 min',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            content: 'Muchos dueños de negocios temen "subir sus datos" a internet, pensando que una libreta en un cajón es más segura. La realidad es opuesta: los servidores en la nube cuentan con encriptación de grado militar.',
            quote: 'Un incendio, una inundación o un simple café derramado pueden destruir años de registros en papel en un segundo.'
        },
        'fidelizacion': {
            title: 'Fidelización de clientes: Más allá de los descuentos',
            tag: 'Marketing',
            author: 'Elena Sanz',
            readTime: '5 min',
            image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            content: 'Crear una conexión real con tus clientes es más rentable que cualquier promoción. La fidelización se trata de entender las necesidades del cliente antes de que ellos las expresen.',
            highlights: [
                'Personaliza cada interacción.',
                'Crea un programa de recompensas basado en valor.',
                'Escucha el feedback y actúa en consecuencia.'
            ]
        },
        'analisis-datos': {
            title: 'Toma decisiones basadas en datos, no en intuición',
            tag: 'Analítica',
            author: 'Sofía Analytics',
            readTime: '6 min',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            content: 'Descubre cómo los reportes en tiempo real pueden cambiar el rumbo de tu estrategia comercial. Los datos no mienten, y tenerlos a la mano te da una ventaja competitiva brutal.',
            highlights: [
                'Visualización clara de KPIs.',
                'Identificación de tendencias estacionales.',
                'Optimización de recursos basada en rendimiento real.'
            ]
        },
        'colaboracion-equipo': {
            title: 'Mejora la colaboración de tu equipo de ventas',
            tag: 'Productividad',
            author: 'Javier Equipo',
            readTime: '5 min',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            content: 'Herramientas y prácticas para evitar la duplicidad de esfuerzos y cerrar más tratos juntos. Un equipo sincronizado es un equipo imparable.',
            highlights: [
                'Asignación clara de dueños de prospectos.',
                'Notas compartidas y comunicación interna.',
                'Visibilidad total del progreso de cada negocio.'
            ]
        },
        'automatizacion': {
            title: 'Automatización: Tu vendedor silencioso 24/7',
            tag: 'Innovación',
            author: 'Roberto Gómez',
            readTime: '7 min',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            content: 'Cómo configurar correos automáticos y recordatorios para no perder ninguna oportunidad de venta. La automatización te devuelve el tiempo que necesitas para escalar tu negocio.',
            highlights: [
                'Respuestas automáticas instantáneas.',
                'Recordatorios de seguimiento sin esfuerzo manual.',
                'Sincronización de tareas entre departamentos.'
            ]
        }
    };

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.articleId = params.get('id');
            if (this.articleId && this.articles[this.articleId]) {
                this.article = this.articles[this.articleId];
            }
        });
    }
}
