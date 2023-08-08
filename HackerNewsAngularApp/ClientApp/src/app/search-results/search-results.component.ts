import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { INewsItem } from '../../Abstractions/Interfaces';
import { SearchServiceProvider } from '../search-results/search-service.provider'

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  searchResults: INewsItem[] = [];
  currentPage = 1;
  isLoading = true;

  @ViewChild('results')
  resultsRef!: ElementRef;

  @Output() scrollToTopEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private searchService: SearchServiceProvider, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    // Get page number parameter from route, default 1
     this.route.paramMap.subscribe(params => {
       const pageNumber = params.get('pageNumber') != null ? params.get('pageNumber') : 1;
       this.currentPage = Number(pageNumber);
       this.getNewResultsPaged(this.currentPage);
     });
  }

  // Get new results on page load
  getNewResults(): void {
      this.searchService.getNewResults().subscribe((results: INewsItem[]) => {
        this.searchResults = results;
        this.isLoading = false;
      });
  }

  // Get new results by page number
  getNewResultsPaged(currentPage: number): void {
    // Fetch paged results based on current page and itemsPerPage
    this.isLoading = true;
    this.searchService.getNewResultsByPage((currentPage))
      .subscribe((results: INewsItem[]) => {
        this.searchResults = results;
        this.isLoading = false;
        this.scrollToTop();
      });
  }

  // Method to handle changing the current page
  changePage(newPage: number): void {
    if (newPage !== this.currentPage) {
      this.router.navigate(['page',newPage]);
    }
  }

  // Calculate the total number of pages
  get totalPages(): number {
    return Math.ceil(this.totalResults / 10);
  }

  // Calculate the total number of results, default 500 returned from endpoint
  get totalResults(): number {
    return 500;
  }

  // Generate an array of page numbers for pagination
  get pages(): number[] {
    const pagesArray: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  // Calculate the number of pages to be visible to user
  get visiblePages(): number[] {
    const range = 5; // Maximum number of visible pages
    const halfRange = Math.floor(range / 2);
    const start = Math.max(1, this.currentPage - halfRange);
    const end = Math.min(this.totalPages, start + range - 1);

    const pagesArray: number[] = [];
    for (let i = start; i <= end; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  // Scroll to top after page change
  scrollToTop() {
    if (this.resultsRef && this.resultsRef.nativeElement) {
      setTimeout(() => {
      /*  this.resultsRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start'})*/;
        this.scrollToTopEvent.emit();
      },100)
    }
  }
}
