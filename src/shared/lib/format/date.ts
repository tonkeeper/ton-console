const monthesNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

export function toDateTime(date: Date, options?: { includeYear?: boolean }): string {
    return `${toDate(date, options)}, ${toTime(date)}`;
}

export function toDate(date: Date, options?: { includeYear?: boolean }): string {
    const day = date.getDate();
    const month = monthesNames[date.getMonth()];
    const dateString = `${day} ${month}`;

    if (!options?.includeYear) {
        return dateString;
    }

    return `${dateString} ${date.getFullYear()}`;
}

export function toTime(date: Date): string {
    const [hours, minutes] = date.toTimeString().slice(0, 8).split(':');
    return `${hours}:${minutes}`;
}

const msInSec = 1000;
const msInMin = msInSec * 60;
const msInHour = msInMin * 60;
const msInDay = msInHour * 24;

function addStartZero(value: number): string {
    const strValue = value.toString();
    if (strValue.length === 1) {
        return `0${strValue}`;
    }
    return strValue;
}
export function toTimeLeft(ms: number): string {
    const { days, hours, minutes, seconds } = toStructTimeLeft(ms);

    let result = '';
    if (days) {
        result = `${days} d`;

        if (!hours && !minutes && !seconds) {
            return result;
        }

        result += ' ';
    }

    if (hours) {
        result += `${hours}:`;
    }

    result += `${addStartZero(minutes)}:${addStartZero(seconds)}`;

    return result;
}

export function toStructTimeLeft(ms: number): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
} {
    const days = Math.floor(ms / msInDay);
    ms = ms - msInDay * days;

    const hours = Math.floor(ms / msInHour);
    ms = ms - msInHour * hours;

    const minutes = Math.floor(ms / msInMin);
    ms = ms - msInMin * minutes;

    const seconds = Math.floor(ms / msInSec);
    return {
        days,
        hours,
        minutes,
        seconds
    };
}
