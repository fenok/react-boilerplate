import { useEffect, useState } from 'react';

export function useCounter() {
    const [counter, setCounter] = useState<number>(0);

    let timer: number | null = null;

    useEffect(() => {
        timer = window.setInterval(() => {
            setCounter(counter => counter + 2);
        }, 1000);

        return () => {
            if (timer) {
                window.clearInterval(timer);
            }
        };
    }, []);

    function dropCounter() {
        setCounter(0);
    }

    return { counter, dropCounter };
}
