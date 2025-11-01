import CursorGlow from "@/lib/p5/CursorGlow"
import { createSky } from "@/lib/p5/Sky"
import { P5CursorGlow } from "@/lib/types/misc"
import { SkyMode } from "@/lib/types/sky"
import p5 from "p5"
import { useEffect, useRef } from "react"

export default function Field({ skyMode, glow = true }: { skyMode: SkyMode, glow?: boolean }) {
    const sketchRef = useRef<HTMLDivElement>(null)

    // p5.js setup :

    useEffect(() => {
        if (!sketchRef.current) return

        const sketch = (p: p5) => {
            let sky: p5.Graphics
            let cursorGlow: P5CursorGlow

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight)
                sky = createSky({ p, skyMode });
                if (glow) {
                    cursorGlow = new CursorGlow(p)
                }
            }

            p.draw = () => {
                p.background(8, 3, 30)
                p.image(sky, 0, 0, sky.width, sky.height);

                if (glow) {
                    cursorGlow.ease();
                    cursorGlow.glow();
                }
            }

            p.mouseMoved = () => {
                if (glow) {
                    cursorGlow.pulse();
                }
            }

            p.mousePressed = () => {
                if (glow) {
                    cursorGlow.brighten()
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
    }, [glow, skyMode])


    return (
        <div ref={sketchRef} />
    )
}