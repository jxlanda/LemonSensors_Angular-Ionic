import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SensorsPageRoutingModule } from './sensors-routing.module';

import { SensorsPage } from './sensors.page';
import { MaterialModule } from 'src/app/material.module';
import { NgxLetterImageAvatarModule } from 'ngx-letter-image-avatar';
import {MatIconModule} from '@angular/material/icon';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SensorsPageRoutingModule,
    MaterialModule,
    NgxLetterImageAvatarModule,
    Ng2SearchPipeModule,
    MatIconModule
  ],
  declarations: [SensorsPage]
})
export class SensorsPageModule {}
