import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab0PageRoutingModule } from './tab0-routing.module';

import { Tab0Page } from './tab0.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab0PageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [Tab0Page]
})
export class Tab0PageModule {}
