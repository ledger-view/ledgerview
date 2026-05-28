import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IdentityClaims } from '@model/auth.model';

export type UserModalResult = 'logout' | undefined;

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class UserModalComponent {
  constructor(
    private dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: IdentityClaims
  ) {}

  protected close(): void {
    this.dialogRef.close();
  }

  protected logout(): void {
    this.dialogRef.close('logout');
  }

  protected get displayName(): string {
    return this.data.name || this.data.preferred_username || '—';
  }
}
