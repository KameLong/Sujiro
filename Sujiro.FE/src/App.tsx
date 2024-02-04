import React from 'react';
import style from './App.module.css';

import './App.module.css';
import TimeTablePage from "./TimeTable/TimeTablePage";
import DiagramPage from "./Diagram/DiagramPage";
import {Route, Router, Routes } from 'react-router-dom';
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



function App() {
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

    const drawer = (
        <div>
            <Toolbar >
                <Typography variant="h6" noWrap component="div">
                    MENU
                </Typography>

            </Toolbar>
            <Divider />
            <TreeView defaultExpanded={['100','110']}
                      aria-label="file system navigator"
                      className={style.nav}
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpandIcon={<ChevronRightIcon />}
            >
                <TreeItem nodeId="100" label="サンプル路線" >
                    <TreeItem nodeId="110" label="サンプル路線" >
                        <TreeItem nodeId="111" label="下り時刻表" onClick={e=>{
                            window.location.href="/TimeTable/0"
                        }}/>
                        <TreeItem nodeId="112" label="上り時刻表" onClick={e=>{
                            window.location.href="/TimeTable/1"
                        }}/>
                        <TreeItem nodeId="113" label="ダイヤグラム"
                                  onClick={e=>{
                                      window.location.href="/Diagram"
                                  }}

                        />
                    </TreeItem>

                </TreeItem>
                <TreeItem style={{marginTop:'10px'}} nodeId={"200"} label={"LICENSE"}
                          onClick={e=>{
                              window.location.href="/License"
                          }}
                />
            </TreeView>

        </div>
    );

    // Remove this const when copying and pasting into your project.
    const container = window !== undefined ? () => window.document.body : undefined;


  return (
      <Box className={style.app}>
          <CssBaseline />
          <AppBar
              position="fixed"
              sx={{
                  width: { sm: `calc(100% - ${drawerWidth}px)` },
                  ml: { sm: `${drawerWidth}px` },
              }}
          >
              <Toolbar variant="dense" >
                  <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      edge="start"
                      onClick={handleDrawerToggle}
                      sx={{ mr: 2, display: { sm: 'none' } }}
                  >
                      <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" noWrap component="div">
                      Sujiro Development
                  </Typography>
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
                  {drawer}
              </Drawer>
              <Drawer
                  variant="permanent"
                  sx={{
                      display: { xs: 'none', sm: 'block' },
                      '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                  }}
                  open
              >
                  {drawer}
              </Drawer>
          </Box>
          <Box
              component="main"
              sx={{display:'flex',flexDirection:'column', flexGrow: 1,  width: { sm: `calc(100% - ${drawerWidth}px)` } ,height:'100%'}}
          >
              <Toolbar variant="dense" />
                   <Routes >
                       <Route path="/" element={<DiagramPage/>}/>
                       <Route path="login" element={<Signin/>}/>
                       <Route path="/Diagram" element={<DiagramPage/>}></Route>
                       <Route path="/TimeTable/:direct" element={<TimeTablePage/>}></Route>
                       <Route path="/License" element={<HelpPage/>}></Route>
                       <Route path="/TimeTablePDF/:direct" element={<TimeTablePDF/>}></Route>
                       <Route path="/Company" element={<CompanyListPage/>}> </Route>
                       <Route path="/Company/:companyID" element={<CompanyPage/>}> </Route>
                   </Routes>
          </Box>
      </Box>

  );
}

export default App;
