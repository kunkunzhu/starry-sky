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

export interface StarData {
    id: string
    title: string
    message: string
    public: boolean
}