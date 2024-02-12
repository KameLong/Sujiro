import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Fab,
    List,
    ListItem,
    TextField
} from "@mui/material";
import {Add, Home} from "@mui/icons-material";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import axios from "axios";
import {Station} from "../SujiroData/DiaData";
import {auth} from "../firebase";

export interface StationListViewProps {
    companyID:string
}
export default function StationListView({companyID}:StationListViewProps) {
    const [stations, setStations] = useState<Station[]>([]);
    const [editStation,setEditStation]=useState<Station|undefined>(undefined);
    const [openEditStationDialog,setOpenEditStationDialog]=useState(false);
    const [openActionStationDialog,setOpenActionStation]=useState(false);
    useEffect(() => {
        auth.onAuthStateChanged(async(user) => {
            if (user) {
                const token=await user.getIdToken();
                axios.get(`${process.env.REACT_APP_SERVER_URL}/api/station/${companyID}?timestamp=${new Date().getTime()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                ).then(res => {
                    setStations(res.data);
                })


            }else{
                console.error("ログインされていない");
            }
        });
    },[]);

    return (
        <div>
            <List style={{maxHeight: '100%', overflow: 'auto'}}>
                <Divider  component="li" />
                {stations.map((station) => {
                    return (<div key={station.stationID}><ListItem onClick={()=>{
                        setEditStation(station);
                        setOpenActionStation(true);

                    }}><Home/><span>{station.name}</span>
                    </ListItem><Divider  component="li" /></div>)
                })}
            </List>

            <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', right:'30px',bottom:'30px'}}>
                <Fab color="primary" aria-label="add" onClick={()=>{
                    setEditStation({
                        stationID:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
                        name:""
                    });
                    setOpenEditStationDialog(true);
                }}>
                    <Add/>
                </Fab>
            </Box>
            <Dialog open={openActionStationDialog}　onClose={()=>{setOpenActionStation(false)}}>
                <DialogTitle>{editStation?.name??""}</DialogTitle>
                <DialogContent>
                    <List>
                        <ListItem>
                            <Button  onClick={()=>{
                                setOpenActionStation(false);
                                setOpenEditStationDialog(true);
                            }}>編集する</Button>
                        </ListItem>
                        <ListItem>
                            <Button  onClick={async()=>{
                                const token=await getAuth().currentUser?.getIdToken();
                                const deleteAction=await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/station/${companyID}/${editStation?.stationID}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`
                                        }
                                    }
                                );
                                switch (deleteAction.status) {
                                    case 200:
                                        console.log("削除成功");
                                        break;
                                    case 404:
                                        console.log("削除失敗");
                                        break;
                                    default:
                                        console.log("削除失敗");
                                        break;
                                }
                                axios.get(`${process.env.REACT_APP_SERVER_URL}/api/station/${companyID}?timestamp=${new Date().getTime()}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`
                                        }
                                    }
                                ).then(res => {
                                    setStations(res.data);
                                })
                                setOpenActionStation(false);
                            }}>削除する</Button>
                        </ListItem>
                    </List>

                </DialogContent>
            </Dialog>
            <Dialog open={openEditStationDialog} onClose={()=>{setOpenEditStationDialog(false);}}>
                <StationEdit close={async()=>{
                    setOpenEditStationDialog(false);
                    const token=await getAuth().currentUser?.getIdToken();
                    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/station/${companyID}?timestamp=${new Date().getTime()}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    ).then(res => {
                        setStations(res.data);
                    })


                }} station={editStation} companyID={companyID}/>

            </Dialog>

        </div>
    )
}

interface StationEditProps {
    close:()=>void;
    station:Station|undefined;
    companyID:string|undefined
}

function StationEdit({close,station,companyID}:StationEditProps){
    const [stationName,setStationName]=useState(station?.name??"");

    if(station===undefined) {
        return(<div/>);
    }

    return (
        <div>
            <DialogTitle>{"駅名を編集"}</DialogTitle>

            <DialogContent>
                <TextField fullWidth={true} label={"駅名"} required={true} value={stationName} onChange={e=>setStationName(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button  onClick={async() => {
                    if(stationName.length>0) {
                        const station2={...station};
                        station2.name=stationName;
                        const auth = getAuth();
                        const user = auth.currentUser;
                        const token=await user?.getIdToken()
                        await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/station/${companyID}`, station2,{headers: {Authorization: `Bearer ${token}`}});
                        close();
                    }
                }}>決定</Button>
            </DialogActions>
        </div>
    )
}
