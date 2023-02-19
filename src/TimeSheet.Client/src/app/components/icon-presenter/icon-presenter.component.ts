import { Component, Input } from '@angular/core';
import { IconPosition } from './icon-position';

@Component({
  selector: 'masch-icon-presenter',
  templateUrl: './icon-presenter.component.html',
  styleUrls: ['./icon-presenter.component.scss'],
})
export class IconPresenterComponent {
  @Input()
  public icon: string;
  @Input()
  public iconPos: IconPosition = IconPosition.LEFT;
  @Input()
  public iconClass: string = '';
  @Input()
  public containerClass: string = '';
}
