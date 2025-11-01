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

    const [isClient, setIsClient] = useState(false)

    const [star, setStar] = useState<StarMessageData | null>(null)
    const [showStar, setShowStar] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [isHovered, setIsHovered] = useState<boolean>(false)

    const showStarRef = useRef(showStar)

    useEffect(() => {
        showStarRef.current = showStar
    }, [showStar])

    // client-side check :

    useEffect(() => {
        setIsClient(true)
    }, [])

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
                p.background(8, 3, 30)
                p.image(sky, 0, 0);

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
                        if (!showStarRef.current) {
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

    }, [isClient])

    if (!isClient) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                background: 'rgb(8, 3, 30)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
            }}>
                ˖.𖥔 ݁ ˖ ⊹ ࣪ ˖
            </div>
        )
    }

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