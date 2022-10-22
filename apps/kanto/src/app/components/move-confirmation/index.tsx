import React from 'react';
import { CloseButton } from '../close-button';
import { Popup } from '../popup';
import './style.css';

type Props = {
	onConfirm: () => void;
	open: boolean;
	onCancel: () => void;
	steps: number
}

export const MoveConfirmation = ({ onConfirm, onCancel, open, steps }: Props) => (
	<Popup open={open} onClose={onCancel} className="wallet-select">
		<>
			<div className="flex items-center p-4">
				<h3 className="grow">Confirm Move</h3>
				<CloseButton onClick={onCancel} />
			</div>
			<hr className="border-top w-full" />
			<div className="p-4">
				Move to selected location using
				{' '}
				{steps}
				{' '}
				steps?
			</div>
			<div className="flex items-center">
				<button type="button" className="w-full p-4 bg-red-500 rounded-bl-[20px]" onClick={onCancel}>Cancel</button>
				<button
					type="button"
					className="w-full p-4 bg-green-500 rounded-br-[20px]"
					onClick={() => {
						onConfirm();
						onCancel();
					}}
				>
					Confirm
				</button>
			</div>
		</>
	</Popup>
);
