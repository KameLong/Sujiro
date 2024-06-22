import {Train} from "./DiaData";
import {atom, RecoilState} from "recoil";


export interface PassengerBetweenStationAtom{
    passenger:number[][];
    startTime:number;
    endTime:number;
}
export const PassengerBetweenStationAtom:RecoilState<PassengerBetweenStationAtom[]>=atom({
    key:'PassengerBetweenStation',
    default:[
        {
            startTime: 3600 * 12,
            endTime: 3600 * 13,
            passenger: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        }
    ]
})
