import { MapNode } from './map-node';

export class Map {
	width: number;
	height: number;
	start: MapNode;
	goal: MapNode;
	obstacles: number[];

	constructor(width: number, height: number, obstacles: number[]) {
		this.width = width;
		this.height = height;
		this.start = new MapNode(9, 3);
		this.goal = new MapNode(width - 1, height - 1);
		this.obstacles = obstacles;
	}

	setGoal = (x: number, y: number) => {
		if (this.isOnMap(x, y)) {
			this.goal.x = x;
			this.goal.y = y;
		}
	};

	isOnMap = (x: number, y: number) => x >= 0 && x < this.width && y >= 0 && y < this.height;

	isObstacle = (x: number, y: number) => this.obstacles.includes(y * 63 + x);
}
