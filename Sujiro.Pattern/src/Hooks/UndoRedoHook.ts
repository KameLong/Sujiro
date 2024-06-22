import {createContext, useState} from "react";
import {atom, RecoilState, useRecoilState} from "recoil";

export const undoStackAtom:RecoilState<UndoRedoItem[]>=atom({
    key:'undoStack',
    default:[]as UndoRedoItem[]
})
export const redoStackAtom:RecoilState<UndoRedoItem[]>=atom({
    key:'redoStack',
    default:[]as UndoRedoItem[]
})

export interface UndoRedoItem{
    task:()=>void;
    undo:()=>void;
}


interface UndoRedoContext{
    execute:(item:UndoRedoItem)=>void;
    undo:()=>void;
};
export const UndoRedoContext =createContext<UndoRedoContext>({
    execute:()=>{

    },
    undo:()=>{

    }
});


export function useUndoRedoContext(){
    const [undoStack,setUndoStack]=useRecoilState(undoStackAtom);
    const [redoStack,setRedoStack]=useRecoilState(redoStackAtom);

    function execute(item:UndoRedoItem){
        console.log(undoStack);
        setUndoStack(
            prev=>{
                return [...prev,item]
            }
        )
        item.task();
        setRedoStack([]);
    }
    function undo(){
        console.log(undoStack);
        const item=undoStack.slice(-1)[0];
        setUndoStack(prev=>{
            const next=[...prev];
            next.pop();
            return next
        })
        if(item===undefined){
            return;
        }else{
            item.undo();
        }
        setRedoStack(redo=>{
            return [...redo,item]
        })


    }
    return {execute,undo};
}