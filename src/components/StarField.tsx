'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react';
import p5 from 'p5'
import { P5Star, StarMessageData, P5CursorGlow } from '@/lib/types/misc';
import { getRandomStar } from '@/lib/services/star';
import CursorGlow from '@/lib/p5/CursorGlow';
import Star from '@/lib/p5/Star';
import StarMessage from './StarMessage';
import { createSky } from '@/lib/p5/Sky';

export default function StarField() {
    const sketchRef = useRef<HTMLDivElement>(null)

    const [star, setStar] = useState<StarMessageData | null>(null)
    const [showStar, setShowStar] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [isHovered, setIsHovered] = useState<boolean>(false)

    // star fetching :

    const fetchRandomStar = useCallback(async () => {
        try {
            const star: StarMessageData | null = await getRandomStar();
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

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight)
                sky = createSky({ p, skyMode: 'night' });

                cursorGlow = new CursorGlow(p)

                for (let i = 0; i < numStars; i++) {
                    stars.push(new Star(p))
                }
            }

            p.draw = () => {
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

                cursorGlow.brighten()

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
                (<StarMessage
                    star={star}
                    visibility={isVisible}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)} />)
            }
            <div ref={sketchRef} />
        </>
    )
}