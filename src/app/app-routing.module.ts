import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScholarsComponent } from './scholars/scholars.component';
import { GraficasComponent } from './graficas/graficas.component';
import { AxiesComponent } from './axies/axies.component';

const routes: Routes = [
  { path: '', redirectTo: '/scholars', pathMatch: 'full' },
  { path: 'scholars', component: ScholarsComponent },
  { path: 'historic/:roninAddress', component: GraficasComponent },
  { path: 'axies/:scholar', component: AxiesComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
