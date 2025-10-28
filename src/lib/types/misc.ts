export interface P5Star {
    id: string
    x: number
    y: number
    size: number
    alpha: number
    fadeSpeed: number
    phase: number
    glowSize: number
    maxAlpha: number
    hue: number
    update(): void
    respawn(): void
    isClicked(mx: number, my: number): boolean
    display(): void
    drawStar(x: number, y: number, radius1: number, radius2: number): void
}

export interface StarMessageData {
    id: string
    title: string
    message: string
    public: boolean
}

export interface StarRecord {
    id: number
    notion_id: string
    title: string | null
    message: string
    public: boolean
}

export interface P5CursorGlow {
    x: number
    y: number
    targetX: number
    targetY: number
    size: number
    easing: number

    ease: () => void
    glow: () => void
    pulse: () => void
    brighten: () => void
}

export interface LocationCoords {
    lat: number
    long: number
}