import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import './style.css';

interface Props {
  onClick: () => void;
}

export const CloseButton = ({ onClick }: Props) => (
	<button type="button" onClick={onClick} className="close-btn">
		<CloseIcon style={{ color: 'black' }} />
	</button>
);
