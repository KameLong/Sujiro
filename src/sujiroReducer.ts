import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DiaData} from "./DiaData/DiaData";

export class SujiroState{
    public title:string="TOP";
}

export const sujiroDataSlice = createSlice({
    name: 'sujiro',
    initialState: new SujiroState(),

    reducers:{
        load:(state, action: PayloadAction<SujiroState>)=>{
            return action.payload;
        }
    }
})