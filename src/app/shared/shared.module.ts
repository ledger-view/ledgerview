import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';

const materialModules = [MatIcon, MatProgressSpinner, MatTooltip, MatDialogModule];
const ngModules = [AsyncPipe, DatePipe, NgIf, FormsModule, ReactiveFormsModule];

@NgModule({
  imports: [...materialModules, ...ngModules],
  exports: [...materialModules, ...ngModules]
})
export class SharedModule {}
