import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CodeDetailsPage } from './code-details';

@NgModule({
  declarations: [
    CodeDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CodeDetailsPage),
  ],
})
export class CodeDetailsPageModule {}
