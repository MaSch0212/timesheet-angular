import { Component, OnInit, Inject } from '@angular/core';
import { ApiKey } from '../../../models/apikey.model';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Helpers } from '../../../common/helpers';

export interface CopyApiKeyDialogData {
    key: string;
    keyInfo: ApiKey;
}

@Component({
    selector: 'masch-copy-api-key-dialog',
    templateUrl: './copy-api-key-dialog.component.html',
    styleUrls: ['./copy-api-key-dialog.component.css']
})
export class CopyApiKeyDialogComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: CopyApiKeyDialogData) {}

    ngOnInit() {}

    onCopyKey() {
        Helpers.copyTextToClipboard(this.data.key);
    }
}
