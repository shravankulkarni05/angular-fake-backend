import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeroesComponent } from './heroes/heroes.component';
import { FakeBackendProvider } from './core/fake-backend-provider';

@NgModule({
  declarations: [AppComponent, HeroesComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendProvider, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
