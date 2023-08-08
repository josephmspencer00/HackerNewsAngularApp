import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { INewsItem } from '../../Abstractions/Interfaces/INewsitem';
import { SearchService } from '../../Business/Services/search.service';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent {
  searchResults: INewsItem[] = [];
  query: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {

    // Listen for enter key to run search
    const inputElement = document.getElementById('searchInput') as HTMLInputElement;
    inputElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.search();
      }
    });

  }

  search(): void {
    // Route to run search based on query
    if (this.query) {
      this.router.navigate(['/queryResults'], {
        queryParams: { searchTerm: this.query }
      });
    }   
  }
}
