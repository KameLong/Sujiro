import {useRef, useState} from 'react';
import {useKey} from "react-use";

type FocusControlResult = {
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    ref: (element: HTMLInputElement) => void;
};

export const useFocusControl = (onChange:(element:HTMLElement)=>void) => {
    const ref = useRef<Record<string, HTMLInputElement>>({});
    const columns=1000; //現在の列の数を割り当てる
    const rows = 1000; //現在の行の数を割り当てる
    let prevKey="";
    let onChange2:((dom:HTMLElement)=>void)|undefined=undefined;

    // const onChange=(element:HTMLElement)=>{
    //     console.log("change")
    //     console.log(element);
    // }

    return {register: (rowIndex: number, columnIndex: number): FocusControlResult => {
        const key = `${rowIndex}-${columnIndex}`;
        ref.current[key] = ref.current[key] || null;

        /**
         * Key押下時の処理を決める関数
         * @param event
         */
        const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
            const isEnterKey = event.key === 'Enter';
            const isShiftKeyPressed = event.shiftKey;
            const isArrowKeyPressed = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(
                event.key,
            );
            //対象のキーでない場合は早期リターン
            if (!isEnterKey && !isArrowKeyPressed) {
                return;
            }

            //その要素本来の動作を止める
            event.preventDefault();
            //キーに応じた処理を実行する
            if (isEnterKey) {
                const element=(ref.current[ `${rowIndex}-${columnIndex}`] as HTMLElement)
                const dblclick = new MouseEvent("dblclick", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                });
                element.dispatchEvent(dblclick);
                // if (isShiftKeyPressed) {
                //     handleShiftEnter(rowIndex, columnIndex);
                // } else {
                //     handleEnter(rowIndex, columnIndex);
                // }
            } else
                if (isArrowKeyPressed) {
                handleArrow(event.key, rowIndex, columnIndex);
            }
        };

        /**
         * refとHTMLInputElementを紐付ける関数
         * @param element
         */
        const setRef = (element: HTMLInputElement) => {
            ref.current[key] = element;
        };

        // 以下、フォーカスを移動させる関数
        const handleShiftEnter = (rowIndex: number, columnIndex: number) => {
            const prevRow = rowIndex - 1;
            const prevCol = prevRow < 0 ? columnIndex - 1 : columnIndex;

            if (prevRow < 0 && prevCol < 0) {
                focusLastInput();
            } else if (prevRow < 0) {
                focusInput(rows - 1, prevCol);
            } else {
                focusInput(prevRow, prevCol);
            }
        };

        const handleEnter = (rowIndex: number, columnIndex: number) => {
            const nextRow = rowIndex + 1;
            const nextCol = nextRow === rows ? columnIndex + 1 : columnIndex;
            if (nextRow === rows && nextCol === columns) {
                focusFirstInput();
            } else if (nextRow === rows) {
                focusInput(0, nextCol);
            } else {
                focusInput(nextRow, nextCol);
            }
        };

        const handleArrow = (key: string, rowIndex: number, columnIndex: number) => {
            const move = (r: number, c: number) => {
                // return focusInput(r < 0 ? rows - 1 : r % rows, c < 0 ? columns - 1 : c % columns);
                return focusInput( r , c );
            };

            switch (key) {
                case 'ArrowLeft':
                    move(rowIndex, columnIndex - 1);
                    break;
                case 'ArrowRight':
                    move(rowIndex, columnIndex + 1);
                    break;
                case 'ArrowUp':
                    move(rowIndex - 1, columnIndex);
                    break;
                case 'ArrowDown':
                    move(rowIndex + 1, columnIndex);
                    break;
                default:
                    break;
            }
        };

        const focusFirstInput = () => {
            focusInput(0, 0);
        };

        const focusLastInput = () => {
            const lastRowIndex = rows - 1;
            const lastColumnIndex = columns - 1;
            focusInput(lastRowIndex, lastColumnIndex);
        };

        const focusInput = (rowIndex: number, columnIndex: number) => {
            const key = `${rowIndex}-${columnIndex}`;
            const input = ref.current[key];
            if (input){
                input.focus();
                if(onChange2){
                    onChange2(input);
                }
                onChange(input);


                return true;
            }
            return false;
        };

        return {
            onKeyDown: handleKeyDown,
            ref: setRef,
        };
    },test:(a:(dom:HTMLElement)=>void)=>{
        onChange2=a;
    }};
};