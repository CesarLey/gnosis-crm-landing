import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginData = {
        email: '',
        password: '',
        rememberMe: false
    };

    onSubmit() {
        console.log('Login attempt:', this.loginData);
        // Logic for login would go here
    }
}
