import { Component, OnInit, Input } from '@angular/core';
import { TimeSheetEntry } from '../../../models/time-sheet-entry.model';

@Component({
  selector: 'masch-time-sheet-entry',
  templateUrl: './time-sheet-entry.component.html',
  styleUrls: ['./time-sheet-entry.component.scss'],
})
export class TimeSheetEntryComponent implements OnInit {
  @Input() entry: TimeSheetEntry = new TimeSheetEntry();

  constructor() {}

  ngOnInit() {}
}
