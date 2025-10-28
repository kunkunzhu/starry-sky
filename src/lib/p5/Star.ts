import p5 from "p5"
import { P5Star } from "../types/misc"

export default class Star implements P5Star {
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
    p: p5

    constructor(p: p5) {
        this.p = p
        this.id = `star-${Math.floor(Math.random() * 1000)}`
        this.x = p.random(p.width)
        this.y = p.random(p.height)
        this.size = p.random(3, 5)
        this.alpha = 0
        this.fadeSpeed = 0.005
        this.phase = p.random(p.TWO_PI)
        this.glowSize = this.size * 10
        this.maxAlpha = p.random(180, 255)
        this.hue = 0
    }

    update(): void {
        this.phase += this.fadeSpeed
        this.alpha = this.p.map(this.p.sin(this.phase), -1, 1, 0, this.maxAlpha)

        if (this.phase >= this.p.TWO_PI) {
            this.respawn()
        }
    }

    respawn(): void {
        this.x = this.p.random(this.p.width)
        this.y = this.p.random(this.p.height)
        this.size = this.p.random(3, 8)
        this.glowSize = this.size * 10
        this.maxAlpha = this.p.random(180, 255)
        this.hue = 0
        this.phase = 0
        this.fadeSpeed = this.p.random(0.003, 0.008)
    }

    isClicked(mx: number, my: number): boolean {
        const distance = this.p.dist(mx, my, this.x, this.y)
        return distance < this.size + 30
    }

    display(): void {
        this.p.push()
        this.p.translate(this.x, this.y)

        for (let i = 0; i < 2; i++) {
            this.p.strokeWeight(1 + i * 0.5)
            this.p.stroke(255, this.alpha / (i + 2) * 0.4)

            const glowRadius = this.size + i * 2.5
            this.p.line(0, -glowRadius, 0, glowRadius)
            this.p.line(-glowRadius, 0, glowRadius, 0)
        }

        this.drawStar(0, 0, this.size)
        this.p.pop()
    }

    drawStar(x: number, y: number, radius: number) {
        this.p.strokeWeight(1)
        this.p.stroke(255, this.alpha)

        this.p.line(x, y - radius, x, y + radius)
        this.p.line(x - radius, y, x + radius, y)

        const diagRadius = radius * 0.2
        this.p.line(x - diagRadius, y - diagRadius, x + diagRadius, y + diagRadius)
        this.p.line(x - diagRadius, y + diagRadius, x + diagRadius, y - diagRadius)
    }
}