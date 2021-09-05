import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScholarsComponent } from './scholars/scholars.component';

const routes: Routes = [
  { path: '', redirectTo: '/scholars', pathMatch: 'full' },
  { path: 'scholars' , component: ScholarsComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
