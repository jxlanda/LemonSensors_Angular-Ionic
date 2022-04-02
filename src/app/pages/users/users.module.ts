import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './users.page';
import { MaterialModule } from 'src/app/material.module';
import { NgxLetterImageAvatarModule } from 'ngx-letter-image-avatar';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersPageRoutingModule,
    MaterialModule,
    NgxLetterImageAvatarModule,
    Ng2SearchPipeModule
  ],
  declarations: [UsersPage]
})
export class UsersPageModule {}
