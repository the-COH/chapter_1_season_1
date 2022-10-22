export const timeNow = () => {
	if (typeof window !== 'undefined') {
		return window.performance.now();
	}
	// Fake performance for node.js
	return 0;
};
