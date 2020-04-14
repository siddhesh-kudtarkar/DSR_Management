import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProductService } from './services/product.service';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;
  showAlert;
  confirmAlert;

  @ViewChild('content') nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public productService: ProductService, public alertCtrl: AlertController, public storage: Storage) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.showAlert = false;
    platform.registerBackButtonAction(() => {
      if (this.nav.length() == 1) {
        if (!this.showAlert) {
          this.showAlert = true;
          this.confirmAlert = this.alertCtrl.create({
            title: 'Confirm Exit',
            message: 'Do you really want to exit the app?',
            buttons: [{
              text: 'Yes',
              handler: () => {
                platform.exitApp();
              },
              cssClass: 'fontChange fontSize'
            }, {
              text: 'No',
              handler: () => {
                this.showAlert = false;
                return;
              },
              cssClass: 'fontChange fontSize'
            }],
            cssClass: 'fontChange fontSize'
          });
          this.confirmAlert.present();
        } 
        else {
            this.showAlert = false;
            this.confirmAlert.dismiss();
            this.nav.pop();
        }
      }
    });

    this.storage.get('userLoggedIn').then(
      (res) => {
        if (res == false || res == '') {
          this.storage.clear();
        }
      },
      err => this.productService.showAlert('Error', '', err)
    );
  }
}

