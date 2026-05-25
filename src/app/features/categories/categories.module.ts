import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryModalComponent } from './components/category-modal/category-modal.component';
import { CategoriesComponent } from './containers/categories/categories.component';

@NgModule({
  declarations: [CategoriesComponent, CategoryModalComponent],
  imports: [SharedModule, CategoriesRoutingModule]
})
export class CategoriesModule {}
