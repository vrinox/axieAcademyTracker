import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScholarsComponent } from './scholars/scholars.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { HistorialComponent } from './scholars/subComponent/historial/historial.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FormularioBecadoComponent } from './formulario-becado/formulario-becado.component';
import { MatFormFieldModule  } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { GraficasComponent } from './graficas/graficas.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AxiesComponent } from './axies/axies.component';
import { LoadingComponent } from './loading/loading.component';
import { StoryComponent } from './pages/story/story.component';
import { MatSelectModule } from '@angular/material/select';
import { LineChartComponent } from './line-chart/line-chart.component';
import { LoginComponent } from './pages/login/login.component';
import { Auth, provideAuth } from '@angular/fire/auth';
import { getAuth } from '@firebase/auth';
import { StoryDayComponent } from './pages/story-day/story-day.component';
import { TotalsComponent } from './components/totals/totals.component';
import { ReportDailyGeneralComponent } from './pages/report-daily-general/report-daily-general.component';


@NgModule({
  declarations: [
    AppComponent,
    ScholarsComponent,
    HistorialComponent,
    FormularioBecadoComponent,
    GraficasComponent,
    AxiesComponent,
    LoadingComponent,
    StoryComponent,
    LineChartComponent,
    LoginComponent,
    StoryDayComponent,
    TotalsComponent,
    ReportDailyGeneralComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    HttpClientModule,
    MatCardModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSortModule,
    MatMenuModule,
    MatSliderModule,
    MatChipsModule,
    MatSelectModule,
    MatListModule,
    MatBadgeModule,
    MatDividerModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),    
    provideAuth(() => getAuth()),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
