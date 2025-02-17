import { useState, useCallback } from 'react';

function useClicks() {
    const [clicks, setClicks] = useState(0);

    const incrementClicks = useCallback(() => {
        setClicks((prevClicks) => prevClicks + 1);
    }, []);

    return { clicks, incrementClicks };
}

export default useClicks;