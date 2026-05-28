import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { SidenavComponent } from './app/sidenav/sidenav.component';
import { UserModalComponent } from './app/user-modal.component';

@NgModule({
  declarations: [AppComponent, UserModalComponent, SidenavComponent],
  imports: [
    // angular
    BrowserModule,
    BrowserAnimationsModule,
    // core
    CoreModule,
    // app
    AppRoutingModule,
    SharedModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})
export class AppModule {}
