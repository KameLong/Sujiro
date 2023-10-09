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
export const useUndo: () => [(run: Action) => void, () => void, () => void, boolean, boolean] = () => {
    const [undoState,setUndo]=useRecoilState(undoStack);
    const [redoState,setRedo]=useRecoilState(redoStack);

    const action:(run:Action)=>void=(run:Action)=>{
        setRedo([]);
        setUndo(old=>{
            const next=old.slice(-100);
            next.push(run);
            return next;
        });
        run.action();
    };
    const undo:()=>void=()=>{
        if(undoState.length===0){
            return;
        }
        const undoItem=undoState[undoState.length-1];
        setRedo((old)=>{
            const next=[...old];
            next.push(undoItem);
            return next;
        })
        setUndo((old)=>{
            return old.filter(item=>item!==undoItem);
        })
        undoItem.undo();
    };
    const redo:()=>void=()=>{
        if(redoState.length===0){
            return;
        }
        const redoItem=redoState[redoState.length-1];
        setUndo((old)=>{
            const next=[...old];
            next.push(redoItem);
            return next;
        })
        setRedo((old)=>{
            return old.filter(item=>item!==redoItem);
        })
        redoItem.action();
    };
    const canUndo:()=>boolean=()=>{return undoState.length>0};
    const canRedo:()=>boolean=()=>{return redoState.length>0};
    return [action,undo,redo,canUndo(),canRedo()];



};
