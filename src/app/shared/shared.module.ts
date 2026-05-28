import { A11yModule } from '@angular/cdk/a11y';
import { AsyncPipe, DatePipe, NgClass, NgStyle } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { EchartComponent } from './components/echart/echart.component';
import { InitialsPipe } from './pipe/initials.pipe';

const materialModules = [A11yModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatTooltipModule, MatDialogModule];

const ngModules = [AsyncPipe, DatePipe, NgClass, NgStyle, FormsModule, ReactiveFormsModule, RouterModule, TranslateModule];

const pipes = [InitialsPipe];

@NgModule({
  declarations: [ConfirmDialogComponent, EchartComponent, ...pipes],
  imports: [...materialModules, ...ngModules],
  exports: [ConfirmDialogComponent, EchartComponent, ...pipes, ...materialModules, ...ngModules]
})
export class SharedModule {}
