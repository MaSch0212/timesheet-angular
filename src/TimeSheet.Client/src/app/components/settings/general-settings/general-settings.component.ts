import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Settings } from '../../../models/settings.model';
import { NgForm } from '@angular/forms';
import { Helpers } from '../../../common/helpers';
import { SettingsService } from '../../../services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'masch-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css'],
})
export class GeneralSettingsComponent implements OnInit {
  private _settings: Settings;

  @ViewChild('f', { static: true }) settingsForm: NgForm;

  @Input()
  get settings(): Settings {
    return this._settings;
  }
  set settings(value: Settings) {
    this._settings = value;
    setTimeout(() => {
      this.settingsForm.setValue({
        workDayHours: this._settings.workDayHours,
        insertDefaultBreak: this._settings.insertDefaultBreak,
        defaultBreakStart: Helpers.getTimeStringFromHours(this._settings.defaultBreakStart, true),
        defaultBreakEnd: Helpers.getTimeStringFromHours(this._settings.defaultBreakEnd, true),
        defaultStart: Helpers.getTimeStringFromHours(this._settings.defaultStart, true),
        defaultEnd: Helpers.getTimeStringFromHours(this._settings.defaultEnd, true),
      });
    });
  }

  formInvalid: boolean;
  saveFailed: boolean;

  constructor(private settingsService: SettingsService, private snackbar: MatSnackBar) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    this.saveFailed = false;
    this.formInvalid = form.invalid;
    if (form.invalid) {
      return;
    }

    const value = this.settingsForm.value;
    this.settingsService
      .updateSettings(
        new Settings({
          workDayHours: value.workDayHours,
          insertDefaultBreak: value.insertDefaultBreak,
          defaultBreakStart: value.insertDefaultBreak ? Helpers.getHoursFromTimeString(value.defaultBreakStart) : 12,
          defaultBreakEnd: value.insertDefaultBreak ? Helpers.getHoursFromTimeString(value.defaultBreakEnd) : 12.75,
          defaultStart: Helpers.getHoursFromTimeString(value.defaultStart),
          defaultEnd: Helpers.getHoursFromTimeString(value.defaultEnd),
        })
      )
      .subscribe(
        () => this.snackbar.open('The settings have been changed'),
        () => (this.saveFailed = true)
      );
  }
}
