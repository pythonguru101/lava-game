import { useState, useEffect } from "react";

// Detect key press hook
const useKeyPress = (callback: (a: string) => void) => {
	const [keyPressed, setKeyPressed] = useState<string | null>();

    useEffect(() => {
        const downHandler = ({ key }: { key: string }) => {
			if (keyPressed !== key && key) {
				setKeyPressed(key);
				callback && callback(key);
			}
		};

        const upHandler = () => {
			setKeyPressed(null);
		};

		window.addEventListener("keydown", downHandler);
		window.addEventListener("keyup", upHandler);

		return () => {
			window.removeEventListener("keydown", downHandler);
			window.removeEventListener("keyup", upHandler);
		};
    });
    
    return keyPressed;
};

export default useKeyPress;
