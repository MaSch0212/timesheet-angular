import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'masch-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    @ViewChild('f', { static: true }) passwordForm: NgForm;
    @Input() userId: number;

    formInvalid: boolean;
    apiError: string;

    constructor(
        private authService: AuthenticationService,
        private snackbar: MatSnackBar
    ) {}

    ngOnInit() {}

    onSubmit(form: NgForm) {
        this.apiError = null;
        this.formInvalid = form.invalid;
        if (form.invalid) {
            return;
        }

        this.authService
            .changePassword({
                userId: this.userId,
                oldPassword: form.value.oldPassword,
                newPassword: form.value.newPassword
            })
            .subscribe(
                () => {
                    this.snackbar.open('Password have been changed');
                    this.passwordForm.resetForm();
                },
                (error: HttpErrorResponse) => {
                    this.apiError = error.error
                        ? error.error
                        : `${error.status} (${error.statusText})`;
                }
            );
    }
}
