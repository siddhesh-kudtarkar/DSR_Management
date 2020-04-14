import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenerateCodePage } from './generate-code';

@NgModule({
  declarations: [
    GenerateCodePage,
  ],
  imports: [
    IonicPageModule.forChild(GenerateCodePage),
  ],
})
export class GenerateCodePageModule {}
