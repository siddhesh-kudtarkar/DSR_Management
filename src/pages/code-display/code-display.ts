import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, IonicApp } from 'ionic-angular';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { ProductService } from '../../app/services/product.service';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@IonicPage()
@Component({
  selector: 'page-code-display',
  templateUrl: 'code-display.html',
})
export class CodeDisplayPage {

  public codeType;
  public codeValue;

  @ViewChild('barcode') barcode: ElementRef;
  @ViewChild('barcode1') barcode1: ElementRef;
  @ViewChild('qrcode') qrcode: ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ionicApp: IonicApp, public base64: Base64ToGallery, public productService: ProductService, public androidPermissions: AndroidPermissions) {
    this.codeType = this.navParams.get('codeType');
    this.codeValue = this.navParams.get('value');
  }

  ionViewDidLoad() {
    this.productService.getStoragePermissions();
    if (this.codeType == 'barcode') {
      this.displayBarcode(this.codeValue);
    } else {
      this.displayQrCode(this.codeValue);
    }
  }

  closeModal() {
    let activeModal = this.ionicApp._modalPortal.getActive();
    if(activeModal) {
      activeModal.dismiss();
      return;
    }
  }

  displayBarcode(value) {
    this.productService.displayBarcode(this.barcode.nativeElement, value);
  }

  displayQrCode(codeValue) {
    this.productService.displayQrCode(this.qrcode.nativeElement, codeValue);
  }

  saveBarcode() {
    this.productService.saveBarcode(this.barcode.nativeElement);
  }

  saveQrCode() {
    this.productService.saveQrCode(this.qrcode.nativeElement);
  }
}