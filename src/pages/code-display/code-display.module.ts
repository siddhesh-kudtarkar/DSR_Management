import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CodeDisplayPage } from './code-display';

@NgModule({
  declarations: [
    CodeDisplayPage,
  ],
  imports: [
    IonicPageModule.forChild(CodeDisplayPage),
  ],
})
export class CodeDisplayPageModule {}
