import React, {useContext} from 'react';
import style from '../App.module.css';

import Box from '@mui/material/Box/Box';
import {Alert, AppBar, Backdrop, Button, CssBaseline, Divider, IconButton, List, Toolbar} from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import UserView from "../Auth/UserView";
import Drawer from "@mui/material/Drawer";


import MenuPage from "../Menu/MenuPage";
import {statusContext, useStatusContext} from "../Hooks/UseStatusContext";
import {AxiosClientProvider} from "../Hooks/AxiosHook";
export default function SujirawLayout(props:any) {
    const drawerWidth=250;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };
    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };
    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };
    const ctx = useStatusContext() ;


    const container = window !== undefined ? () => window.document.body : undefined;
    return (
        <statusContext.Provider value={ctx}>
            <AxiosClientProvider>

            <Box className={style.app}>
                <CssBaseline/>
                <AppBar
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                    }}
                >
                    <Toolbar variant="dense">
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{mr: 2, display: {sm: 'none'}}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Sujiraw Development
                        </Typography>
                        <div style={{flexGrow: 1}}></div>
                        <UserView/>
                    </Toolbar>
                </AppBar>
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onTransitionEnd={handleDrawerTransitionEnd}
                        onClose={handleDrawerClose}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        <MenuPage/>
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        <MenuPage/>
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{display:'flex',flexDirection:'column', flexGrow: 1,  width: { sm: `calc(100% - ${drawerWidth}px)`,xs:'100% ' } ,height:'100%'}}
                >
                    <Toolbar variant="dense" />
                    {props.children}
                </Box>
                <ErrorAlert/>/
            </Box>
            </AxiosClientProvider>
        </statusContext.Provider>

    );
}

function ErrorAlert() {
    const ctx = useContext(statusContext);
    return (
        <>
        {

        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={ctx.hasError}
        >
            <List>
                {
                    ctx.forbiddenError?
                        <Alert  severity="warning">
                            権限がありません。
                        </Alert>:null
                }
                {
                    ctx.notFoundError?
                        <Alert  severity="warning">
                            ページが見つかりません。
                        </Alert>:null
                }
                {
                    ctx.networkError?
                        <Alert  severity="error">
                            ネットワークエラーが発生しました。
                        </Alert>:null

                }
                {
                    ctx.clientError!==undefined?
                        <Alert  severity="error">
                            通信エラーが発生しました（{ctx.clientError})
                        </Alert>:null

                }
                {
                    ctx.signalRConnectionError?
                        <Alert  severity="error">
                            通信エラーが発生しました（SignalR）
                        </Alert>:null

                }
                {
                    ctx.isNotLogined?
                        <Alert  severity="warning" >
                            ログインが必要なページを開こうとしています。
                            <Button onClick={(e)=>{
                                window.location.href = `/login`
                                e.preventDefault()}}>ログインページへ</Button>
                            <Button onClick={(e)=>{
                                window.location.href = `/`
                                e.preventDefault()}}>トップに戻る</Button>
                        </Alert>:null
                }
            </List>
        </Backdrop>
        }
            </>
    );
}

