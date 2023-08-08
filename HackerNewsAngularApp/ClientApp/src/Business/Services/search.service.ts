import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { INewsItem } from '../../Abstractions/Interfaces/INewsitem';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

    public baseUrl: string;
    private http: HttpClient;

    constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
      this.http = http;
      this.baseUrl = baseUrl;
    }

    searchItems(query: string, startId: number): Observable<INewsItem[]> {
      const url = `${this.baseUrl}api/hackernews/Search?query=${query}&startId=${startId}`;
      return this.http.get<INewsItem[]>(url);
    }

    getNewResults(): Observable<INewsItem[]> {
      const url = `${this.baseUrl}api/hackernews/NewResults`;
      return this.http.get<INewsItem[]>(url);
    }

    getNewResultsByPage(pageNumber: number): Observable<INewsItem[]> {
      const url = `${this.baseUrl}api/hackernews/newresultsbypage/${pageNumber}`;
      return this.http.get<INewsItem[]>(url);
    }
  
}
