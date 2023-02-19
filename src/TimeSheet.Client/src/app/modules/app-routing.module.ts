import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeSheetComponent } from '../components/time-sheet/time-sheet.component';
import { AuthGuardService } from '../services/auth-guard.service';
import { LoginComponent } from '../components/home/login/login.component';
import { SettingsComponent } from '../components/settings/settings.component';
import { ErrorPageComponent } from '../components/error-page/error-page.component';
import { HomeComponent } from '../components/home/home.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/time-sheet',
    pathMatch: 'full',
  },
  {
    path: 'time-sheet',
    component: TimeSheetComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'login',
    component: HomeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'logoff',
    component: HomeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'not-found',
    component: ErrorPageComponent,
    data: { message: 'notFound' },
  },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
