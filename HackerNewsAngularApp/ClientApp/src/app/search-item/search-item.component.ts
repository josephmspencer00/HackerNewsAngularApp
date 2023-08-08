import { Component, Input } from '@angular/core';
import { INewsItem } from '../../Abstractions/Interfaces/INewsitem';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.css']
})
export class SearchItemComponent {
  @Input()
    item!: INewsItem;
}
