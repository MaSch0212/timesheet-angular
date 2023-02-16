import {
    Component,
    OnInit,
    ViewChild,
    ElementRef} from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, ActivationEnd } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MenuService } from '../services/menu.service';
import { AuthGuardService } from '../services/auth-guard.service';
import { BaseComponent } from '@masch212/angular-common';
import { Icons } from '../icons';

@Component({
    selector: 'masch-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
    public Icons = Icons;

    @ViewChild('drawer', { static: true }) sidenav: MatSidenav;
    @ViewChild('content', { static: true }) contentElement: ElementRef;

    isHandset$: Observable<boolean> = this.breakpointObserver
        .observe(Breakpoints.Handset)
        .pipe(map(result => result.matches));
    isRefreshVisible$: Observable<boolean> = this.menuService
        .refreshButtonDisplayed$;

    isLoggedIn = false;

    constructor(
        private router: Router,
        private breakpointObserver: BreakpointObserver,
        private authService: AuthenticationService,
        private menuService: MenuService,
        private authGuard: AuthGuardService
    ) {
        super();
        this.menuService.setCurrentScrollContainer('.mat-sidenav-content');
        this.subscriptionManager.add(
            fromEvent(document, 'visibilitychange').subscribe(() => {
                if (document.visibilityState === 'visible') {
                    this.authGuard
                        .canActivate(
                            this.router.routerState.snapshot.root.firstChild,
                            this.router.routerState.snapshot
                        )
                        .subscribe();
                }
            })
        );
    }

    ngOnInit() {
        this.subscriptionManager.add(
            this.router.events
                .pipe(filter(event => event instanceof ActivationEnd))
                .subscribe(() => {
                    this.isLoggedIn = this.authService.isLoggedIn;
                })
        );
    }

    onMenuItemClicked() {
        if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
            this.sidenav.close();
        }
    }

    onRefreshClicked() {
        this.menuService.requestRefresh();
    }
}
