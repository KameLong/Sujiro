import {useParams} from "react-router-dom";

export function requiredParamsHook<T extends Record<string, any>>() {
    const params = useParams<T>();
    return params as T;
}