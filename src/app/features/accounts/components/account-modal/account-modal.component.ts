import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Account, AccountCreateRequest, AccountUpdateRequest } from '@model/account.model';

export interface AccountModalData {
  account?: Account;
  currencies: string[];
}

export type AccountModalResult =
  | { action: 'save'; data: AccountCreateRequest | AccountUpdateRequest }
  | { action: 'delete' }
  | { action: 'cancel' };

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

  protected readonly currencies: string[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AccountModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: AccountModalData
  ) {
    this.isEdit = !!data.account;
    this.currencies = data.currencies;
  }

  ngOnInit(): void {
    const a = this.data.account;
    this.form = this.fb.group({
      name: [a?.name ?? '', Validators.required],
      institution: [a?.institution ?? '', Validators.required],
      type: [a?.type ?? 'Checking'],
      number: [a?.number ?? ''],
      balance: [{ value: a?.balance ?? 0, disabled: this.isEdit }, this.isEdit ? [] : [Validators.required]],
      currency: [{ value: a?.currency ?? 'USD', disabled: this.isEdit }]
    });
  }

  protected get isValid(): boolean {
    return this.form.valid;
  }

  @HostListener('keydown.enter', ['$event'])
  onEnter(e: Event): void {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'BUTTON' || tag === 'SELECT') return;
    this.save();
  }

  protected save(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const base = { name: v.name.trim(), institution: v.institution.trim(), type: v.type, number: v.number?.trim() || undefined };
    const data = this.isEdit ? base : { ...base, currency: v.currency, balance: +v.balance };
    this.dialogRef.close({ action: 'save', data });
  }

  protected delete(): void {
    this.dialogRef.close({ action: 'delete' });
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}
