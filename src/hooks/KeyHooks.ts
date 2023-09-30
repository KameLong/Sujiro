import {useKey} from "react-use";

export const useKeyAlt = (keyName:string, action:(e:KeyboardEvent)=>void) => {
    useKey((e) => e.altKey && e.key === keyName,(e)=>{
        action(e);
    });
};