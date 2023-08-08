import { SearchService } from './search.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { INewsItem } from '../../Abstractions/Interfaces/INewsitem';
import { RouterTestingModule } from "@angular/router/testing";
import { of } from 'rxjs';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        RouterTestingModule],
      providers: [SearchService,
        { provide: 'BASE_URL', useValue: 'https://localhost:44426/' }],
    });
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return no data when searching for items with bad query', () => {
    const query = 'bad query for test';
    const startId = 0;

    service.searchItems(query, startId).subscribe((data: INewsItem[]) => {
      expect(data).toEqual([]);
    });

    const req = httpMock.expectOne(`${service.baseUrl}api/hackernews/Search?query=${query}&startId=${startId}`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should return data when searching for items', () => {
    const query = 'test';
    const startId = 0;
    const mockResponse: INewsItem[] = [{ id: 1, title: 'Test News', by: 'test', url:'https://test' }];

    service.searchItems(query, startId).subscribe((data: INewsItem[]) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.baseUrl}api/hackernews/Search?query=${query}&startId=${startId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return data when getting new results', () => {
    const mockResponse: INewsItem[] = [{ id: 1, title: 'Test News', by: 'test', url:'https://test' }];
    spyOn(service, 'getNewResults').and.returnValue(of(mockResponse));

    service.getNewResults().subscribe((data: INewsItem[]) => {
      expect(data).toEqual(mockResponse);
    });
  });

  it('should return no data when getting new results by page that is wrong', () => {
    const pageNumber = 4993283;

    service.getNewResultsByPage(pageNumber).subscribe((data: INewsItem[]) => {
      expect(data).toEqual([]);
    });

    const req = httpMock.expectOne(`${service.baseUrl}api/hackernews/newresultsbypage/${pageNumber}`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should return data when getting new results by page', () => {
    const pageNumber = 1;
    const mockResponse: INewsItem[] = [{ id: 1, title: 'Test News', by: 'test', url: 'https://test' }];

    service.getNewResultsByPage(pageNumber).subscribe((data: INewsItem[]) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.baseUrl}api/hackernews/newresultsbypage/${pageNumber}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
