import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ResourcesComponent } from './pages/resources/resources.component';
import { ContactComponent } from './pages/contact/contact.component';
import { VideosComponent } from './pages/videos/videos.component';
import { HelpComponent } from './pages/help/help.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';
import { HelpDetailComponent } from './pages/help-detail/help-detail.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'pricing', component: PricingComponent },
    { path: 'clients', component: ClientsComponent },
    { path: 'resources', component: ResourcesComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'videos', component: VideosComponent },
    { path: 'help', component: HelpComponent },
    { path: 'help/:id', component: HelpDetailComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'blog/:id', component: BlogDetailComponent },
    { path: '**', redirectTo: '' }
];
