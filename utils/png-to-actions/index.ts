import fs from 'fs';
import PNG from 'png-ts';

const main = () => {
	const buffer = fs.readFileSync('./actions.png');
	const image = PNG.load(buffer);
	const pixels = image.decodePixels();
	const actions = {
		store: [],
		grass: [],
		fish: [],
	};
	for (let i = 0; i < 560; i += 16) {
		for (let j = 0; j < 4032; j += 64) {
			const pixel = i * 4032 + j;

			if (pixels[pixel] === 255) {
				actions.grass.push((pixel / 64) - (1008 * (i / 16)) + (63 * (i / 16)));
			}
			if (pixels[pixel + 1] === 255) {
				actions.store.push((pixel / 64) - (1008 * (i / 16)) + (63 * (i / 16)));
			}
			if (pixels[pixel + 2] === 255) {
				actions.fish.push((pixel / 64) - (1008 * (i / 16)) + (63 * (i / 16)));
			}
		}
	}
	fs.writeFileSync('actions.json', JSON.stringify(actions, null, 2));
};

main();
