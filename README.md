# angular-fake-backend

Angular fake backend example for backendless development

This project was created to demonstrate how to implement a fake or mock backend in Angular with HTTP Interceptor.

## Getting Started

1. Clone this repository
2. Install the npm packages

   ```bash
   npm install
   ```

## What's in the App

Here is the explanation:

A fake backend is used for developing Angular app which allows developer to run and test code without a real backend. This is very helpful if you want to host your app somewhere which does not have a backend or you are developing a front end before the backend is available.

This Heroes app is built by extending the Angular HttpInterceptor and includes mock endpoints for heroes list, heroes deletion and create new Hero.

I have added a FakeBackendProvider under core directory which intercepts all the requests. Below is a small code snippet of interceptor (you can check full implementation in the app):

```typescript
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
```

To add fake backend provider to your angular app, you need to import FakeBackendProvider in your app module under the list of provider (DO NOT MISS THIS STEP).

```typescript
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: FakeBackendProvider, multi: true },
];
```

## Resources

- [VS Code] (https://code.visualstudio.com)
- [Heroes Part From Angular Tour Of Heroes] (https://angular.io/tutorial)
