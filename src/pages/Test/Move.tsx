import * as React from "react";

import {useCallback, useState} from "react";

const Move: React.FC = () => {
    const [position, setPosition] = React.useState({ x: 10, y: 10 });
    const drag = useMoveOnDrag<HTMLDivElement>(position, setPosition);
    return (
        <div className="move">
            <div
                className="moveme"
                style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                onPointerDown={drag.onPointerDown}
                onPointerMove={drag.onPointerMove}
                onPointerUp={drag.onPointerUp}
            >
                Move me!
            </div>
        </div>
    );
};

export default Move;
interface Position {
    x: number;
    y: number;
}

interface DragState {
    originalPosition: Position;
    startCursor: Position;
}

interface useDragReturn<T extends Element> {
    onPointerDown: (event: React.PointerEvent<T>) => void;
    onPointerMove: (event: React.PointerEvent<T>) => void;
    onPointerUp: (event: React.PointerEvent<T>) => void;
    dragging: boolean;
}

export const useMoveOnDrag = <T extends Element>(
    argPosition: Position,
    onMove: (pos: Position) => void
): useDragReturn<T> => {
    const [state, setState] = useState<DragState | null>(null);
    const startDrag = useCallback(
        (event: React.PointerEvent<T>) => {
            console.log("onDown");

            event.currentTarget.setPointerCapture(event.pointerId);
            setState({
                originalPosition: {
                    x: argPosition.x,
                    y: argPosition.y
                },
                startCursor: {
                    x: event.pageX,
                    y: event.pageY
                }
            });
        },
        [argPosition.x, argPosition.y]
    );
    const dragging = useCallback(
        (event: React.PointerEvent<T>) => {
            event.preventDefault();
            if (state === null) return;
            const currentCursor = {
                x: event.pageX,
                y: event.pageY
            };
            onMove({
                x: (state.originalPosition.x + currentCursor.x - state.startCursor.x),
                y: (state.originalPosition.y + currentCursor.y - state.startCursor.y)
            });
        },
        [state, onMove]
    );
    const endDrag = useCallback(
        (event: React.PointerEvent<T>) => {
            event.currentTarget.releasePointerCapture(event.pointerId);
            setState(null);
            if (state === null) return;
            const currentCursor = {
                x: event.pageX,
                y: event.pageY
            };
            onMove({
                x: (state.originalPosition.x + currentCursor.x - state.startCursor.x),
                y: (state.originalPosition.y + currentCursor.y - state.startCursor.y)
            });
        },
        [state, onMove]
    );
    return {
        onPointerDown: startDrag,
        onPointerMove: dragging,
        onPointerUp: endDrag,
        dragging: state !== null
    };
};
