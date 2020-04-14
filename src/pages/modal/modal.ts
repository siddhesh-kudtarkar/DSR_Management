import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, IonicApp, ModalController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CodeDisplayPage } from '../code-display/code-display';
import { ProductService } from '../../app/services/product.service';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  public barcodeForm: FormGroup;
  public storeCodeForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ionicApp: IonicApp, public fb: FormBuilder, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public productService: ProductService) {

    this.barcodeForm = this.fb.group({
      'serialNo': ['', Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.pattern('^[a-zA-Z0-9]+$'), Validators.required])]
    });

    this.storeCodeForm = this.fb.group({
      'serialNo': ['', Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.pattern('^[a-zA-Z0-9]+$'), Validators.required])],

      'department': ['', Validators.required],

      'referenceNo': ['', Validators.compose([Validators.minLength(1), Validators.maxLength(25), Validators.pattern('^[a-zA-Z0-9/_-].*?$'), Validators.required])],

      'productType': ['', Validators.required],

      'dateOfPurchase': ['', Validators.required],

      'productCost': ['', Validators.compose([Validators.minLength(2), Validators.maxLength(15), Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'), Validators.required])]
    });

  }

  closeModal() {
    let activeModal = this.ionicApp._modalPortal.getActive();
    if(activeModal) {
      activeModal.dismiss();
      return;
    }
  }

  generateBarcode() {
    this.closeModal();
    let barcodeModal = this.modalCtrl.create(CodeDisplayPage, {'codeType': 'barcode', 'value': this.barcodeForm.value.serialNo});
    barcodeModal.present();
  }

}
