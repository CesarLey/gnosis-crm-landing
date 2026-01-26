import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ResourcesComponent } from './pages/resources/resources.component';
import { ContactComponent } from './pages/contact/contact.component';
import { VideosComponent } from './pages/videos/videos.component';
import { HelpComponent } from './pages/help/help.component';
import { BlogComponent } from './pages/blog/blog.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'pricing', component: PricingComponent },
    { path: 'clients', component: ClientsComponent },
    { path: 'resources', component: ResourcesComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'videos', component: VideosComponent },
    { path: 'help', component: HelpComponent },
    { path: 'blog', component: BlogComponent },
    { path: '**', redirectTo: '' }
];
