/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React, { useEffect, useRef, useState } from 'react';
import { isNil } from 'lodash';
import mapImage from '../../assets/images/map.jpg';
import { AStarArray } from '../pathfinder/a-star-array';
import { Map } from '../pathfinder/map';
import { MapNode } from '../pathfinder/map-node';
import obstacles from '../../assets/obstacles.json';
import { Character } from '../components/character';
import { ConnectWalletButton } from '../components/connect-wallet-button';
import { CaptureModal } from '../components/capture-modal';
import { Store } from '../components/store';
import actions from '../../assets/actions.json';

export const Home: React.FC = () => {
	const [showStore, setShowStore] = useState(false);
	const [showCapture, setShowCapture] = useState(false);
	const [scale, setScale] = useState(1);
	const [start, setStart] = useState<{x: number, y: number}>({ x: 144, y: 64 });
	const [moves, setMoves] = useState<{x: number, y: number}[]>([]);
	const [action, setAction] = useState<string>(null);
	const [isMoving, setIsMoving] = useState(false);
	const characterRef = useRef(null);

	const calculateMoves = (x: number, y: number) => {
		const map = new Map(63, 35, obstacles);
		const lastMove = moves[moves.length - 1];
		if (lastMove) {
			map.start = new MapNode(Math.floor(lastMove.x / 16), Math.floor(lastMove.y / 16));
		}
		const goal = new MapNode(Math.floor(x / (16 * scale)), Math.floor(y / (16 * scale)));
		const mapIndex = goal.y * 63 + goal.x;

		const isStore = actions.store.includes(mapIndex);
		const isGrass = actions.grass.includes(mapIndex);
		const isFishing = actions.fish.includes(mapIndex);
		let action: string = null;
		if (isStore) {
			action = 'store';
		} else if (isGrass) {
			action = 'grass';
		} else if (isFishing) {
			action = 'fish';
		}

		let finalGoal = new MapNode(goal.x, goal.y);
		let distance = 1;
		let xDirection = -1;
		let yDirection = -1;
		while (map.isObstacle(finalGoal.x, finalGoal.y)) {
			const newX = goal.x + xDirection * distance;
			const newY = goal.y + yDirection * distance;
			if (newX >= 0 && newX <= 62 && newY >= 0 && newY <= 34) {
				finalGoal = new MapNode(goal.x + xDirection * distance, goal.y + yDirection * distance);
			}
			xDirection++;
			if (xDirection === 2) {
				xDirection = -1;
				yDirection++;
			}
			if (yDirection === 2) {
				distance++;
				xDirection = -1;
				yDirection = -1;
			}
		}
		map.setGoal(finalGoal.x, finalGoal.y);

		const algo = new AStarArray();
		algo.run(map, (goal: MapNode) => {
			const moves: MapNode[] = [];
			while (!isNil(goal)) {
				moves.push(goal);
				goal = goal.parent;
			}

			const animationMoves = moves.reverse().map(((move) => ({ x: move.x * 16, y: move.y * 16 })));
			setStart(animationMoves[0]);
			setAction(action);
			setIsMoving(true);
			setMoves(animationMoves.slice(1));
		});
	};

	useEffect(() => {
		function handleResize() {
			const scale = window.innerWidth / window.innerHeight > 1.8 ? window.innerWidth / 1008 : window.innerHeight / 560;
			characterRef.current.style.scale = scale;
			setScale(scale);
		}
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const grassTerrainIds = [0, 1, 4, 5, 6, 7];
	const waterTerrainIds = [2, 3];

	const randomInt = (max: number) => Math.floor(Math.random() * (max + 1));

	return (
		<div className="flex">
			<CaptureModal
				open={showCapture}
				terrainId={action === 'grass' ? grassTerrainIds[randomInt(5)] : waterTerrainIds[randomInt(1)]}
				onCaught={() => setShowCapture(false)}
				showStore={() => setShowStore(true)}
			/>
			<Store open={showStore} onClose={() => setShowStore(false)} />
			<div className={`relative ${window.innerWidth / window.innerHeight > 1.8 ? 'w-screen' : 'h-screen'}`}>
				<img
					className={`max-w-none overflow-hidden ${window.innerWidth / window.innerHeight > 1.8 ? 'w-full' : 'h-full'}`}
					src={mapImage}
					alt=""
					onClick={((e) => {
						if (isMoving) return;
						calculateMoves(e.pageX, e.pageY);
					})}
				/>
				<Character
					moves={moves}
					action={action}
					start={start}
					innerRef={characterRef}
					setIsMoving={setIsMoving}
					showStore={() => setShowStore(true)}
					showCapture={() => setShowCapture(true)}
				/>
			</div>
			<div className="absolute p-4 right-0 top-0">
				<ConnectWalletButton />
			</div>
		</div>
	);
};
