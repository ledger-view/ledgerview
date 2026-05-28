import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
  standalone: false
})
export class InitialsPipe implements PipeTransform {
  transform(name: string | null | undefined, fallback = '?'): string {
    if (!name) return fallback;
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}
