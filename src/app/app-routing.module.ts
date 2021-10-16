import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScholarsComponent } from './scholars/scholars.component';
import { GraficasComponent } from './graficas/graficas.component';
import { AxiesComponent } from './axies/axies.component';
import { StoryComponent } from './story/story.component';

const routes: Routes = [
  { path: '', redirectTo: '/scholars', pathMatch: 'full' },
  { path: 'scholars', component: ScholarsComponent },
  { path: 'historic/:roninAddress', component: GraficasComponent },
  { path: 'axies', component: AxiesComponent },
  { path: 'story', component: StoryComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
