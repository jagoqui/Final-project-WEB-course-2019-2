import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from '@auth/register/register-routing.module';
import { RegisterComponent } from '@auth/register/register.component';
import {SharedModule} from '@shared/SharedModule.module';

@NgModule({
  declarations: [RegisterComponent],
  imports: [CommonModule, RegisterRoutingModule, ReactiveFormsModule, SharedModule],
})
export class RegisterModule {}
