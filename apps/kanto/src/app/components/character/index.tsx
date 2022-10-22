/* eslint-disable no-param-reassign */

import React, { MutableRefObject } from 'react';
import Tween from 'rc-tween-one';
import PathPlugin from 'rc-tween-one/es/plugin/PathMotionPlugin';
import walkingRight from '../../../assets/images/walking-right.png';
import walkingLeft from '../../../assets/images/walking-left.png';
import walkingUp from '../../../assets/images/walking-up.png';
import walkingDown from '../../../assets/images/walking-down.png';
import standing from '../../../assets/images/standing.png';
import './style.css';

Tween.plugins.push(PathPlugin);

type Props = {
	moves: { x: number, y: number }[]
	action: string
	start: { x: number, y: number }
	innerRef: MutableRefObject<any>
	setIsMoving: (isMoving: boolean) => void;
	showStore: () => void;
	showCapture: () => void;
}

export const Character = React.memo(({ moves, action, start, innerRef, setIsMoving, showStore, showCapture }: Props) => {
	const onMoveComplete = () => {
		setIsMoving(false);
		if (action === 'store') {
			showStore();
		} else if (action === 'fish' || action === 'grass') {
			showCapture();
		}
	};

	return (
		<Tween
			id="character"
			ref={innerRef}
			animation={{
				duration: moves.length * 150,
				PathMotion: {
					path: moves.length > 0 ? moves : [start],
					pathVars: { type: 'thru', curviness: 0 },
					center: ['0px', '0px'],
					rotate: false,
				},
				ease: 'linear',
				onUpdate: ({ ratio }) => {
					const index = Math.floor(ratio * moves.length);
					const lastNode = moves[index - 1] ?? start;
					const node = moves[index];
					if (node.x > lastNode.x) {
						innerRef.current.style.backgroundImage = `url(${walkingRight})`;
					} else if (node.x < lastNode.x) {
						innerRef.current.style.backgroundImage = `url(${walkingLeft})`;
					} else if (node.y > lastNode.y) {
						innerRef.current.style.backgroundImage = `url(${walkingDown})`;
					} else {
						innerRef.current.style.backgroundImage = `url(${walkingUp})`;
					}
				},
				onComplete: () => {
					innerRef.current.style.backgroundImage = `url(${standing})`;
					onMoveComplete();
				},
			}}
		/>
	);
}, (prev, next) => prev.moves === next.moves);
