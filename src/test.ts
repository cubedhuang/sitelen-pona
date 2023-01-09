import { Canvas, GlobalFonts } from "@napi-rs/canvas";
import fs from "fs/promises";

import { getOffset } from "./center.js";

const SIZE = 400;
const glyph = "epiku";

GlobalFonts.loadFontsFromDir("./fonts");

const canvas = new Canvas(SIZE, SIZE);
const ctx = canvas.getContext("2d");

ctx.font = `${SIZE}px Fairfax Pona HD`;
ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.fillStyle = "#ffffff";

ctx.clearRect(0, 0, SIZE, SIZE);
ctx.fillText(glyph, SIZE / 2, SIZE / 2);

const [offsetX, offsetY] = getOffset(SIZE, ctx);

ctx.clearRect(0, 0, SIZE, SIZE);

ctx.fillText(glyph, SIZE / 2 + offsetX, SIZE / 2 + offsetY);

const pngData = await canvas.encode("png");
await fs
	.writeFile(`./img/${glyph}.png`, pngData)
	.catch(err => console.error(err));
