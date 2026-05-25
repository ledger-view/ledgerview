import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Account } from '@model/account.model';
import { Category, CategoryType } from '@model/category.model';
import { Transaction, TransactionRequest } from '@model/transaction.model';

export interface TransactionModalData {
  transaction?: Transaction;
  accounts: Account[];
  categories: Category[];
}

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrl: './transaction-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TransactionModalComponent implements OnInit {
  protected form!: FormGroup;
  protected readonly isEdit: boolean;

  protected readonly CategoryType = CategoryType;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TransactionModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: TransactionModalData
  ) {
    this.isEdit = !!data.transaction;
  }

  ngOnInit(): void {
    const tx = this.data.transaction;
    const today = new Date().toISOString().slice(0, 10);
    this.form = this.fb.group({
      type: [tx?.type ?? CategoryType.EXPENSE],
      title: [tx?.title ?? '', Validators.required],
      amount: [tx ? Math.abs(tx.amount) : '', [Validators.required, Validators.min(0.01)]],
      date: [tx?.date ?? today, Validators.required],
      accountId: [tx?.accountId ?? this.data.accounts[0]?.id ?? '', Validators.required],
      categoryId: [tx?.categoryId ?? this.data.categories[0]?.id ?? '', Validators.required],
      note: [tx?.note ?? '']
    });
  }

  protected get filteredCategories(): Category[] {
    const type = this.form.get('type')?.value;
    return this.data.categories.filter((c) =>
      type === CategoryType.INCOME ? c.type !== CategoryType.EXPENSE : c.type !== CategoryType.INCOME
    );
  }

  protected get amountLabel(): string {
    return this.form.get('type')?.value === CategoryType.INCOME
      ? 'transactions.form.amountIncome'
      : 'transactions.form.amountExpense';
  }

  protected get isValid(): boolean {
    return this.form.valid;
  }

  protected setType(type: CategoryType): void {
    this.form.patchValue({ type });
  }

  protected save(): void {
    if (!this.form.valid) return;
    const v = this.form.value;
    const amt = +v.amount * (v.type === CategoryType.EXPENSE ? -1 : 1);
    const req: TransactionRequest = {
      title: v.title.trim(),
      amount: amt,
      type: v.type,
      date: v.date,
      accountId: v.accountId,
      categoryId: v.categoryId,
      note: v.note?.trim() || undefined
    };
    this.dialogRef.close(req);
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}
