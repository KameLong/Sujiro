import React from 'react';
import style from './App.module.css';

import './App.module.css';
import TimeTablePage from "./TimeTable/TimeTablePage";
import {Route, Routes } from 'react-router-dom';
import HelpPage from "./Help/HelpPage";

import {TimeTablePDF} from "./TimeTable/TimeTablePDF/TimeTablePDF";
import CompanyListPage from "./Company/CompanyListPage";
import CompanyPage from "./Company/CompanyPage";
import RoutePage from "./Route/RoutePage";
import SujirawLayout from "./Common/SujirawLayout";
import DiagramPage from "./Diagram/DiagramPage";
import SignIn from "./Auth/Signin";
import TrainTypeListPage from "./TrainType/TrainTypePage";
import TimeEdit from "./TimeTable/TimeEdit";
import {TrainEditTest} from "./TimeTable/TrainEdit";



function App() {
    return (
        <Routes >
            <Route path="/" element={
                <SujirawLayout><TrainEditTest/></SujirawLayout>
                // <SujirawLayout><CompanyListPage/></SujirawLayout>
            }/>
            <Route path="/Diagram/:companyID/:routeID" element={
                <SujirawLayout><DiagramPage/></SujirawLayout>
                }></Route>
            <Route path="/TimeTable/:companyID/:routeID/:direct" element={
                <SujirawLayout><TimeTablePage/></SujirawLayout>
            }></Route>
            <Route path="/TimeTablePDF/:companyID/:routeID/:direct" element={
                <SujirawLayout><TimeTablePDF/></SujirawLayout>
            }></Route>
            <Route path="/Company" element={
                <SujirawLayout><CompanyListPage/></SujirawLayout>
            }> </Route>
            <Route path="/Company/:companyID" element={
                <SujirawLayout><CompanyPage/></SujirawLayout>
            }> </Route>
            <Route path="/TrainType/:companyID" element={
                <SujirawLayout><TrainTypeListPage/></SujirawLayout>
            }> </Route>
            <Route path="/Route/:companyID/:routeID" element={
                <SujirawLayout><RoutePage/></SujirawLayout>
            }> </Route>
            <Route path="/License" element={
                <SujirawLayout><HelpPage/></SujirawLayout>
            }></Route>
            <Route path="/Login" element={
                <SignIn/>
            }></Route>


        </Routes>
    );

}

export default App;
