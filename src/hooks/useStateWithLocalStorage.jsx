import {
    useEffect,
    useState,
} from 'react';

const useStateWithLocalStorage = (localStorageKey, fallbackValue) => {
    let initialValue = localStorage.getItem(localStorageKey);

    if (initialValue === null || initialValue === undefined) {
        initialValue = fallbackValue;
    } else {
        initialValue = JSON.parse(initialValue);
    }

    const [
        value,
        innerSetState,
    ] = useState(initialValue);

    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(value));
    }, [
        value,
        localStorageKey,
    ]);


    return [
        value,
        innerSetState,
    ];
};

export default useStateWithLocalStorage;