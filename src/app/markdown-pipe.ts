import { Pipe, PipeTransform } from '@angular/core';

import * as showdown from 'showdown';

const converter = new showdown.Converter();

@Pipe({ name: 'markdown' })
export class MarkdownPipe implements PipeTransform {
  transform(value: string): string {
    converter.setFlavor('github');
    return converter.makeHtml(value);
  }
}
