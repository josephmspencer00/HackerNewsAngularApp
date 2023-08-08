import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryComponent } from '../../src/app/query/query.component';
import { SearchService } from '../Business/Services/search.service';
import { of } from 'rxjs';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchServiceProvider } from './search-results/search-service.provider'

describe('QueryComponent', () => {
  let component: QueryComponent;
  let fixture: ComponentFixture<QueryComponent>;
  let searchServiceMock: jasmine.SpyObj<SearchServiceProvider>;

  beforeEach(waitForAsync(() => {
    const searchServiceSpy = jasmine.createSpyObj('SearchService', ['searchItems']);

    TestBed.configureTestingModule({
      declarations: [QueryComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: of({ get: () => 'searchTerm' }) } },
        { provide: SearchServiceProvider, useValue: searchServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QueryComponent);
    component = fixture.componentInstance;
    searchServiceMock = TestBed.inject(SearchServiceProvider) as jasmine.SpyObj<SearchServiceProvider>;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load results on initialization', () => {
    searchServiceMock.searchItems.and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();
    expect(searchServiceMock.searchItems).toHaveBeenCalledWith('searchTerm', 0);
    expect(component.searchResults).toEqual([]);
  });

});

describe('SearchboxComponent', () => {
  let component: SearchboxComponent;
  let fixture: ComponentFixture<SearchboxComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [SearchboxComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: Router, useValue: routerSpyObj }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchboxComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to queryResults on search', () => {
    component.query = 'example';
    component.search();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/queryResults'], {
      queryParams: { searchTerm: 'example' },
    });
  });

});

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let searchServiceMock: jasmine.SpyObj<SearchServiceProvider>;

  beforeEach(waitForAsync(() => {
    const searchServiceSpy = jasmine.createSpyObj('SearchService', ['getNewResultsByPage']);

    TestBed.configureTestingModule({
      declarations: [SearchResultsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => '1' }) } },
        { provide: Router, useValue: {} },
        { provide: SearchServiceProvider, useValue: searchServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    searchServiceMock = TestBed.inject(SearchServiceProvider) as jasmine.SpyObj<SearchServiceProvider>;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch new results on initialization', () => {
    searchServiceMock.getNewResultsByPage.and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();
    expect(searchServiceMock.getNewResultsByPage).toHaveBeenCalledWith(1);
    expect(component.searchResults).toEqual([]);
  });

});
