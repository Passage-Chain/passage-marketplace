import React from 'react';

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] =
        React.useState(value);

    React.useEffect(
        () => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay], // Only re-call effect if value or delay changes
    );
    return debouncedValue;
}

export default useDebounce;
