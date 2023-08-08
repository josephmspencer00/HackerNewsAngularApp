import { Observable } from "rxjs";
import { INewsItem } from "./INewsitem";

export interface ISearchService {

  baseUrl: string;

  searchItems(query: string, startId: number): Observable<INewsItem[]>;

  getNewResults(): Observable<INewsItem[]>;

  getNewResultsByPage(pageNumber: number): Observable<INewsItem[]>;
}
