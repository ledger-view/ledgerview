import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CategoryModalComponent,
  CategoryModalData
} from '@features/categories/components/category-modal/category-modal.component';
import { CategoryService } from '@features/categories/services/category.service';
import { Category, CategoryRequest, getCategoryCssPillClass, getCategoryTranslationKey } from '@model/category.model';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CategoriesComponent implements OnInit {
  protected readonly categoryService = inject(CategoryService);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);

  protected readonly categories = this.categoryService.categories;
  protected readonly loading = this.categoryService.loading;

  protected readonly getCategoryCssPillClass = getCategoryCssPillClass;
  protected readonly getCategoryTranslationKey = getCategoryTranslationKey;

  ngOnInit(): void {
    this.categoryService.load();
  }

  protected openAdd(): void {
    this.openModal(undefined);
  }

  protected openEdit(category: Category): void {
    this.openModal(category);
  }

  protected openDelete(category: Category): void {
    this.openConfirmDelete(category);
  }

  private openModal(category?: Category): void {
    this.dialog
      .open<CategoryModalComponent, CategoryModalData, { action: string; data?: CategoryRequest }>(CategoryModalComponent, {
        data: { category, palette: this.categoryService.palette(), defaultColor: this.categoryService.defaultColor() },
        minWidth: '360px'
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;
        if (result.action === 'save' && result.data) {
          const op$ = category
            ? this.categoryService.update$(category.id, result.data)
            : this.categoryService.create$(result.data);
          op$.subscribe();
        }
        if (result.action === 'delete' && category) {
          this.openConfirmDelete(category);
        }
      });
  }

  private openConfirmDelete(category: Category): void {
    this.dialog
      .open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
        data: {
          title: this.translate.instant('categories.confirmDelete.title'),
          message: this.translate.instant('categories.confirmDelete.message', { name: category.name }),
          danger: true
        },
        width: '380px'
      })
      .afterClosed()
      .pipe(
        filter((confirmed): confirmed is true => confirmed === true),
        switchMap(() => this.categoryService.delete$(category.id))
      )
      .subscribe({
        error: (err: Error) => {
          if (err.message === 'CATEGORY_IN_USE') {
            this.dialog.open<ConfirmDialogComponent, ConfirmDialogData>(ConfirmDialogComponent, {
              data: {
                title: this.translate.instant('categories.deleteError.title'),
                message: this.translate.instant('categories.deleteError.message', { name: category.name }),
                danger: false,
                hideCancel: true,
                confirmLabel: 'common.ok'
              },
              width: '380px'
            });
          }
        }
      });
  }
}
