import {useKey} from "react-use";
import {useState} from "react";
import {atom, useRecoilState} from "recoil";
import {EditDiaData} from "../DiaData/DiaData";
export interface Action{
    action:()=>void;
    undo:()=>void;
}

export const undoStack = atom<Action[]>({
    key: 'undoStack', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});
export const redoStack = atom<Action[]>({
    key: 'redoStack', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});
export const useUndo = () => {
    const [undoState,setUndo]=useRecoilState(undoStack);

    const action:(run:Action)=>void=(run:Action)=>{
        setUndo(old=>{
            const next=[...old];
            next.push(run);
            return next;
        });
        run.action();
    };
    const undo:()=>void=()=>{};
    const redo:()=>void=()=>{};
    const canUndo:()=>boolean=()=>{return false};
    const canRedo:()=>boolean=()=>{return false};
    return [action];



};
