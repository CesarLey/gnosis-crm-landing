import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css',
})
export class HelpComponent {
  activeCategory: number | null = null;
  activeFaq: number | null = null;

  toggleCategory(index: number): void {
    if (this.activeCategory === index) {
      this.activeCategory = null;
    } else {
      this.activeCategory = index;
    }
  }

  toggleFaq(index: number): void {
    if (this.activeFaq === index) {
      this.activeFaq = null;
    } else {
      this.activeFaq = index;
    }
  }
}
