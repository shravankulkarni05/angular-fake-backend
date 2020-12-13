import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get('api/heroes').pipe(map((resp) => resp as Hero[]));
  }

  createHero(name: string): Observable<Hero> {
    return this.http
      .post('api/createHero', { name: name }, { headers: this.headers })
      .pipe(map((resp) => resp as Hero));
  }

  deleteHero(id: number) {
    const url = 'api/deleteHero/' + id;
    return this.http.delete(url);
  }
}
