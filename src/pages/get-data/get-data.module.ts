import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GetDataPage } from './get-data';

@NgModule({
  declarations: [
    GetDataPage,
  ],
  imports: [
    IonicPageModule.forChild(GetDataPage),
  ],
})
export class GetDataPageModule {}
