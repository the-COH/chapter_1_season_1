import React, {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useLocalStorage } from '../hooks/use-local-storage.hook';

export namespace DarkModeContext {
	export type Value = {
		enabled: boolean;
		setEnabled: Dispatch<SetStateAction<boolean>>;
		force: boolean
		setForce: Dispatch<SetStateAction<boolean>>;
	};
}

export const DarkModeContext = createContext<DarkModeContext.Value>({} as DarkModeContext.Value);
DarkModeContext.displayName = 'DarkMode';

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
	const [localStorageEnabled, setLocalStorageEnabled] = useLocalStorage<boolean>('darkModeEnabled', false);
	const [enabled, setEnabled] = useState<boolean>(localStorageEnabled);
	const [force, setForce] = useState<boolean>(localStorageEnabled);

	useEffect(() => {
		setLocalStorageEnabled(enabled);
	}, [setLocalStorageEnabled, enabled]);

	const value = useMemo<DarkModeContext.Value>(
		() => ({
			enabled,
			setEnabled,
			force,
			setForce,
		}),
		[enabled, setEnabled, force, setForce]
	);
	return <DarkModeContext.Provider value={value}>{children}</DarkModeContext.Provider>;
};
