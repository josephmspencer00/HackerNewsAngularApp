import { Injectable } from '@angular/core';
import { SearchService } from '../../Business/Services/search.service';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchServiceProvider extends SearchService {

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    super(http, baseUrl);
  }
}
