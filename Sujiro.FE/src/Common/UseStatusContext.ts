import { createContext, useCallback, useState } from 'react';

interface StatusContext{
    isLogined: boolean;
    setLogined: (current: boolean) => void;
};


// context object
export const statusContext = createContext<StatusContext>({
    isLogined: true,
    setLogined: () => {
        console.log("test");
    },
});

// custom Hook
export const useStatusContext = (): StatusContext => {
    // state名はThemeContext typeのプロパティに合わせる。
    const [logined, setLogined] = useState(true);
    // 関数名はThemeContext typeのプロパティに合わせる。
    const setIsDark = useCallback((current: boolean): void => {
        console.log("test3");
        setLogined(current);
    }, []);
    return {
        isLogined: logined,
        setLogined: setIsDark,
    };
};