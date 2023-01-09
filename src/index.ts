import { GlobalFonts } from "@napi-rs/canvas";
import fs from "fs/promises";

import { createImage } from "./createImage.js";
import type { Linku } from "./types.js";

GlobalFonts.loadFontsFromDir("./fonts");

const SIZES = [16, 24, 32, 48, 64, 128, 256, 512];
const DEFAULT_SIZE = 64;

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

for (const size of SIZES) {
	await fs.mkdir(`./img/${size}`, { recursive: true });
}

for (const glyph of allGlyphs) {
	for (const size of SIZES) {
		const pngData = await createImage(size, glyph);

		await fs.writeFile(`./img/${size}/${glyph}.png`, pngData);

		if (size === DEFAULT_SIZE)
			await fs.writeFile(`./img/${glyph}.png`, pngData);
	}

	console.log(`Wrote ${glyph} glyphs`);
}
