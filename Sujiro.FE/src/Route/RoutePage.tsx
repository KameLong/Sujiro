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
import {Add} from "@mui/icons-material";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import axios from "axios";
import {Route, RouteStation} from "../SujiroData/DiaData";
import {auth} from "../firebase";
import { GiRailway } from "react-icons/gi";
import {useRequiredParams} from "../Hooks/useRequiredParams";
export interface RoutePageProps {
}
export default function RoutePage({}:RoutePageProps) {
    const {companyID} = useRequiredParams<{ companyID: string }>();
    const {routeID} = useRequiredParams<{ routeID: string }>();

    const [route,setRoute]=useState<EditRoute|undefined>(undefined);


    // const [openEditRouteDialog,setOpenEditRouteDialog]=useState(false);
    // const [openActionRouteDialog,setOpenActionRouteDialog]=useState(false);
    const loadRouteFromServer=async()=>{
        const token=await getAuth().currentUser?.getIdToken();
        axios.get(`${process.env.REACT_APP_SERVER_URL}/api/route/${companyID}?timestamp=${new Date().getTime()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then(res => {
//            setRoute(res.data);
        })
    }
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                loadRouteFromServer();
            }else{
                console.error("ログインされていない");
            }
        });
    },[]);
    const setRouteName=(name:string)=>{
        if(route!==undefined){
            setRoute((route)=>{return {...(route as EditRoute),name:name}})
        }
    }

    if(route===undefined){
        return <>route is undefined</>
    }

    return (
        <>
            <TextField fullWidth={true} label={"路線名"}  value={route?.name??""} onChange={e=>setRouteName(e.target.value)}/>
            <List style={{maxHeight: '100%', overflow: 'auto'}}>
                <Divider  component="li" />
                {route.routeStations.map((routeStation) => {
                    return (<><ListItem onClick={()=>{
                    }}><GiRailway /><span>{routeStation.stationID}</span>
                    </ListItem><Divider  component="li" /></>)
                })}
            </List>

            {/*<Dialog open={openActionRouteDialog}　onClose={()=>{setOpenActionRouteDialog(false)}}>*/}
            {/*    <DialogTitle>{route?.name??""}</DialogTitle>*/}
            {/*    <DialogContent>*/}
            {/*        <List>*/}
            {/*            <ListItem>*/}
            {/*                <Button  onClick={()=>{*/}
            {/*                    setOpenActionRouteDialog(false);*/}
            {/*                    setOpenEditRouteDialog(true);*/}
            {/*                }}>編集する</Button>*/}
            {/*            </ListItem>*/}
            {/*            <ListItem>*/}
            {/*                <Button  onClick={async()=>{*/}
            {/*                    const token=await getAuth().currentUser?.getIdToken();*/}
            {/*                    const deleteAction=await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/route/${companyID}/${route?.routeID}`,*/}
            {/*                        {*/}
            {/*                            headers: {*/}
            {/*                                Authorization: `Bearer ${token}`*/}
            {/*                            }*/}
            {/*                        }*/}
            {/*                    );*/}
            {/*                    switch (deleteAction.status) {*/}
            {/*                        case 200:*/}
            {/*                            console.log("削除成功");*/}
            {/*                            break;*/}
            {/*                        case 404:*/}
            {/*                            console.log("削除失敗");*/}
            {/*                            break;*/}
            {/*                        default:*/}
            {/*                            console.log("削除失敗");*/}
            {/*                            break;*/}
            {/*                    }*/}
            {/*                    await loadRouteFromServer();*/}
            {/*                    setOpenActionRouteDialog(false);*/}
            {/*                }}>削除する</Button>*/}
            {/*            </ListItem>*/}
            {/*        </List>*/}

            {/*    </DialogContent>*/}
            {/*</Dialog>*/}
            {/*<Dialog open={openEditRouteDialog} onClose={()=>{setOpenEditRouteDialog(false);}}>*/}
            {/*    <RouteEdit close={async()=>{*/}
            {/*        setOpenEditRouteDialog(false);*/}
            {/*        await loadRouteFromServer();*/}


            {/*    }} route={route} companyID={companyID}/>*/}

            {/*</Dialog>*/}

        </>
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