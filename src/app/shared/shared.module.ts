import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

const materialModules = [MatIcon, MatProgressSpinner, MatTooltip, MatDialogModule, MatIconButton];
const ngModules = [AsyncPipe, DatePipe, NgIf, FormsModule, ReactiveFormsModule, TranslateModule];

@NgModule({
  imports: [...materialModules, ...ngModules],
  exports: [...materialModules, ...ngModules]
})
export class SharedModule {}
