import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ProductService } from '../../app/services/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoginPage } from '../login/login';
import { NoInternetPage } from '../no-internet/no-internet';

@IonicPage()
@Component({
  selector: 'page-user-account',
  templateUrl: 'user-account.html',
})
export class UserAccountPage {

  public username;
  public userId;
  public accountForm: FormGroup;
  public isDisabled: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public productService: ProductService, public fb: FormBuilder, public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

    this.accountForm = this.fb.group({
      'firstName': ['', Validators.compose([Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^(?![\. ])[a-zA-Z\. ]+(?<! )$'), Validators.required])],
      
      'lastName': ['', Validators.compose([Validators.minLength(3), Validators.maxLength(30), Validators.pattern('^(?![\. ])[a-zA-Z\. ]+(?<! )$'), Validators.required])],

      'email': ['', Validators.compose([Validators.email, Validators.required])],
      
      'shareId': ['', Validators.compose([Validators.minLength(2), Validators.maxLength(7), Validators.pattern('^[a-zA-Z0-9]+$'), Validators.required])]
    });
    
  }

  ngOnInit() {
    if (this.checkInternet() == true) {
      this.getStorageDetails();
    }
  }

  getStorageDetails() {
    this.storage.get('userId').then(
      res => this.userId = res,
      err => this.productService.showAlert('Error', '', err)
    );
    this.storage.get('username').then(
      res => this.username = res,
      err => this.productService.showAlert('Error', '', err)
    );
    this.storage.get('userEmailId').then(
      res => this.accountForm.patchValue({
        'email': res
      }),
      err => this.productService.showAlert('Error', '', err)
    );
    this.storage.get('userFirstName').then(
      res => this.accountForm.patchValue({
        'firstName': res
      }),
      err => this.productService.showAlert('Error', '', err)
    );
    this.storage.get('userLastName').then(
      res => this.accountForm.patchValue({
        'lastName': res
      }),
      err => this.productService.showAlert('Error', '', err)
    );
    this.storage.get('userShareId').then(
      res => this.accountForm.patchValue({
        'shareId': res
      }),
      err => this.productService.showAlert('Error', '', err)
    );
  }

  edit() {
    this.isDisabled = false;
    this.productService.showToast('You can now edit your account details', 'bottom');
  }

  saveChanges() {
    this.isDisabled = true;
    let form = this.accountForm.value;
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let data = {
      mode: "updateUserDetails",
      username: this.username,
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim(),
      share_id: form.shareId.trim()
    };

    let loader = this.loadingCtrl.create({
      content: 'Saving changes to your account, please wait...',
      cssClass: 'fontChange fontSize'
    });

    loader.present().then(() => {
      this.http.post('http://your.server-url.com/update_data.php', data, options).map(res => res.json())
        .subscribe((res) => {
          loader.dismiss();
          if (res == "Account Details updated successfully") {
            this.productService.showToast(res, 'bottom');
          } 
          else {
            this.productService.showAlert('Failed to update the account details', '', res);
          }
          this.storage.set('userEmailId', form.email.trim());
          this.storage.set('userShareId', form.shareId.trim());
          this.storage.set('userFirstName', form.firstName.trim());
          this.storage.set('userLastName', form.lastName.trim());
        });
    });
  }

  deleteAccount() {
    const alert = this.alertCtrl.create({
      title: 'Delete Account?',
      message: 'All of your account details along with the stored code records will be deleted.',
      cssClass: 'fontChange fontSize',
      buttons: [{
        text: 'No',
        cssClass: 'fontChange fontSize',
        role: 'cancel'
      }, {
        text: 'Yes',
        cssClass: 'fontChange fontSize',
        handler: () => {
          this.storage.get('userId').then(
            (res) => {
              this.productService.deleteUserAccount(res);
              this.storage.remove('userLoggedIn');
              this.navCtrl.setRoot(LoginPage);
            },
            err => this.productService.showAlert('Error', '', err)
          );
        }
      }]
    });
    alert.present();
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