import fs from 'fs';
import PNG from 'png-ts';

const main = () => {
	const buffer = fs.readFileSync('./collision.png');
	const image = PNG.load(buffer);
	const pixels = image.decodePixels();
	const obstacles = [];
	for (let i = 0; i < 560; i += 16) {
		for (let j = 0; j < 4032; j += 64) {
			const pixel = i * 4032 + j;
			if (pixels[pixel] === 0) {
				obstacles.push((pixel / 64) - (1008 * (i / 16)) + (63 * (i / 16)));
			}
		}
	}
	fs.writeFileSync('obstacles.json', JSON.stringify(obstacles, null, 2));
};

main();
