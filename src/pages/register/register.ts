import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../app/services/product.service';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { NoInternetPage } from '../no-internet/no-internet';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public registerForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public fb: FormBuilder, public productService: ProductService, public http: Http, public loadingCtrl: LoadingController) {

    this.registerForm = this.fb.group({
      'firstName': ['', Validators.compose([Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^(?![\. ])[a-zA-Z\. ]+(?<! )$'), Validators.required])],
      
      'lastName': ['', Validators.compose([Validators.minLength(3), Validators.maxLength(30), Validators.pattern('^(?![\. ])[a-zA-Z\. ]+(?<! )$'), Validators.required])],
      
      'username': ['', Validators.compose([Validators.minLength(5), Validators.required])],

      'email': ['', Validators.compose([Validators.email, Validators.required])],

      'password': ['', Validators.compose([Validators.minLength(5), Validators.required])],
      
      'shareId': ['', Validators.compose([Validators.minLength(2), Validators.maxLength(7), Validators.pattern('^[a-zA-Z0-9]+$'), Validators.required])]
    });
  }

  ngOnInit() {
    this.checkInternet();
  }

  login() {
    this.storage.set('userType', '');
    this.navCtrl.pop();
  }

  register(usernameExists) {
    if (usernameExists == "Present") {
      this.productService.showAlert('Username already taken', '', 'The username you have entered is already in use. Please try some different username.');
    } else {
      let form = this.registerForm.value;
      let headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      let data = {
        mode: "addUser",
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        share_id: form.shareId.trim()
      };

      let loader = this.loadingCtrl.create({
        content: 'Registering your account, please wait...',
        cssClass: 'fontChange fontSize'
      });

      loader.present().then(() => {
        this.http.post('http://sidsk99.heliohost.org/dsr/add_data.php', data, options).map(res => res.json())
          .subscribe((res) => {
            loader.dismiss();
            if (res == "Registration successful") {
              this.navCtrl.pop();
              this.productService.showToast(res + '. Now, login with your credentials.', 'bottom');
            } else {
              this.productService.showAlert('Failed to register', '', res);
            }
            this.registerForm.patchValue({
              'firstName': '',
              'lastName': '',
              'email': '',
              'username': '',
              'password': '',
              'userType': ''
            });
            this.navCtrl.pop().then(() => {
              this.productService.showToast('Now, login with your credentials.', 'bottom');
            }).catch(err => {
              console.log(err);
            });
          },
          err => this.productService.showAlert('Error', '', err)
          );
      });
    }
  }

  checkUsername() {
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let data = {
      mode: "checkUsername",
      username: this.registerForm.value.username.trim()
    };

    let loader = this.loadingCtrl.create({
      content: 'Checking if username is already taken...',
      cssClass: 'fontChange fontSize'
    });

    loader.present().then(() => {
      this.http.post('http://sidsk99.heliohost.org/dsr/check_data.php', data, options).map(res => res.json()).subscribe(
        (res) => {
          loader.dismiss();
          this.register(res);
        }, 
        (err) => {
          this.productService.showAlert('Error', '', err);
        }
      );
    });
  }

  get firstName() {
    return this.registerForm.get("firstName");
  }

  get lastName() {
    return this.registerForm.get("lastName");
  }

  get username() {
    return this.registerForm.get("username");
  }

  get email() {
    return this.registerForm.get("email");
  }

  get password() {
    return this.registerForm.get("password");
  }

  get shareId() {
    return this.registerForm.get("shareId");
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
