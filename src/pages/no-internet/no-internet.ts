import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProductService } from '../../app/services/product.service';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-no-internet',
  templateUrl: 'no-internet.html',
})
export class NoInternetPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public productService: ProductService) {
  }

  checkInternet() {
    if (navigator.onLine == true) {
      this.navCtrl.setRoot(LoginPage);
    } else {
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }
  }

}
