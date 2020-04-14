import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegisterPageModule } from '../pages/register/register.module';
import { LoginPageModule } from '../pages/login/login.module';
import { ProductService } from './services/product.service';
import { UserAccountPageModule } from '../pages/user-account/user-account.module';
import { GetDataPageModule } from '../pages/get-data/get-data.module';
import { GenerateCodePageModule } from '../pages/generate-code/generate-code.module';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { IonicStorageModule } from '@ionic/storage';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalPageModule } from '../pages/modal/modal.module';
import { CodeDisplayPageModule } from '../pages/code-display/code-display.module';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'; 
import { CodeDetailsPageModule } from '../pages/code-details/code-details.module';
import { NoInternetPageModule } from '../pages/no-internet/no-internet.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    LoginPageModule,
    RegisterPageModule,
    UserAccountPageModule,
    GetDataPageModule,
    GenerateCodePageModule,
    ModalPageModule,
    CodeDisplayPageModule,
    CodeDetailsPageModule,
    NoInternetPageModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProductService,
    BarcodeScanner,
    Base64ToGallery,
    AndroidPermissions
  ]
})
export class AppModule {}
