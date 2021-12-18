import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScholarsComponent } from './scholars/scholars.component';
import { AxiesComponent } from './axies/axies.component';
import { StoryComponent } from './pages/story/story.component';
import { LoginComponent } from './pages/login/login.component';
import { StoryDayComponent } from './pages/story-day/story-day.component';
import { ReportDailyGeneralComponent } from './pages/report-daily-general/report-daily-general.component';
import { PerfilesComponent } from './perfiles/perfiles.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'scholars', component: ScholarsComponent },
  { path: 'axies', component: AxiesComponent },
  { path: 'story', component: StoryComponent },
  { path: 'storyDay', component: StoryDayComponent },
  { path: 'reportDailyGeneral', component: ReportDailyGeneralComponent },
  { path: 'login', component: LoginComponent },
  { path: 'prefiles', component: PerfilesComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
