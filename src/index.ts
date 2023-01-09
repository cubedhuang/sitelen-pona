import { Canvas, GlobalFonts } from "@napi-rs/canvas";
import fs from "fs/promises";

import { getOffset } from "./center.js";
import type { Linku } from "./types.js";

GlobalFonts.loadFontsFromDir("./fonts");

const SIZE = 400;

const data: Linku = await fetch("https://linku.la/jasima/data.json").then(res =>
	res.json()
);

const allGlyphs: string[] = [];

for (const word of Object.values(data.data)) {
	const glyphs = word.sitelen_pona?.split(" ");

	if (!glyphs?.length) continue;

	// Expand glyphs, eg ["misa", "misa5"] -> ["misa", "misa2", "misa3", "misa4", "misa5"]
	if (glyphs.length > 1) {
		const lastGlyph = glyphs.pop();
		const number = Number(lastGlyph!.at(-1));

		for (let i = 2; i <= number; i++) {
			glyphs.push(`${glyphs[0]}${i}`);
		}
	}

	allGlyphs.push(...glyphs);
}

await Promise.all(
	allGlyphs.map(async glyph => {
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
	})
);
