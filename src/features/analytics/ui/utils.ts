import { toStructTimeLeft } from 'src/shared/lib/format/date';

export function formatRepeatInterval(frequencyMS?: number): string {
    let repeatInterval = '';
    if (frequencyMS) {
        const repTimeStruct = toStructTimeLeft(frequencyMS);
        const hours = repTimeStruct.hours + repTimeStruct.days * 24;
        const minutes = repTimeStruct.seconds ? repTimeStruct.minutes + 1 : repTimeStruct.minutes;

        if (!hours) {
            repeatInterval = `${minutes} min`;
        } else if (minutes) {
            repeatInterval = `${hours} h ${minutes} min`;
        } else {
            repeatInterval = `${hours} h`;
        }
    }

    return repeatInterval;
}
