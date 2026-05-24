import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class AppComponent implements OnInit {
  constructor(private translateService: TranslateService) {}

  public ngOnInit(): void {
    this.translateService.setFallbackLang('en');
    this.translateService.use('en');
  }
}
