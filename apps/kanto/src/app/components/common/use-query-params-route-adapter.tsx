/* eslint-disable object-shorthand */

import { Location } from 'history';
import React from 'react';
import {
	// Location as RouterLocation,
	useLocation,
	useNavigate,
} from 'react-router-dom';

// Temporary fix until use-query-params supports React Router 6
// https://github.com/pbeshai/use-query-params/issues/108
export const RouteV6Adapter: React.FC<{ children?: React.ReactNode }> = ({
	children,
}) => {
	const navigate = useNavigate();
	const location = useLocation();

	const adaptedHistory = React.useMemo(
		() => ({
			push: ({ search, state }: Location) => navigate({ search }, { state }),
			replace: ({ search, state }: Location) =>
				navigate({ search }, { replace: true, state }),
		}),
		[navigate]
	);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return children({ history: adaptedHistory, location });
};
