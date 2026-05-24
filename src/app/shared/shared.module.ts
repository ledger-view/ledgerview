import { NgModule } from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  AsyncPipe,
  JsonPipe,
  LowerCasePipe,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import { FormatDateTimePipe } from '@shared/pipe/format-date-time.pipe';

const materialModules = [
  MatAccordion,
  MatExpansionModule,
  MatTable,
  MatColumnDef,
  MatCell,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatHeaderCellDef,
  MatCellDef,
  MatHeaderRowDef,
  MatRowDef,
  MatCheckbox,
  MatIcon,
  MatButton,
  MatInput,
  ReactiveFormsModule,
  MatFormField,
  MatLabel,
  MatCard,
  MatCardTitle,
  MatCardContent,
  MatCardActions,
  MatCardHeader,
  MatIconButton,
  MatProgressSpinner,
  MatError,
];

@NgModule({
  declarations: [FormatDateTimePipe],
  imports: [
    ...materialModules,
    AsyncPipe,
    NgIf,
    NgTemplateOutlet,
    JsonPipe,
    LowerCasePipe,
  ],
  exports: [
    ...materialModules,
    AsyncPipe,
    NgIf,
    NgTemplateOutlet,
    JsonPipe,
    LowerCasePipe,
    FormatDateTimePipe,
  ],
})
export class SharedModule {}
