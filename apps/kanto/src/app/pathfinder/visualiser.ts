import { Map } from './map';

export class Visualiser {
	map: Map;
	algorithmDelegate: any;
	resizeTimeout: any;
	paintNodesTimeout: any;
	canvasHelper: any;
	core: any;

	init = function (canvasElement) {
		this.canvasHelper.setCanvas(canvasElement);
		this.core.setCanvasDimensions(this.canvasHelper.getCanvasWidth(), this.canvasHelper.getCanvasHeight());

		this.map = new Map(this.core.MAP_WIDTH, this.core.MAP_HEIGHT, []);

		this.clear();

		window.addEventListener('resize', this.resizeWindow);
	};

	setAlgorithm = function (algorithm) {
		this.algorithmDelegate = algorithm;
	};

	setGoalToMouse = function (e) {
		const position = this.getPosition(e);
		// Convert from mouse to map coords
		position.x = Math.floor(position.x / this.core.MAP_SCALE);
		position.y = Math.floor(position.y / this.core.MAP_SCALE);
		this.map.setGoal(position.x, position.y);
	};

	clear = function () {
		if (this.paintNodesTimeout) {
			clearTimeout(this.paintNodesTimeout);
		}
		this.canvasHelper.clearCanvas();
		this.map.clear();
	};

	run = function (callback, getSpeed) {
		if (this.paintNodesTimeout) {
			clearTimeout(this.paintNodesTimeout);
		}
		this.canvasHelper.clearCanvas();
		this.canvasHelper.drawObstacles(this.map);

		const startTime = window.performance.now();
		this.algorithmDelegate.run(this.map, (results, queuedPaints, goalNode, openList, finish) => {
			let message = '';
			const duration = finish - startTime;
			results.push({ result: `Operation took ${duration.toFixed(2)}ms` });
			for (let i = 0; i < results.length; i++) {
				const r = results[i];
				if (r.colour) {
					message += `<pathfinding-visualiser-summary-line hascolour colour="${r.colour}">${r.result}</pathfinding-visualiser-summary-line>`;
				} else {
					message += `<pathfinding-visualiser-summary-line>${r.result}</pathfinding-visualiser-summary-line>`;
				}
			}

			this.canvasHelper.drawStartGoal(this.map.start.x, this.map.start.y);
			this.paintNodes(queuedPaints, goalNode, openList, getSpeed || 0);

			callback(message);
		});
	};

	generateMap = function (mapScale, obstacleDensity, obstacleSize) {
		if (this.paintNodesTimeout) {
			clearTimeout(this.paintNodesTimeout);
		}
		this.core.setMapScale(mapScale);
		this.canvasHelper.clearCanvas();
		this.map.generate(this.core.MAP_WIDTH, this.core.MAP_HEIGHT, obstacleDensity, obstacleSize);
		this.canvasHelper.drawObstacles(this.map);
	};

	paintNodes = function (queuedPaints, goalNode, openList, getSpeed) {
		if (!queuedPaints.length) {
			return;
		}
		const paint = queuedPaints.shift();
		if (paint.x !== this.map.start.x || paint.y !== this.map.start.y) {
			paint.f.call(null, paint.x, paint.y);
		}
		if (queuedPaints.length) {
			if (getSpeed) {
				this.paintNodesTimeout = setTimeout(() => {
					this.paintNodes(queuedPaints, goalNode, openList, getSpeed);
				}, getSpeed());
			} else if (queuedPaints.length % 200 === 0) {
				// Prevent max call stack and let renderer catch up
				setTimeout(() => {
					this.paintNodes(queuedPaints, goalNode, openList, getSpeed);
				}, 0);
			} else {
				this.paintNodes(queuedPaints, goalNode, openList, getSpeed);
			}
		} else if (this.goalNode) {
			// Only draw the path if a path was found
			this.canvasHelper.drawStartGoal(goalNode.x, goalNode.y);
			this.canvasHelper.drawPath(goalNode, openList);
		}
	};

	// eslint-disable-next-line class-methods-use-this
	getPosition = function (e) {
		let target;
		if (!e) {
			// eslint-disable-next-line no-param-reassign
			e = window.event;
		}
		if (e.target) {
			target = e.target;
		} else if (e.srcElement) {
			target = e.srcElement;
		}
		if (target.nodeType === 3) {
			target = target.parentNode;
		}

		const x = e.pageX - target.offsetLeft;
		const y = e.pageY - target.offsetTop;

		return { x: x, y: y };
	};

	resizeWindow = function () {
		window.clearTimeout(this.resizeTimeout);
		this.resizeTimeout = setTimeout(this.resizeMap, 200);
	};

	resizeMap = function () {
		this.core.setCanvasDimensions(this.canvasHelper.getCanvasWidth(), this.canvasHelper.getCanvasHeight());
		this.clear();
		this.generateMap();
		this.map.setGoal(this.core.MAP_WIDTH - 1, this.core.MAP_HEIGHT - 1);
	};
}
