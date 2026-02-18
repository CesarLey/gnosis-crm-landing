import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-pricing',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './pricing.component.html',
    styleUrl: './pricing.component.css'
})
export class PricingComponent {
    isAnnual = signal(true);

    constructor(
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    toggleBilling(event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        this.isAnnual.set(isChecked);
    }

    selectPlan(plan: string): void {
        const billing = this.isAnnual() ? 'anual' : 'mensual';
        let isLoggedIn = false;

        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token');
            isLoggedIn = !!token;
        }

        if (isLoggedIn) {
            // Usuario logueado: ir directo a checkout
            this.router.navigate(['/checkout'], {
                queryParams: { plan, billing }
            });
        } else {
            // Usuario nuevo: ir a registro
            this.router.navigate(['/register'], {
                queryParams: { plan, billing }
            });
        }
    }
}
