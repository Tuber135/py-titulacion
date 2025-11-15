import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio-sesion', pathMatch: 'full' },
  { path: 'inicio-sesion', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'registro', component: RegisterComponent, data: { animation: 'RegisterPage' } },
  { path: '**', redirectTo: '/inicio-sesion' }
];
