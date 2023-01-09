import { GlobalFonts } from "@napi-rs/canvas";
import fs from "fs/promises";

import { createImage } from "./createImage.js";
import type { Linku } from "./types.js";

GlobalFonts.loadFontsFromDir("./fonts");

const SIZES = [64, 128, 256, 512, 1024];

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

await fs.mkdir("./img", { recursive: true });
for (const size of SIZES) {
	if (size === 256) continue;
	await fs.mkdir(`./img/${size}`, { recursive: true });
}

// await Promise.all(
// 	allGlyphs
// 		.map(glyph =>
// 			SIZES.map(async size => {
// 				const pngData = await createImage(size, glyph);

// 				if (size !== 256) {
// 					await fs.writeFile(`./img/${size}/${glyph}.png`, pngData);
// 				} else {
// 					await fs.writeFile(`./img/${glyph}.png`, pngData);
// 				}

// 				console.log(`Wrote ${glyph}.png (${size})`);
// 			})
// 		)
// 		.flat()
// );
for (const glyph of allGlyphs) {
	for (const size of SIZES) {
		const pngData = await createImage(size, glyph);

		if (size !== 256) {
			await fs.writeFile(`./img/${size}/${glyph}.png`, pngData);
		} else {
			await fs.writeFile(`./img/${glyph}.png`, pngData);
		}

		console.log(`Wrote ${glyph}.png (${size})`);
	}
}
