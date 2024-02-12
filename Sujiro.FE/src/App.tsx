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



function App() {
    return (
        <Routes >
            <Route path="/" element={
                <SujirawLayout><CompanyListPage/></SujirawLayout>
            }/>
            <Route path="/Diagram/:companyID/:routeID" element={
                <SujirawLayout><DiagramPage/></SujirawLayout>
                }></Route>
            <Route path="/TimeTable/:companyID/:routeID/:direct" element={
                <SujirawLayout><TimeTablePage/></SujirawLayout>
            }></Route>
            <Route path="/License" element={
                <SujirawLayout><HelpPage/></SujirawLayout>
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
            <Route path="/Route/:companyID/:routeID" element={
                <SujirawLayout><RoutePage/></SujirawLayout>
            }> </Route>
        </Routes>
    );

}

export default App;
