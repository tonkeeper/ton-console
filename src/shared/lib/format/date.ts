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
