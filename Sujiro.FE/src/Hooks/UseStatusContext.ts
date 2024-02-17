import {createContext, useCallback, useEffect, useState} from 'react';

interface StatusContext{
    hasError: boolean;
    isNotLogined: boolean;
    setNotLogined: (current: boolean) => void;
    unAuthorized: boolean;
    setUnAuthorized: (current: boolean) => void;
    forbiddenError: boolean;
    setForbiddenError: (current: boolean) => void;
    clientError?: string;
    setClientError: (current: string) => void;
    networkError?: boolean;
    setNetworkError: (current: boolean) => void;
    notFoundError?: boolean;
    setNotFoundError: (current: boolean) => void;

};


export const statusContext = createContext<StatusContext>({
    isNotLogined: false,
    setNotLogined: () => {
    },
    unAuthorized: false,
    setUnAuthorized: () => {
    },
    forbiddenError: false,
    setForbiddenError: () => {
    },
    clientError: undefined,
    setClientError: () => {
    },
    hasError: false,
    networkError: false,
    setNetworkError: () => {
    },
    notFoundError: false,
    setNotFoundError: () => {
    }


});

export const useStatusContext = (): StatusContext => {
    const [hasError, setHasError] = useState(false);

    const [notLogined, setNotLogined] = useState(false);
    const [unAuthorized, setUnAuthorized] = useState(false);
    const [forbiddenError, setForbiddenError] = useState(false);
    const [clientError, setClientError] = useState<undefined|string>(undefined);
    const [networkError, setNetworkError] = useState(false);
    const [notFoundError, setNotFoundError] = useState(false);


    useEffect(()=>{
        if(notLogined || unAuthorized || forbiddenError || clientError || networkError || notFoundError){
            setHasError(true);
        }else{
            setHasError(false);
        }
    },[notLogined, unAuthorized, forbiddenError, clientError, networkError, notFoundError]);

    const setLogined2 = useCallback((current: boolean) => {
        console.log(current);
        console.trace();
        setNotLogined(current);
    },[]);

    return {
        isNotLogined: notLogined,
        setNotLogined: setLogined2,
        unAuthorized: unAuthorized,
        setUnAuthorized: setUnAuthorized,
        forbiddenError: forbiddenError,
        setForbiddenError: setForbiddenError,
        clientError: clientError,
        setClientError: setClientError,
        hasError: hasError,
        networkError: networkError,
        setNetworkError: setNetworkError,
        notFoundError: notFoundError,
        setNotFoundError: setNotFoundError
    };
};