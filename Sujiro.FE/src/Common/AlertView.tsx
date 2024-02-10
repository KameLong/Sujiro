import {Alert, Backdrop, CircularProgress} from "@mui/material";
import {Warning} from "@mui/icons-material";
import React from "react";

interface AlertViewProps {
    loading:boolean;
    isLogout:boolean;

}
 export default function AlertView({loading,isLogout}:AlertViewProps){
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading||isLogout}
        >
            {loading? <CircularProgress color="inherit" />:null}
            {isLogout?  <Alert severity="error">ログインしてください。</Alert>:null}

        </Backdrop>
            );

}