import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';

export class HttpInterceptorService implements HttpInterceptor {
  constructor(private readonly localStorageService: LocalStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url: string = req.url;
    if (!req.url.startsWith('http') && environment.apiBaseUrl) {
      url = environment.apiBaseUrl + req.url;
    }

    let headers: HttpHeaders = req.headers;
    if (!req.headers.has('Content-Type')) {
      headers = headers.set('Content-Type', 'application/json');
    }
    if (!req.headers.has('Authorization') && this.localStorageService.token) {
      headers = headers.set('Authorization', 'Bearer ' + this.localStorageService.token);
    }

    return next.handle(req.clone({ url, headers }));
  }
}
