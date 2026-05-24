import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '@model/transaction.model';

enum TableColumn {
  id = 'id',
  iban = 'iban',
  date = 'date',
  currency = 'currency',
  category = 'category',
  amount = 'amount'
}
const TABLE_COLUMNS = [
  TableColumn.id,
  TableColumn.iban,
  TableColumn.date,
  TableColumn.currency,
  TableColumn.category,
  TableColumn.amount
];

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrl: './transactions-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TransactionsTableComponent {
  @Input() transactions: Transaction[] = [];
  @Output() doneChange = new EventEmitter<Transaction>();
  @Output() delete = new EventEmitter<number>();

  protected readonly TableColumn = TableColumn;
  protected readonly displayedColumns = TABLE_COLUMNS;
}
