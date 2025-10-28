import p5 from "p5";
import { SKY_MODES, SkyConfig, SkyMode } from "../types/sky";

export const createSky = ({ p, skyMode }: { p: p5, skyMode: SkyMode }) => {
    const pg = p.createGraphics(p.width, p.height);
    const skyConfig: SkyConfig = SKY_MODES[skyMode];
    const { topColor, bottomColor } = skyConfig;

    pg.pixelDensity(1)
    pg.loadPixels();

    const w = pg.width;
    const h = pg.height;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const t = y / h;

            const red = p.lerp(topColor.r, bottomColor.r, t);
            const green = p.lerp(topColor.g, bottomColor.g, t);
            const blue = p.lerp(topColor.b, bottomColor.b, t);
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