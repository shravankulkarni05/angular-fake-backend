import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Hero } from '../hero';

@Injectable()
export class FakeBackendProvider implements HttpInterceptor {
  private heroes: Hero[] = [
    { id: 1, name: 'Captain America' },
    { id: 2, name: 'Iron Man' },
    { id: 3, name: 'Black Panther' },
    { id: 4, name: 'Deadpool' },
    { id: 5, name: 'Doctor Strange' }
  ];

  constructor() {
    const heroes = JSON.parse(sessionStorage.getItem('heroes'));
    if (heroes) {
      this.heroes = heroes;
    }
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, body } = req;
    return of(null)
      .pipe(
        mergeMap(() => {
          if (url.endsWith('/heroes') && method === 'GET') {
            return this.getHeroes();
          } else if (url.endsWith('/createHero') && method === 'POST') {
            const name = body.name;
            return this.createHero(name);
          } else if (url.match(/\/deleteHero\/\d+$/) && method === 'DELETE') {
            return this.deleteHero(this.extractIdFromUrl(url));
          }
          return next.handle(req);
        })
      )
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());
  }

  getHeroes() {
    return this.ok(Object.assign([], this.heroes));
  }

  createHero(heroName: string) {
    const newHero = {} as Hero;
    const heroes = this.heroes;
    newHero.id = heroes.length ? Math.max(...heroes.map(x => x.id)) + 1 : 1;;
    newHero.name = heroName;
    heroes.push(newHero);
    this.updateStorage();
    return this.ok(newHero);
  }

  deleteHero(id: number) {
    this.heroes = this.heroes.filter(h => h.id !== id);
    this.updateStorage();
    return this.ok({ok: true});
  }

  updateStorage() {
    sessionStorage.setItem('heroes', JSON.stringify(this.heroes));
  }

  extractIdFromUrl(url: string) {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 1]);
  }

  ok(body?: any) {
    return of(new HttpResponse({ status: 200, body }));
  }

  error(message: any) {
    return throwError({ error: { message } });
  }
}
