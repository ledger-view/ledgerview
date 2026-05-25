import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CategoryModalComponent,
  CategoryModalData
} from '@features/categories/components/category-modal/category-modal.component';
import { CategoryService } from '@features/categories/services/category.service';
import { TransactionApiService } from '@features/transactions/services/transaction-api.service';
import { Category, CategoryRequest } from '@model/category.model';
import { Transaction } from '@model/transaction.model';

interface CategoryUsage {
  count: number;
  total: number;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CategoriesComponent implements OnInit {
  protected readonly categoryService = inject(CategoryService);
  private readonly txApi = inject(TransactionApiService);
  private readonly dialog = inject(MatDialog);

  protected readonly categories = this.categoryService.categories;
  protected readonly loading = this.categoryService.loading;

  private readonly _usage = signal<Record<string, CategoryUsage>>({});
  protected readonly usage = this._usage.asReadonly();

  protected readonly maxTotal = computed(() => Math.max(1, ...Object.values(this._usage()).map((u) => u.total)));

  ngOnInit(): void {
    this.categoryService.load();
    this.loadUsage();
  }

  private loadUsage(): void {
    const now = new Date();
    const dateFrom = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const dateTo = now.toISOString().slice(0, 10);
    this.txApi.getTransactions$({ dateFrom, dateTo, size: 100, page: 0 } as any).subscribe((page) => {
      const m: Record<string, CategoryUsage> = {};
      (page.content as Transaction[]).forEach((t) => {
        const id = t.categoryId;
        if (!m[id]) m[id] = { count: 0, total: 0 };
        m[id].count++;
        m[id].total += Math.abs(t.amount);
      });
      this._usage.set(m);
    });
  }

  protected getUsage(id: string): CategoryUsage {
    return this.usage()[id] ?? { count: 0, total: 0 };
  }

  protected fillPct(id: string): number {
    const u = this.getUsage(id);
    return (u.total / this.maxTotal()) * 100;
  }

  protected fmtMoney(amount: number): string {
    return '$' + Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  protected openAdd(): void {
    this.openModal(undefined);
  }
  protected openEdit(category: Category): void {
    this.openModal(category);
  }

  private openModal(category?: Category): void {
    this.dialog
      .open<CategoryModalComponent, CategoryModalData, { action: string; data?: CategoryRequest }>(CategoryModalComponent, {
        data: { category },
        width: '420px'
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;
        if (result.action === 'save' && result.data) {
          const op$ = category
            ? this.categoryService.update$(category.id, result.data)
            : this.categoryService.create$(result.data);
          op$.subscribe(() => this.loadUsage());
        }
        if (result.action === 'delete' && category) {
          this.categoryService.delete$(category.id).subscribe();
        }
      });
  }

  protected trackById(_: number, item: Category): string {
    return item.id;
  }
}
