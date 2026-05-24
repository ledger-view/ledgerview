import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import packageJson from '../../../package.json';

const version = packageJson.version;

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json?cacheBuster=' + version })
    })
  ]
})
export class CoreModule {}
