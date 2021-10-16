import { ApiKey } from './apikey.model';

export class Settings {
    workDayHours: number;
    insertDefaultBreak: boolean;
    defaultBreakStart: number;
    defaultBreakEnd: number;
    defaultStart: number;
    defaultEnd: number;
    apiKeys: ApiKey[];

    constructor(init?: Partial<Settings>) {
        Object.assign(this, init);
    }

    static fromJSON(json: any): Settings {
        return new Settings({
            workDayHours: json.workDayHours,
            insertDefaultBreak: json.insertDefaultBreak,
            defaultBreakStart: json.defaultBreakStart,
            defaultBreakEnd: json.defaultBreakEnd,
            defaultStart: json.defaultStart,
            defaultEnd: json.defaultEnd,
            apiKeys: json.apiKeys
                ? json.apiKeys.map((x: any) => ApiKey.fromJSON(x))
                : []
        });
    }
}
