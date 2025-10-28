import { P5CursorGlow } from "@/lib/types/misc"
import p5 from "p5"

export default class CursorGlow implements P5CursorGlow {
    x: number
    y: number
    targetX: number
    targetY: number
    size: number
    easing: number
    p: p5

    constructor(p: p5) {
        this.p = p
        this.x = p.mouseX
        this.y = p.mouseY
        this.targetX = p.mouseX
        this.targetY = p.mouseY
        this.size = 24
        this.easing = 0.15
    }

    ease(): void {
        this.targetX = this.p.mouseX;
        this.targetY = this.p.mouseY;

        this.x += (this.targetX - this.x) * this.easing;
        this.y += (this.targetY - this.y) * this.easing;
    }

    glow(): void {
        this.p.push();

        const maxRadius = this.size * 4;
        const minRadius = 1;
        const steps = 40;

        this.p.noStroke();

        for (let i = 0; i < steps; i++) {
            const r = this.p.map(i, 0, steps, maxRadius, minRadius);
            const t = i / steps;
            const easedT = t * t * t;
            const alpha = this.p.map(easedT, 0, 1, 2, 1);

            this.p.fill(255, 255, 255, alpha);
            this.p.ellipse(this.x, this.y, r);
        }

        this.p.pop();
    }

    pulse(): void {
        this.size += (24 - this.size) * 0.1;
    }

    brighten(): void {
        if (this.size < 40) {
            this.size += 4
        }
    }
}