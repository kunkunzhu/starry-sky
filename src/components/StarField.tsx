'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react';
import p5 from 'p5'
import { P5Star, StarData, P5CursorGlow } from '@/lib/types/misc';
import { getRandomStar } from '@/lib/services/star';
import Star from './Star';
// import { testStar } from '@/lib/data/test';

export default function StarField() {
    const sketchRef = useRef<HTMLDivElement>(null)

    const [star, setStar] = useState<StarData | null>(null)
    const [showStar, setShowStar] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [isHovered, setIsHovered] = useState<boolean>(false)

    // star fetching :

    const fetchRandomStar = useCallback(async () => {
        try {
            const star: StarData | null = await getRandomStar();
            setStar(star);
        } catch (error) {
            console.error("⚠️ error fetching random star:", error);
        }
    }, [])

    useEffect(() => {
        setShowStar(true)
        setIsVisible(true)

        if (isHovered) return

        const fadeTimer = setTimeout(() => {
            setIsVisible(false);
        }, 5000);

        const hideTimer = setTimeout(() => {

            setShowStar(false);
            setStar(null)
        }, 5500);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        }
    }, [star, isHovered])

    // p5.js setup :

    useEffect(() => {
        if (!sketchRef.current) return

        const sketch = (p: p5) => {
            const stars: P5Star[] = []
            let sky: p5.Graphics
            let cursorGlow: P5CursorGlow
            const numStars = 75

            const createSky = (p: p5) => {
                const pg = p.createGraphics(p.width, p.height);

                pg.pixelDensity(1)
                pg.loadPixels();

                const w = pg.width;
                const h = pg.height;

                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        const i = (y * w + x) * 4;
                        const t = y / h;

                        const red = p.lerp(8, 15, t);
                        const green = p.lerp(3, 8, t);
                        const blue = p.lerp(30, 50, t);
                        const grain = p.random(-10, 10);

                        pg.pixels[i] = red + grain;
                        pg.pixels[i + 1] = green + grain;
                        pg.pixels[i + 2] = blue + grain;
                        pg.pixels[i + 3] = 255;
                    }
                }

                pg.updatePixels();

                return pg;
            }

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight)
                console.log("screen dim:", p.windowWidth, p.windowHeight);
                sky = createSky(p);

                cursorGlow = new CursorGlow(p)

                for (let i = 0; i < numStars; i++) {
                    stars.push(new Star(p))
                }
            }

            p.draw = () => {
                // p.background(8, 3, 30, 50);
                p.background(255, 0, 0)
                p.image(sky, 0, 0, sky.width, sky.height);

                cursorGlow.ease();
                cursorGlow.glow();


                for (const star of stars) {
                    star.update();
                    star.display();
                }
            }

            p.mouseMoved = () => {
                cursorGlow.pulse();
            }

            p.mousePressed = () => {

                if (cursorGlow) {
                    cursorGlow.brighten()
                }

                for (const star of stars) {
                    if (star.isClicked(p.mouseX, p.mouseY)) {
                        console.log("Star clicked at:", star.x, star.y);
                        if (!showStar) {
                            fetchRandomStar();
                        }
                        break;
                    }
                }
            }



            class CursorGlow implements P5CursorGlow {
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
                    this.targetX = p.mouseX;
                    this.targetY = p.mouseY;

                    this.x += (this.targetX - this.x) * this.easing;
                    this.y += (this.targetY - this.y) * this.easing;
                }

                glow(): void {
                    p.push();

                    const maxRadius = this.size * 4;
                    const minRadius = 1;
                    const steps = 40;

                    p.noStroke();

                    for (let i = 0; i < steps; i++) {
                        const r = p.map(i, 0, steps, maxRadius, minRadius);
                        const t = i / steps;
                        const easedT = t * t * t;
                        const alpha = p.map(easedT, 0, 1, 2, 1);

                        p.fill(255, 255, 255, alpha);
                        p.ellipse(this.x, this.y, r);
                    }

                    p.pop();
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

            class Star implements P5Star {
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

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight)
            }
        }

        const p5Instance = new p5(sketch, sketchRef.current)
        return () => {
            p5Instance.remove()
        }
    }, [fetchRandomStar, showStar])

    return (
        <>
            {
                star && showStar &&
                (< Star
                    star={star}
                    visibility={isVisible}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)} />)
            }
            <div ref={sketchRef} />
        </>
    )
}