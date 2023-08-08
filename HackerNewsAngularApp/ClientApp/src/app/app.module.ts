import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { SearchItemComponent } from './search-item/search-item.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { QueryComponent } from './query/query.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { RouterTestingModule } from "@angular/router/testing";

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    SearchboxComponent,
    SearchItemComponent,
    SearchResultsComponent,
    QueryComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterTestingModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'page/:pageNumber', component: HomeComponent },
      { path: 'queryResults', component: QueryComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
