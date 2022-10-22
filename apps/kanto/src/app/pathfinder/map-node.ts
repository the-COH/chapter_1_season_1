export class MapNode {
	x: number;

	y: number;

	g: number;

	f: number;

	parent: MapNode;

	constructor(x: number, y: number, parent?: MapNode, cost?: number) {
		this.x = x;
		this.y = y;
		this.g = 0;
		this.f = 0;
		this.parent = parent;
		if (parent) {
			this.g = parent.g + cost;
		}
	}

	equals = (other: MapNode) => this.x === other.x && this.y === other.y;

	getHashKey = () => `${this.x},${this.y}`;
}
