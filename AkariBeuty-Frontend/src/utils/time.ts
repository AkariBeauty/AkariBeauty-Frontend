const TIME_MATCHER = /([01]?\d|2[0-3]):[0-5]\d/g;

export const BUSINESS_START_MINUTES = 8 * 60;
export const BUSINESS_END_MINUTES = 18 * 60;
export const BUSINESS_START_LABEL = "08:00";
export const BUSINESS_END_LABEL = "18:00";

export const timeToMinutes = (value: string): number | null => {
    if (!value) return null;
    const [hoursPart, minutesPart] = value.split(":");
    const hours = Number(hoursPart);
    const minutes = Number(minutesPart);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
    return hours * 60 + minutes;
};

const minutesToTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60)
        .toString()
        .padStart(2, "0");
    const mins = (minutes % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}`;
};

const clampToBusinessWindow = (startMinutes: number, endMinutes: number) => {
    const clampedStart = Math.max(startMinutes, BUSINESS_START_MINUTES);
    const clampedEnd = Math.min(endMinutes, BUSINESS_END_MINUTES);

    if (clampedStart >= clampedEnd) {
        return {
            start: BUSINESS_START_LABEL,
            end: BUSINESS_END_LABEL,
        };
    }

    return {
        start: minutesToTime(clampedStart),
        end: minutesToTime(clampedEnd),
    };
};

export const isWithinBusinessWindow = (start: string, end: string): boolean => {
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);

    if (startMinutes === null || endMinutes === null) return false;

    return (
        startMinutes >= BUSINESS_START_MINUTES &&
        endMinutes <= BUSINESS_END_MINUTES
    );
};

export const ensureBusinessHoursString = (rawRange?: string | null) => {
    if (!rawRange) {
        return `${BUSINESS_START_LABEL} às ${BUSINESS_END_LABEL}`;
    }

    const matches = rawRange.match(TIME_MATCHER) ?? [];
    const startMatch = matches[0] ?? BUSINESS_START_LABEL;
    const endMatch = matches[1] ?? BUSINESS_END_LABEL;

    const startMinutes = timeToMinutes(startMatch) ?? BUSINESS_START_MINUTES;
    const endMinutes = timeToMinutes(endMatch) ?? BUSINESS_END_MINUTES;

    const { start, end } = clampToBusinessWindow(startMinutes, endMinutes);

    return `${start} às ${end}`;
};
