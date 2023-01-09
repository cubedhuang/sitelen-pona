import { SKRSContext2D } from "@napi-rs/canvas";

export function getOffset(SIZE: number, ctx: SKRSContext2D) {
	const data = ctx.getImageData(0, 0, SIZE, SIZE);

	const cols: number[] = Array(SIZE).fill(0);
	const rows: number[] = Array(SIZE).fill(0);
	for (let y = 0; y < SIZE; y++) {
		for (let x = 0; x < SIZE; x++) {
			const i = (y * SIZE + x) * 4;
			if (data.data[i + 3] > 0) {
				cols[x]++;
				rows[y]++;
			}
		}
	}
	const padding = {
		top: rows.findIndex(r => r > 0),
		bottom: rows
			.slice()
			.reverse()
			.findIndex(r => r > 0),
		left: cols.findIndex(r => r > 0),
		right: cols
			.slice()
			.reverse()
			.findIndex(r => r > 0)
	};

	return [
		(padding.left + padding.right) / 2 - padding.left,
		(padding.top + padding.bottom) / 2 - padding.top
	] as const;
}
