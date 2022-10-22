import React, { useLayoutEffect, useState } from 'react';
import { BrowserHistory } from 'history';
import { BrowserRouterProps, Router } from 'react-router-dom';

import { customHistory } from '../../utils/history.utils';

interface Props extends BrowserRouterProps {
  history: BrowserHistory
}

// Allows navigating outside of components with React Router v6
// https://stackoverflow.com/questions/69871987/react-router-v6-navigate-outside-of-components
export const CustomRouter = ({ basename, history, children }: Props) => {
	const [state, setState] = useState({
		action: history.action,
		location: history.location,
	});
	useLayoutEffect(() => history.listen(setState), [history]);
	return (
		<Router
			navigator={customHistory}
			location={state.location}
			navigationType={state.action}
			basename={basename}
		>
			{children}
		</Router>
	);
};
