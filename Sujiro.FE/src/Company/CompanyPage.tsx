import React, { useEffect, useState} from 'react';
import {
    Button, Card, CardActions, CardContent, Container,
    Dialog, DialogContent, DialogTitle,
    Grid, Paper, DialogActions, TextField, Tabs, useTheme, Tab, List, ListItem, Fab,
} from '@mui/material';
import axios from "axios";
import {Add, Settings} from "@mui/icons-material";

import {
    auth
} from '../firebase';
import Typography from "@mui/material/Typography";
import {Company, Station} from "../SujiroData/DiaData";
import {getAuth} from "firebase/auth";
import Box from "@mui/material/Box";



function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}
function CompanyPage() {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const [stations, setStations] = useState<Station[]>([]);
    const [editStation,setEditStation]=useState<Station|undefined>(undefined);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
    };


    useEffect(() => {
        auth.onAuthStateChanged(async(user) => {
            if (user) {
                const token=await user.getIdToken();
                axios.get(`${process.env.REACT_APP_SERVER_URL}/api/company/getAll?timestamp=${new Date().getTime()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                ).then(res => {
                    console.log(res.data);
                })


            }else{
                console.error("ログインされていない");
            }
        });
    }, []);
    // const [open, setOpen] = React.useState(false);
    return (
        <div>
            <Container>
                <Paper sx={{ padding: 4, marginY: 2 }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        // indicatorColor="secondary"
                        textColor="inherit"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="所属駅リスト" {...a11yProps(0)} />
                        <Tab label="所属路線リスト" {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={value} index={0} dir={theme.direction} >
                        <div style={{ position:'relative'}} >
                        <List style={{maxHeight: '100%', overflow: 'auto'}}>
                            {stations.map((station) => {
                                    return (<ListItem>{station.name}</ListItem>)
                            })}
                        </List>

                        <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', right:'30px',bottom:'30px'}}>
                            <Fab color="primary" aria-label="add" onClick={()=>{}}>
                                <Add/>
                            </Fab>
                        </Box>
                        </div>

                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                    </TabPanel>
                </Paper>
            </Container>
            <StationEdit close={()=>{}} station={editStation}/>
        </div>
    );
}

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}



interface StationEditProps {
    close:()=>void;
    station:Station|undefined;
}

function StationEdit({close,station}:StationEditProps){
    const [stationName,setStationName]=useState(station?.name??"");

    if(station===undefined) {
        return(<div/>);
    }

    return (
        <div>
            <DialogTitle>{"駅名を編集"}</DialogTitle>

                <DialogContent>
                    <TextField fullWidth={true} label={"Company名"} required={true} value={stationName} onChange={e=>setStationName(e.target.value)}/>
                </DialogContent>
                <DialogActions>
                    <Button  onClick={async() => {
                        if(stationName.length>0) {
                            const station2={...station};
                            station2.name=stationName;
                            const auth = getAuth();
                            const user = auth.currentUser;
                            const token=await user?.getIdToken()
                            await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/station`, station2,{headers: {Authorization: `Bearer ${token}`}});
                            close();
                        }
                    }}>決定</Button>
                </DialogActions>
        </div>
    )
}

export default CompanyPage;