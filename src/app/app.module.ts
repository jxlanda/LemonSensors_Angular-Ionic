import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { UsersService} from 'src/app/services/users.service';
import { MessagingService } from 'src/app/services/messaging.service';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'src/app/interceptor/TokenInterceptor';

import { NgxLetterImageAvatarModule } from 'ngx-letter-image-avatar';

import { UserModalComponent } from './components/user-modal/user-modal.component';
import { AvatarMenuComponent } from './components/avatar-menu/avatar-menu.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ImagepreloaderDirective } from './directives/imagepreloader.directive';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UserModalMobileComponent } from './components/user-modal-mobile/user-modal-mobile.component';
import { ModalGuard } from './guards/modal.guard';

import localeEs from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { SensorModalComponent } from './components/sensor-modal/sensor-modal.component';
import { SensorModalMobileComponent } from './components/sensor-modal-mobile/sensor-modal-mobile.component';
import { ChartDialogComponent } from './components/chart-dialog/chart-dialog.component';
registerLocaleData(localeEs, 'es-MX');

@NgModule({
  declarations: [
    AppComponent, 
    UserModalComponent, 
    AvatarMenuComponent, 
    ConfirmationDialogComponent, 
    ImagepreloaderDirective, 
    UserModalMobileComponent,
    SensorModalComponent,
    SensorModalMobileComponent,
    ChartDialogComponent
  ],
  entryComponents: [
    UserModalComponent, 
    UserModalMobileComponent, 
    ConfirmationDialogComponent,
    SensorModalComponent,
    SensorModalMobileComponent,
    ChartDialogComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({mode: 'md'}),
    AppRoutingModule,
    ServiceWorkerModule.register('combined-sw.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    NgxLetterImageAvatarModule,
    Ng2SearchPipeModule,
  ],
  exports: [MaterialModule, NgxLetterImageAvatarModule, Ng2SearchPipeModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es-MX' },
    UsersService,
    MessagingService,
    ModalGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
