import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryPageRoutingModule } from './history-routing.module';

import { HistoryPage } from './history.page';
import { MaterialModule } from 'src/app/material.module';
import { NgxLetterImageAvatarModule } from 'ngx-letter-image-avatar';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryPageRoutingModule,
    MaterialModule,
    NgxLetterImageAvatarModule,
    Ng2SearchPipeModule
  ],
  declarations: [HistoryPage]
})
export class HistoryPageModule {}
