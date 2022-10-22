import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DarkModeContext } from './contexts/dark-mode-context';
import { Home } from './routes/home';

export const App = () => {
	const { enabled, force } = useContext(DarkModeContext);

	return (
		<div className={`${enabled || force ? 'dark' : ''}`}>
			<div className="min-h-screen bg-[#F8F8F8] dark:bg-neutral-800">
				<Routes>
					<Route path="*" element={<Home />} />
				</Routes>
			</div>
		</div>
	);
};
