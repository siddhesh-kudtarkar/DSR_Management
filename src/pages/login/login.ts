import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { RegisterPage } from '../register/register';
import { ProductService } from '../../app/services/product.service';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { NoInternetPage } from '../no-internet/no-internet';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: FormGroup;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder, private storage: Storage, public toastCtrl: ToastController, public productService: ProductService, public http: Http, public loadingCtrl: LoadingController) {

    this.loginForm = fb.group({
      'username': ['', Validators.compose([Validators.minLength(5), Validators.required])],

      'password': ['', Validators.compose([Validators.minLength(5), Validators.required])]
    });

  }

  ngOnInit() {
    this.checkInternet();
  }

  ionViewDidEnter() {
    let firstName, lastName;
    this.storage.get('userFirstName').then(
      res => firstName = res,
      err => console.log(err)
    );
    this.storage.get('userLastName').then(
      res => lastName = res,
      err => console.log(err)
    );
    this.storage.get('userLoggedIn').then(
      (res) => {
        if (res == true) {
          this.navCtrl.setRoot(HomePage);
          this.productService.showToast('Welcome back, ' + firstName + ' ' + lastName + '.', 'bottom');
        }
      },
      err => this.productService.showAlert('Error', '', err)
    );
  }

  guestLogin() {
    this.storage.set('userType', 'Guest');
    this.navCtrl.setRoot(HomePage);
    this.productService.showToast('With guest account, you can only scan QR code / Barcode but cannot save them.', 'bottom');
  }

  login(username, password) {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({
      headers: headers
    });

    let data = {
      mode: "loginUser",
      username: username.trim(),
      password: password.trim(),
    };

    let loader = this.loadingCtrl.create({
      content: 'Checking credentials, please wait...',
      cssClass: 'fontChange fontSize'
    });

    loader.present().then(() => {

      this.http.post('http://sidsk99.heliohost.org/dsr/fetch_data.php', data, options)
        .map(res => res.json())
        .subscribe((res) => {
          loader.dismiss();
          if (res == "Login successful") {
            this.storage.set('username', username);
            this.storage.set('userLoggedIn', true);
            this.fetchUserDetails(username, password);
          } else {
            this.storage.set('userLoggedIn', false);
            this.productService.showAlert('Error', '', 'No such user found. Make sure that your login credentials are correct or register your account if not done.');
          }
        },
        err => this.productService.showAlert('Error', '', err)
        );
    });
  }

  fetchUserDetails(username, password) {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({
      headers: headers
    });

    let data = {
      mode: "fetchUserDetails",
      username: username.trim(),
      password: password.trim(),
    };

    let loader = this.loadingCtrl.create({
      content: 'Getting your account details, please wait...',
      cssClass: 'fontChange fontSize'
    });

    loader.present().then(() => {

      this.http.post('http://sidsk99.heliohost.org/dsr/fetch_data.php', data, options)
        .map(res => res.json())
        .subscribe((res) => {
          loader.dismiss();
          let user = res[0];
          this.storage.set('userId', user.id);
          this.storage.set('userFirstName', user.first_name);
          this.storage.set('userLastName', user.last_name);
          this.storage.set('userEmailId', user.email);
          this.storage.set('userShareId', user.share_id);
          this.storage.set('userType', 'User');
          this.navCtrl.setRoot(HomePage);
          this.productService.showToast('Welcome, ' + user.first_name + ' ' + user.last_name + '.', 'bottom');
        },
        err => this.productService.showAlert('Error', '', err)
        );
    });
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  get username() {
    return this.loginForm.get("username");
  }

  get password() {
    return this.loginForm.get("password");
  }

  checkInternet() {
    if (navigator.onLine == false) {
      this.navCtrl.setRoot(NoInternetPage);
      return false;
    } else {
      return true;
    }
  }
}