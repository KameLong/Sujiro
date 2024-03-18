import { useState } from "react";


interface UndoRedoItem{
    task:()=>void;
    undo:()=>void;
}
export default function useUndoRedoHook(){
    const [undoStack,setUndoStack]=useState<UndoRedoItem[]>([]);
    const [redoStack,setRedoStack]=useState<UndoRedoItem[]>([]);

    function execute(item:UndoRedoItem){
        setUndoStack(
            prev=>{
                return [...prev]
            }
        )
        undoStack.push(item);
        item.task();
        setRedoStack([]);
    }
    function undo(){
        const item=undoStack.pop();
        if(item===undefined){
            return;
        }
        item.undo();
        redoStack.push();
    }
    return {};
}