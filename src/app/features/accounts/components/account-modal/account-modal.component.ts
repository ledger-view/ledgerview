import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Account, AccountRequest } from '@model/account.model';

export interface AccountModalData {
  account?: Account;
}

@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  styleUrl: './account-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class AccountModalComponent implements OnInit {
  protected form!: FormGroup;
  protected readonly isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AccountModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: AccountModalData
  ) {
    this.isEdit = !!data.account;
  }

  ngOnInit(): void {
    const a = this.data.account;
    this.form = this.fb.group({
      name: [a?.name ?? '', Validators.required],
      institution: [a?.institution ?? '', Validators.required],
      type: [a?.type ?? 'Checking'],
      currency: [a?.currency ?? 'USD'],
      balance: [a?.balance ?? 0, Validators.required],
      number: [a?.number ?? '']
    });
  }

  protected get isValid(): boolean {
    return this.form.valid;
  }

  protected save(): void {
    if (!this.form.valid) return;
    const v = this.form.value;
    const req: AccountRequest = {
      name: v.name.trim(),
      institution: v.institution.trim(),
      type: v.type,
      currency: v.currency,
      balance: +v.balance,
      number: v.number?.trim() || undefined
    };
    this.dialogRef.close({ action: 'save', data: req });
  }

  protected delete(): void {
    this.dialogRef.close({ action: 'delete' });
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}
