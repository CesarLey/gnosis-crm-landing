import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

interface Country {
    name: string;
    code: string;
    flag: string;
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [RouterLink, FormsModule, NgIf, NgFor],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    registerData = {
        email: '',
        phone: '',
        password: ''
    };

    countries: Country[] = [
        { name: 'México', code: '+52', flag: 'https://flagcdn.com/w20/mx.png' },
        { name: 'Estados Unidos', code: '+1', flag: 'https://flagcdn.com/w20/us.png' },
        { name: 'Colombia', code: '+57', flag: 'https://flagcdn.com/w20/co.png' },
        { name: 'Argentina', code: '+54', flag: 'https://flagcdn.com/w20/ar.png' },
        { name: 'Chile', code: '+56', flag: 'https://flagcdn.com/w20/cl.png' },
        { name: 'Perú', code: '+51', flag: 'https://flagcdn.com/w20/pe.png' },
        { name: 'España', code: '+34', flag: 'https://flagcdn.com/w20/es.png' },
        { name: 'Ecuador', code: '+593', flag: 'https://flagcdn.com/w20/ec.png' }
    ];

    selectedCountry: Country = this.countries[0];
    showCountryDropdown = false;

    toggleCountryDropdown() {
        this.showCountryDropdown = !this.showCountryDropdown;
    }

    selectCountry(country: Country) {
        this.selectedCountry = country;
        this.showCountryDropdown = false;
    }

    onSubmit() {
        console.log('Register attempt:', {
            ...this.registerData,
            phoneCode: this.selectedCountry.code
        });
        // Logic for registration would go here
    }
}
