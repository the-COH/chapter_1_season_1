export class Core {
	CANVAS_WIDTH = 640;
	CANVAS_HEIGHT = 480;
	MAP_SCALE = 10; // Must be a divisor or CANVAS_WIDTH and CANVAS_HEIGHT
	MAP_WIDTH = this.CANVAS_WIDTH / this.MAP_SCALE;
	MAP_HEIGHT = this.CANVAS_HEIGHT / this.MAP_SCALE;

	setCanvasDimensions = function (width, height) {
		this.CANVAS_WIDTH = width;
		this.CANVAS_HEIGHT = height;
		this.updateMapDimensions();
	};

	setMapScale = function (mapScale) {
		if (mapScale !== undefined) {
			this.MAP_SCALE = mapScale;
			this.updateMapDimensions();
		}
	};

	updateMapDimensions = function () {
		this.MAP_WIDTH = Math.floor(this.CANVAS_WIDTH / this.MAP_SCALE);
		this.MAP_HEIGHT = Math.floor(this.CANVAS_HEIGHT / this.MAP_SCALE);
	};
}
