/* eslint-disable react/require-default-props */

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import './style.css';

export interface Props {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
  transparent?: boolean;
  className?: string;
}

export const Popup = ({
	children,
	open,
	onClose,
	transparent,
	className = '',
}: Props) => (
	<Dialog
		className={`popup ${className}`}
		onClose={onClose}
		open={open}
		PaperProps={{
			style: {
				width: '100%',
				background: 'transparent',
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				maxHeight: 'unset',
				boxShadow: 'unset',
			},
		}}
		BackdropProps={{
			style: !transparent
				? {}
				: {
					backgroundColor: 'transparent',
					boxShadow: 'none',
				},
		}}
	>
		<div className="popup-content">
			{children}
		</div>
	</Dialog>
);
