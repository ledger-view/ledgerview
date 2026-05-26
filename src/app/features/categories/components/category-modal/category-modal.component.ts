import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category, CategoryRequest, CategoryType, getCategoryCssPillClass } from '@model/category.model';

export interface CategoryModalData {
  category?: Category;
}

const PALETTE = [
  '#6366F1',
  '#3B82F6',
  '#0EA5E9',
  '#06B6D4',
  '#10B981',
  '#84CC16',
  '#F59E0B',
  '#F97316',
  '#EF4444',
  '#EC4899',
  '#A855F7',
  '#64748B'
];

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CategoryModalComponent implements OnInit {
  protected form!: FormGroup;
  protected readonly isEdit: boolean;
  protected readonly palette = PALETTE;

  protected readonly CategoryType = CategoryType;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: CategoryModalData
  ) {
    this.isEdit = !!data.category;
  }

  ngOnInit(): void {
    const c = this.data.category;
    this.form = this.fb.group({
      name: [c?.name ?? '', Validators.required],
      type: [c?.type ?? 'expense'],
      color: [c?.color ?? PALETTE[0]]
    });
  }

  protected get isValid(): boolean {
    return this.form.valid;
  }

  protected get previewName(): string {
    return this.form.get('name')?.value?.trim() || 'Untitled';
  }

  protected setType(type: string): void {
    this.form.patchValue({ type });
  }
  protected setColor(color: string): void {
    this.form.patchValue({ color });
  }

  protected save(): void {
    if (!this.form.valid) return;
    const v = this.form.value;
    const req: CategoryRequest = { name: v.name.trim(), color: v.color, type: v.type };
    this.dialogRef.close({ action: 'save', data: req });
  }

  protected delete(): void {
    this.dialogRef.close({ action: 'delete' });
  }

  protected cancel(): void {
    this.dialogRef.close();
  }

  protected get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  protected get color(): FormControl {
    return this.form.get('color') as FormControl;
  }

  protected readonly getCategoryCssPillClass = getCategoryCssPillClass;
}
