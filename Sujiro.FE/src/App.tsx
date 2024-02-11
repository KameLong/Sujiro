import React from 'react';
import style from './App.module.css';

import './App.module.css';
import TimeTablePage from "./TimeTable/TimeTablePage";
import DiagramPage from "./Diagram/DiagramPage";
import {Route, Routes } from 'react-router-dom';
import {TreeItem, TreeView} from "@mui/x-tree-view";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HelpPage from "./Help/HelpPage";


import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {TimeTablePDF} from "./TimeTable/TimeTablePDF/TimeTablePDF";
import Signin from './Auth/Signin';
import CompanyListPage from "./Company/CompanyListPage";
import CompanyPage from "./Company/CompanyPage";
import RoutePage from "./Route/RoutePage";
import UserView from "./Auth/UserView";
import MenuPage from "./Menu/MenuPage";
import SujirawLayout from "./Common/SujirawLayout";



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
