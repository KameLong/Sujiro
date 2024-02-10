import {
    Backdrop,
    Button, CircularProgress,
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
import {Route, RouteStation, Station} from "../SujiroData/DiaData";
import {auth} from "../firebase";
import { GiRailway } from "react-icons/gi";
import {useRequiredParams} from "../Hooks/useRequiredParams";
import AlertView from "../Common/AlertView";
export interface RoutePageProps {
}
export default function RoutePage({}:RoutePageProps) {
    const {companyID} = useRequiredParams<{ companyID: string }>();
    const {routeID} = useRequiredParams<{ routeID: string }>();

    const [route,setRoute]=useState<EditRoute|undefined>(undefined);
    const [stations,setStations]=useState<Station[]>([]);
    const [openInsertStationDialog,setOpenInsertStationDialog]=useState(false);
    const [openChangeStationDialog,setOpenChangeStationDialog]=useState(false);
    const [openSelectStationDialog,setOpenSelectStationDialog]=useState(false);
    const [insertRouteStation,setInsertRouteStation]=useState<RouteStation|undefined>(undefined);

    const [loading,setLoading]=useState(true);
    const [isLogout,setIsLogout]=useState(false);

    const loadRouteFromServer=async()=>{
        const token=await getAuth().currentUser?.getIdToken();
        axios.get(`${process.env.REACT_APP_SERVER_URL}/api/RouteEditPage/${companyID}/${routeID}?timestamp=${new Date().getTime()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then(res => {
            setRoute(res.data);
        })
    }
    const loadStationFromServer=async()=>{
        const token=await getAuth().currentUser?.getIdToken();
        axios.get(`${process.env.REACT_APP_SERVER_URL}/api/station/${companyID}?timestamp=${new Date().getTime()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then(res => {
            console.log(res.data)
            setStations(res.data);
        })
    }
    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const loadRoute=loadRouteFromServer();
                const loadStation=loadStationFromServer();
                await Promise.all([loadRoute,loadStation]);
                setLoading(false);
            }else{
                setIsLogout(true);
            }
        });
    },[]);
    const setRouteName=(name:string)=>{
        if(route!==undefined){
            setRoute((route)=>{return {...(route as EditRoute),name:name}})
        }
    }

    if(route===undefined){
        return (
            <AlertView loading={loading} isLogout={isLogout}/>
        );
    }
    const appendStation=(routeStation:RouteStation|undefined)=>{
        setInsertRouteStation(routeStation);
        setOpenInsertStationDialog(true);

    }

    return (
        <>
            <TextField fullWidth={true} label={"路線名"}  value={route.name} onChange={e=>setRouteName(e.target.value)}/>
            <List style={{maxHeight: '100%', overflow: 'auto'}}>
                <Divider  component="li" />
                {route.routeStations.map((routeStation) => {
                    return (<><ListItem onClick={()=>{
                        setInsertRouteStation(routeStation);
                        setOpenSelectStationDialog(true);
                    }}><Home /><span>{stations.find(station=>station.stationID===routeStation.stationID)?.name}</span>
                    </ListItem><Divider  component="li" />
                    </>)
                })}
                <Button onClick={()=>appendStation(undefined)}>新規追加</Button>

            </List>

            <Dialog open={openInsertStationDialog}　onClose={()=>{setOpenInsertStationDialog(false)}}>
                <DialogTitle>追加する駅を選択</DialogTitle>
                <StationSelector stations={stations} onSelectStation={async (station:Station)=>{
                    console.log(station);
                    setOpenInsertStationDialog(false);
                    const token = await getAuth().currentUser?.getIdToken();

                    axios.put(`${process.env.REACT_APP_SERVER_URL}/api/RouteEditPage/insert/${companyID}/${routeID}`,{stationID:station.stationID,routeStationID:insertRouteStation?.routeStationID} ,
                        {                headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        .then(res=>{
                            loadRouteFromServer();
                        }
                        )
                }}/>
            </Dialog>
            <Dialog open={openChangeStationDialog}　onClose={()=>{setOpenChangeStationDialog(false)}}>
                <DialogTitle>変更する駅を選択</DialogTitle>
                <StationSelector stations={stations} onSelectStation={async (station:Station)=>{
                    console.log(station);
                    setOpenChangeStationDialog(false);
                    const token = await getAuth().currentUser?.getIdToken();
                    if(insertRouteStation===undefined) {
                        console.error("おかしい");
                        return;
                    }
                    const routeStation={...insertRouteStation,stationID:station.stationID};
                    await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/RouteStation/${companyID}`, routeStation,
                        {                headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                                loadRouteFromServer();
                }}/>
            </Dialog>
            <Dialog open={openSelectStationDialog} onClose={()=>{setOpenSelectStationDialog(false);}}>
                <List>
                    <ListItem>
                        <Button onClick={()=>{
                            console.log(insertRouteStation);
                            appendStation(insertRouteStation);

                            setOpenSelectStationDialog(false);
                        }}>駅を挿入する</Button>
                    </ListItem>
                    <ListItem>
                        <Button onClick={()=>{
                            setOpenChangeStationDialog(true);

                            setOpenSelectStationDialog(false);
                        }}>駅を変更する</Button>
                    </ListItem>
                    <ListItem>
                        <Button onClick={async ()=>{
                            setLoading(true);
                            await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/RouteStation/${companyID}/${insertRouteStation?.routeStationID}`,{headers: {Authorization: `Bearer ${await getAuth().currentUser?.getIdToken()}`}});
                            await loadRouteFromServer();
                            setOpenSelectStationDialog(false);
                            setLoading(false);
                        }}>駅を削除する</Button>
                    </ListItem>
                </List>

            </Dialog>
            <AlertView loading={loading} isLogout={isLogout}/>

        </>
    )
}

interface StationSelectorProps {
    stations:Station[];
    onSelectStation:(station:Station)=>void;
}
function StationSelector({stations,onSelectStation}:StationSelectorProps){
    return(
            <DialogContent>
                <List>
                    {stations.map((station)=>{
                        return (<ListItem onClick={async()=>{
                            onSelectStation(station);
                        }}>{station.name}</ListItem>)
                    })}
                </List>

            </DialogContent>
    )
}


interface RouteEditProps {
    close:()=>void;
    route:Route|undefined;
    companyID:string|undefined
}

function RouteEdit({close,route,companyID}:RouteEditProps){
    const [routeName,setRouteName]=useState(route?.name??"");

    if(route===undefined) {
        return(<div/>);
    }

    return (
        <div>
            <DialogTitle>{"路線名を編集"}</DialogTitle>

            <DialogContent>
                <TextField fullWidth={true} label={"路線名"} required={true} value={routeName} onChange={e=>setRouteName(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button  onClick={async() => {
                    if(routeName.length>0) {

                        const route2={...route};
                        route2.name=routeName;
                        const token=await getAuth().currentUser?.getIdToken();
                        await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/route/${companyID}`, route2,{headers: {Authorization: `Bearer ${token}`}});
                        close();
                    }
                }}>決定</Button>
            </DialogActions>
        </div>
    )
}


interface EditRoute extends Route{
routeStations:RouteStation[]
}