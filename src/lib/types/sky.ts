export type SkyMode = 'day' | 'sunset' | 'night' | 'twilight' | 'dawn';

export interface SkyConfig {
    topColor: { r: number; g: number; b: number }
    bottomColor: { r: number; g: number; b: number }
}

export const SKY_MODES: Record<SkyMode, SkyConfig> = {
    night: {
        topColor: { r: 8, g: 3, b: 30 },
        bottomColor: { r: 15, g: 8, b: 50 },
    },

    day: {
        topColor: { r: 78, g: 191, b: 237 },
        bottomColor: { r: 175, g: 216, b: 250 },
    },

    sunset: {
        topColor: { r: 199, g: 120, b: 245 },
        bottomColor: { r: 255, g: 183, b: 77 },
    },

    twilight: {
        topColor: { r: 25, g: 25, b: 112 },
        bottomColor: { r: 187, g: 136, b: 235 },
    },

    dawn: {
        topColor: { r: 86, g: 141, b: 245 },
        bottomColor: { r: 255, g: 158, b: 110 },
    }
}

export const { night, day, sunset, twilight, dawn } = SKY_MODES;