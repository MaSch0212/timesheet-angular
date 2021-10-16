import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { LocalStorageService } from './local-storage.service';

export interface LoginResponse {
    isSuccess: boolean;
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    public get httpHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' }).set(
            'Authorization',
            'Bearer ' + this.localStorageService.token
        );
    }

    public get isLoggedIn(): boolean {
        return this.localStorageService.token !== null;
    }

    constructor(
        private httpClient: HttpClient,
        private localStorageService: LocalStorageService
    ) {}

    public checkTokenValid(): Observable<boolean> {
        const token = this.localStorageService.token;
        return token === null
            ? of(false)
            : this.httpClient
                  .get('api/auth/check', { headers: this.httpHeaders })
                  .pipe(
                      map(() => token),
                      catchError(() => {
                          this.localStorageService.removeToken();
                          return of(null);
                      })
                  );
    }

    public login(request: {
        username: string;
        password: string;
        stayLoggedIn: boolean;
    }): Observable<boolean> {
        return this.pipeLoginResponse(
            this.httpClient.post<LoginResponse>('api/auth/login', request)
        );
    }

    public register(request: {
        username: string;
        password: string;
        userInfo: User;
    }): Observable<boolean> {
        return this.pipeLoginResponse(
            this.httpClient.post<LoginResponse>('api/auth/register', request)
        );
    }

    public changePassword(request: {
        userId: number;
        oldPassword: string;
        newPassword: string;
    }): Observable<Object> {
        return this.httpClient.post('api/auth/changepassword', request, {
            headers: this.httpHeaders
        });
    }

    public logoff() {
        this.localStorageService.removeToken();
    }

    private pipeLoginResponse(
        observable: Observable<LoginResponse>
    ): Observable<boolean> {
        return observable.pipe(
            map((response: LoginResponse) => {
                this.localStorageService.token = response.token;
                return response.isSuccess;
            }),
            catchError(() => {
                return of(false);
            })
        );
    }
}
