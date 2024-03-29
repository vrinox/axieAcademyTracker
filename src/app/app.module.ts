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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AxiesComponent } from './axies/axies.component';
import { LoadingComponent } from './loading/loading.component';
import { StoryComponent } from './pages/story/story.component';
import { MatSelectModule } from '@angular/material/select';
import { LineChartComponent } from './line-chart/line-chart.component';
import { LoginComponent } from './pages/login/login.component';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from '@firebase/auth';
import { StoryDayComponent } from './pages/story-day/story-day.component';
import { TotalsComponent } from './components/totals/totals.component';
import { ReportDailyGeneralComponent } from './pages/report-daily-general/report-daily-general.component';
import { AxiesModuleComponent } from './axies-module/axies-module.component';
import { AxiesListComponent } from './axies-list/axies-list.component';
import { StastAxieComponent } from './stastAxie/stast-axie.component';
import { DonwloadPdfComponent } from './donwload-pdf/donwload-pdf.component';
import { GenesComponent } from './components/genes/genes/genes.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { InputAutoCompletComponent } from './components/input-auto-complet/input-auto-complet.component';
import Web3 from 'web3';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule  } from '@angular/forms';
import { ModalExitPlayerComponent } from './components/modal-exit-player/modal-exit-player.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalDoanteComponent } from './components/modal-doante/modal-doante.component';
import { CommunityPerfilComponent } from './community-perfil/community-perfil.component';
@NgModule({
  declarations: [
    AppComponent,
    ScholarsComponent,
    HistorialComponent,
    FormularioBecadoComponent,
    AxiesComponent,
    LoadingComponent,
    StoryComponent,
    LineChartComponent,
    LoginComponent,
    StoryDayComponent,
    TotalsComponent,
    ReportDailyGeneralComponent,
    AxiesModuleComponent,
    AxiesListComponent,
    StastAxieComponent,
    DonwloadPdfComponent,
    GenesComponent,
    InputAutoCompletComponent,
    PerfilesComponent,
    ModalExitPlayerComponent,
    ModalDoanteComponent,
    CommunityPerfilComponent
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
    MatCheckboxModule,
    MatIconModule,
    MatRadioModule,
    MatFormFieldModule,
    MatButtonToggleModule,
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
    MatPaginatorModule,
    MatBadgeModule,
    MatDividerModule,
    MatSlideToggleModule,
    FormsModule,
    MatDialogModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
