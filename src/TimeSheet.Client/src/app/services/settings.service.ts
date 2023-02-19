import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Settings } from '../models/settings.model';
import { Observable } from 'rxjs';
import { ApiKey } from '../models/apikey.model';

export interface CreateApiKeyResponse {
  key: string;
  keyInfo: ApiKey;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private authService: AuthenticationService, private httpClient: HttpClient) {}

  getSettings(): Observable<Settings> {
    return this.httpClient
      .get('api/settings')
      .pipe(map((x) => Settings.fromJSON(x)));
  }

  updateSettings(settings: Settings): Observable<Object> {
    return this.httpClient.post('api/settings/edit', settings);
  }

  createApiKey(name: string): Observable<CreateApiKeyResponse> {
    return this.httpClient
      .post(`api/settings/createapikey?name=${name}`, null)
      .pipe(
        map(
          (x: any) =>
            <CreateApiKeyResponse>{
              key: x.key,
              keyInfo: ApiKey.fromJSON(x.keyInfo),
            }
        )
      );
  }

  deleteApiKey(id: number): Observable<Object> {
    return this.httpClient.post(`api/settings/deleteapikey?keyId=${id}`, null);
  }
}
