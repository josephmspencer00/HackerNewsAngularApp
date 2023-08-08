import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { INewsItem } from '../../Abstractions/Interfaces/INewsitem';
import { SearchService } from '../../Business/Services/search.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent {
  query: string = '';
  searchResults: INewsItem[] = [];
  startId: number = 0;
  hideLoadMore: boolean = true;
  isLoading: boolean = true;
  isLoadMoreSpinner: boolean = false;

  constructor(private route: ActivatedRoute, private searchService: SearchService) { }

  ngOnInit(): void {
    // Get Search Term from query params, and load results
    this.route.queryParamMap.subscribe(queryParams => {
      this.query = queryParams.get('searchTerm') || '';
      this.isLoading = true;
      this.loadResults();
    });
  }

  // Loads results based of query and index
  loadResults(): void {
    if (this.query) {
      this.searchService
        .searchItems(this.query, this.startId)
        .subscribe((results: INewsItem[]) => {
          // Add results onto current searchresults to have a flowing list
          this.searchResults = this.searchResults.concat(results);
          // If results are less than 9, then there are no more documents to load, hide button
          this.hideLoadMore = (results.length < 9 ? true : false);
          this.isLoading = false;
          this.isLoadMoreSpinner = false;
        });
    }
  }

  // Load next set of results if user hits load more button
  loadNextSet(): void {
    if (this.searchResults.length > 0) {
      this.startId = this.searchResults[this.searchResults.length - 1].id;
      this.loadResults();
      this.isLoadMoreSpinner = true;
    }
  }
}
