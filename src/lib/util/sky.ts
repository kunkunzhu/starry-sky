import * as SunCalc from 'suncalc';
import { LocationCoords } from '../types/misc';
import { SkyMode } from '../types/sky';

interface SkyParams {
    currentTime: Date,
    location: LocationCoords
}

export function getNightTime({ currentTime, location }: SkyParams) {
    const { lat, long } = location;
    const nightStartTime = SunCalc.getTimes(currentTime, lat, long).night;
    const nightEndTime = SunCalc.getTimes(currentTime, lat, long).nightEnd;

    return { nightStartTime: nightStartTime, nightEndTime: nightEndTime };
}

export function getTimeUntilNight({ currentTime, location }: SkyParams) {
    const { nightStartTime } = getNightTime({ currentTime, location });
    if (currentTime >= nightStartTime) {
        return 0;
    }
    return nightStartTime.getTime() - currentTime.getTime();
}

export function getSkyMode({ currentTime, location }: SkyParams): SkyMode {
    const { lat, long } = location;
    const { sunsetStart, dusk, night, nightEnd, nauticalDawn } = SunCalc.getTimes(currentTime, lat, long)

    if (currentTime >= sunsetStart && currentTime < dusk) {
        return 'sunset';
    } else if (currentTime >= dusk && currentTime < night) {
        return 'twilight';
    } else if (currentTime >= night || currentTime < nightEnd) {
        return 'night';
    } else if (currentTime >= nightEnd && currentTime < nauticalDawn) {
        return 'dawn';
    } else {
        return 'day';
    }
}