import { useEffect, useRef, useState } from "react"


export const useTimer = (initial: number) => {
    const [seconds, setSeconds] = useState(initial);

    useEffect(() => {
        if (seconds <= 0) return;

        const timeout = setTimeout(() => {
            setSeconds((prevSec) => prevSec - 1);
        }, 1000);
        
        return () => clearTimeout(timeout)

    }, [seconds])


    return seconds;
}