import React from 'react';
import style from './App.module.css';

import './App.module.css';
import {Route, Routes } from 'react-router-dom';

import SujirawLayout from "./Common/SujirawLayout";
import {UndoRedoContext, useUndoRedoContext} from './Hooks/UndoRedoHook';
import StationListPage from "./Route/StationList";
import TrainTypeListPage from "./Route/TrainTypeListPage";

import { RecoilRoot } from "recoil";
import TimeTablePage from "./TimeTable/TimeTablePage";
import {usePatternTrainAtomChangedEffect} from "./SujiroData/PatternTrain";
import PassengerPage from './Passengers/PassengerPage';
import { TrainPage } from './Passengers/TrainPage';

function App() {
    return (
            <RecoilRoot>
            <Routes >
                <Route path="/" element={
                    <SujirawLayout><TrainTypeListPage/></SujirawLayout>
                }/>
                <Route path="/stationList" element={
                    <SujirawLayout><StationListPage/></SujirawLayout>
                }/>
                <Route path="/TrainTypeList" element={
                    <SujirawLayout><TrainTypeListPage/></SujirawLayout>
                }/>
                <Route path="/TimeTable/:direct" element={
                    <SujirawLayout><TimeTablePage/></SujirawLayout>
                }/>
                <Route path="/Passenger" element={
                    <SujirawLayout><PassengerPage/></SujirawLayout>
                }/>
                <Route path="/TrainPage" element={
                    <SujirawLayout><TrainPage/></SujirawLayout>
                }/>


            </Routes>
            </RecoilRoot>

    );

}

export default App;
