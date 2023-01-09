import { Canvas } from "@napi-rs/canvas";

import { getOffset } from "./center.js";

const canvases: Map<number, Canvas> = new Map();

export async function createImage(size: number, glyph: string) {
	const canvas =
		canvases.get(size) ??
		canvases.set(size, new Canvas(size, size)).get(size)!;

	const ctx = canvas.getContext("2d");

	ctx.font = `${size}px Fairfax Pona HD`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.fillStyle = "#ffffff";

	ctx.clearRect(0, 0, size, size);
	ctx.fillText(glyph, size / 2, size / 2);

	const [offsetX, offsetY] = getOffset(size, ctx);

	ctx.clearRect(0, 0, size, size);

	ctx.fillText(glyph, size / 2 + offsetX, size / 2 + offsetY);

	return await canvas.encode("png");
}
