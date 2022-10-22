/* eslint-disable no-continue */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

import { toast } from 'react-toastify';
import { Map } from './map';
import { MapNode } from './map-node';

export class AStarArray {
	run = function (map: Map, callback: (goal: MapNode) => void) {
		let i: number;
		const closedList = [];
		const openList = [];
		const start = map.start;
		const goal = map.goal;

		start.f = start.g + this.heuristic(start, goal);
		openList.push(start);

		let lastNode = null;

		while (openList.length > 0) {
			let lowestF = 0;
			for (i = 1; i < openList.length; i++) {
				if (openList[i].f < openList[lowestF].f) {
					lowestF = i;
				}
			}
			const current = openList[lowestF];
			lastNode = current;

			if (current.equals(goal)) {
				callback(current);
				return;
			}

			openList.splice(lowestF, 1);
			closedList.push(current);

			const neighbours = this.getNeighbourNodes(map, current);
			this.addNodesToOpenList(neighbours, goal, openList, closedList);
		}

		console.log(lastNode);
		callback(lastNode);
	};

	addNodesToOpenList = (nodes, goal, openList, closedList) => {
		for (let i = 0; i < nodes.length; i++) {
			// Skip if in closed list
			if (this.indexOfNode(closedList, nodes[i]) === -1) {
				const index = this.indexOfNode(openList, nodes[i]);
				if (index === -1) {
					nodes[i].f = nodes[i].g + this.heuristic(nodes[i], goal);
					openList.push(nodes[i]);
				} else if (nodes[i].g < openList[index].g) {
					nodes[i].f = nodes[i].g + this.heuristic(nodes[i], goal);
					openList[index] = nodes[i];
				}
			}
		}
	};

	// eslint-disable-next-line class-methods-use-this
	indexOfNode = (array, node) => {
		for (let i = 0; i < array.length; i++) {
			if (node.equals(array[i])) {
				return i;
			}
		}
		return -1;
	};

	getNeighbourNodes = (map: Map, node: MapNode) => {
		const neighbours = [];

		for (let x = node.x - 1; x <= node.x + 1; x++) {
			for (let y = node.y - 1; y <= node.y + 1; y++) {
				if (x === node.x && y === node.y) {
					continue;
				}
				if (!map.isOnMap(x, y) || map.isObstacle(x, y)) {
					continue;
				}
				if (x === node.x || y === node.y) {
					neighbours.push(new MapNode(x, y, node, 1));
				}
			}
		}

		return neighbours;
	};

	heuristic = (node: MapNode, goal: MapNode) => Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
}
