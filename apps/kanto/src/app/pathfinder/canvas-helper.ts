import { OBSTACLE_COLOUR, BACKGROUND_COLOUR, CLOSED_LIST_COLOUR, OPEN_LIST_COLOUR, PATH_COLOUR } from './constants';
import { Core } from './core';

export class CanvasHelper {
	canvas: any;
	context: any;
	core: Core;

	setCanvas = function (canvasElement) {
		this.canvas = canvasElement;
		if (this.canvas && this.canvas.getContext) {
			this.context = this.canvas.getContext('2d');
		}
	};

	drawObstacles = function (map) {
		for (let x = 0; x < this.core.MAP_WIDTH; x++) {
			for (let y = 0; y < this.core.MAP_HEIGHT; y++) {
				if (!map[x][y]) {
					this.drawObstacle(x, y);
				}
			}
		}
	};

	drawObstacle = function (x, y) {
		this.drawNode(x, y, OBSTACLE_COLOUR);
	};

	clearObstacle = function (x, y) {
		this.drawNode(x, y, BACKGROUND_COLOUR);
	};

	drawVisited = function (x, y) {
		this.drawNode(x, y, CLOSED_LIST_COLOUR);
	};

	drawOpenListNode = function (x, y) {
		this.drawNode(x, y, OPEN_LIST_COLOUR);
	};

	drawStartGoal = function (x, y) {
		this.drawNode(x, y, PATH_COLOUR);
	};

	drawNode = function (x, y, COLOUR) {
		this.context.fillStyle = COLOUR;
		this.context.fillRect(x * this.core.MAP_SCALE, y * this.core.MAP_SCALE, this.core.MAP_SCALE, this.core.MAP_SCALE);
	};

	clearCanvas = function () {
		this.context.fillStyle = this.BACKGROUND_COLOUR;
		this.context.fillRect(0, 0, this.core.CANVAS_WIDTH, this.core.CANVAS_HEIGHT);
	};

	draw = function (closedList, openList, startNode, goalNode) {
		this.drawStartGoal(goalNode.x, goalNode.y);
		this.drawStartGoal(startNode.x, startNode.y);

		this.context.beginPath();
		this.context.moveTo((goalNode.x + 0.5) * this.core.MAP_SCALE, (goalNode.y + 0.5) * this.core.MAP_SCALE);

		for (let i = 0; i < openList.length; i++) {
			this.drawOpenListNode(openList[i].x, openList[i].y);
		}

		while (goalNode.parent) {
			this.goalNode = goalNode.parent;
			this.context.lineTo((goalNode.x + 0.5) * this.core.MAP_SCALE, (goalNode.y + 0.5) * this.core.MAP_SCALE);
		}

		this.context.strokeStyle = this.PATH_COLOUR;
		this.context.lineWidth = this.PATH_WIDTH;
		this.context.stroke();
		this.context.closePath();
	};

	drawPath = function (goalNode) {
		this.context.beginPath();
		this.context.moveTo((goalNode.x + 0.5) * this.core.MAP_SCALE, (goalNode.y + 0.5) * this.core.MAP_SCALE);

		while (goalNode.parent) {
			this.goalNode = goalNode.parent;
			this.context.lineTo((goalNode.x + 0.5) * this.core.MAP_SCALE, (goalNode.y + 0.5) * this.core.MAP_SCALE);
		}

		this.context.strokeStyle = this.PATH_COLOUR;
		this.context.lineWidth = this.PATH_WIDTH;
		this.context.stroke();
		this.context.closePath();
	};

	getCanvasWidth = function () {
		this.canvas.setAttribute('width', this.canvas.clientWidth);
		return this.canvas.clientWidth;
	};

	getCanvasHeight = function () {
		this.canvas.setAttribute('height', this.canvas.clientHeight);
		return this.canvas.clientHeight;
	};
}
