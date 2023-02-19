import {
    Component,
    OnInit,
    Input,
    ViewChild,
    Output,
    EventEmitter
} from '@angular/core';
import { TimeSheetEntry } from '../../../models/time-sheet-entry.model';
import { TimeSheetEntryFormComponent } from '../time-sheet-entry-form/time-sheet-entry-form.component';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Icons } from '../../../icons';

@Component({
    selector: 'masch-time-sheet-entry-row',
    templateUrl: './time-sheet-entry-row.component.html',
    styleUrls: ['./time-sheet-entry-row.component.scss']
})
export class TimeSheetEntryRowComponent implements OnInit {
    @ViewChild('form', { static: false }) form: TimeSheetEntryFormComponent;
    @ViewChild('panel', { static: true }) panel: MatExpansionPanel;

    @Output() save = new EventEmitter<TimeSheetEntry>();
    @Output() delete = new EventEmitter();

    @Input() entry: TimeSheetEntry;
    @Input() isFirst: boolean;
    @Input() isLast: boolean;

    public Icons = Icons

    constructor() {}

    ngOnInit() {
        this.panel.afterCollapse.subscribe(() => {
            this.form.reset();
        });
    }
}
