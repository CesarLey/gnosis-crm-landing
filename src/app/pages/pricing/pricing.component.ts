import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pricing',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pricing.component.html',
    styleUrl: './pricing.component.css'
})
export class PricingComponent {
    isAnnual = signal(true);

    toggleBilling(event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        this.isAnnual.set(isChecked);
    }
}
