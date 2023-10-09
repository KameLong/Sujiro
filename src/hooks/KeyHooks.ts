import {useKey} from "react-use";

export const useKeyAlt = (keyName:string, action:(e:KeyboardEvent)=>void) => {
    useKey((e) => e.altKey && e.code === keyName,(e)=>{
        action(e);
    });
};

export const useKeyCtrl = (keyName:string, action:(e:KeyboardEvent)=>void) => {
    // CtrlとMetaを入れ替えているので
    useKey((e) => {return e.metaKey && e.code === keyName},(e)=>{
        action(e);
    });
};