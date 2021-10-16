export namespace Helpers {
    export function setTimeFromString(date: Date, time: string): Date {
        if (!time || time === '') {
            return null;
        }
        const split = time.split(':');
        const result = new Date(date == null ? 0 : date.getTime());
        if (split.length === 1) {
            result.setHours(parseInt(split[0], 10), 0, 0, 0);
        } else {
            result.setHours(
                parseInt(split[0], 10),
                parseInt(split[1], 10),
                0,
                0
            );
        }
        return result;
    }

    export function setDateFromDate(date: Date, dateToSet: Date): Date {
        const result = new Date(date == null ? 0 : date.getTime());
        if (dateToSet == null || dateToSet.getTime() === 0) {
            result.setFullYear(1970, 0, 1);
        } else {
            result.setFullYear(
                dateToSet.getFullYear(),
                dateToSet.getMonth(),
                dateToSet.getDate()
            );
        }
        return result;
    }

    /**
     * Insert the given element to an array before the element for that the given function returns true.
     * @export
     * @template T
     * @param {Array<T>} array      Array to insert to element in.
     * @param {T} element           Element to insert into the array.
     * @param {(T) => boolean} funcAddBefore
     *  The function to evaluate in which position the element should be inserted.
     *  The given element is inserted right before the element for which this function returns true.
     */
    export function insertIntoArray<T>(
        array: Array<T>,
        element: T,
        funcAddBefore: (item: T) => boolean
    ): void {
        let i: number;
        for (i = 0; i < array.length; i++) {
            if (funcAddBefore(array[i])) {
                array.splice(i, 0, element);
                break;
            }
        }
        if (i === array.length) {
            array.push(element);
        }
    }

    export function getTimeString(date: Date): string {
        const hour = date.getHours();
        const min = date.getMinutes();
        return `${formatNumber(hour, 2)}:${formatNumber(min, 2)}`;
    }

    export function getTimeStringFromHours(
        value: number,
        useFullTimeFormat: boolean = false
    ): string {
        let h = Math.floor(Math.abs(value));
        let m = Math.round((Math.abs(value) - h) * 60);
        if (m === 60) {
            h++;
            m = 0;
        }
        return `${value < 0 && m > 0 ? '-' : ''}${
            h < 10 && useFullTimeFormat ? `0${h}` : `${h}`
        }:${m < 10 ? `0${m}` : `${m}`}`;
    }

    export function getHoursFromTimeString(value: string): number {
        const parts = value.split(':');
        return Number(parts[0]) + Number(parts[1]) / 60;
    }

    export function getDateString(date: Date): string {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${formatNumber(year, 4)}-${formatNumber(
            month,
            2
        )}-${formatNumber(day, 2)}`;
    }

    export function copyTextToClipboard(text: string) {
        if (!navigator['clipboard']) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator['clipboard'].writeText(text);
    }

    function formatNumber(n: number, digits: number): string {
        return n.toString().padStart(digits, '0');
    }

    function fallbackCopyTextToClipboard(text: string) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (err) {}

        document.body.removeChild(textArea);
    }
}
