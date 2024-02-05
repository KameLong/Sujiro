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
import {Route} from "../SujiroData/DiaData";
import {auth} from "../firebase";
import { GiRailway } from "react-icons/gi";
export interface RouteListViewProps {
    companyID:string
}
export default function RouteListView({companyID}:RouteListViewProps) {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [editRoute,setEditRoute]=useState<Route|undefined>(undefined);
    const [openEditRouteDialog,setOpenEditRouteDialog]=useState(false);
    const [openActionRouteDialog,setOpenActionRouteDialog]=useState(false);
    const loadRouteFromServer=async()=>{
        const token=await getAuth().currentUser?.getIdToken();
        axios.get(`${process.env.REACT_APP_SERVER_URL}/api/route/${companyID}?timestamp=${new Date().getTime()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then(res => {
            setRoutes(res.data);
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

    return (
        <>
            <List style={{maxHeight: '100%', overflow: 'auto'}}>
                <Divider  component="li" />
                {routes.map((route) => {
                    return (<><ListItem onClick={()=>{
                        setEditRoute(route);
                        setOpenActionRouteDialog(true);

                    }}><GiRailway /><span>{route.name}</span>
                    </ListItem><Divider  component="li" /></>)
                })}
            </List>

            <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', right:'30px',bottom:'30px'}}>
                <Fab color="primary" aria-label="add" onClick={()=>{
                    setEditRoute({
                        routeID:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
                        name:"",
                        color:"#000000"
                    });
                    setOpenEditRouteDialog(true);
                }}>
                    <Add/>
                </Fab>
            </Box>
            <Dialog open={openActionRouteDialog}　onClose={()=>{setOpenActionRouteDialog(false)}}>
                <DialogTitle>{editRoute?.name??""}</DialogTitle>
                <DialogContent>
                    <List>
                        <ListItem>
                            <Button  onClick={()=>{
                                setOpenActionRouteDialog(false);
                                setOpenEditRouteDialog(true);
                            }}>編集する</Button>
                        </ListItem>
                        <ListItem>
                            <Button  onClick={async()=>{
                                const token=await getAuth().currentUser?.getIdToken();
                                const deleteAction=await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/route/${companyID}/${editRoute?.routeID}`,
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
                                await loadRouteFromServer();
                                setOpenActionRouteDialog(false);
                            }}>削除する</Button>
                        </ListItem>
                    </List>

                </DialogContent>
            </Dialog>
            <Dialog open={openEditRouteDialog} onClose={()=>{setOpenEditRouteDialog(false);}}>
                <RouteEdit close={async()=>{
                    setOpenEditRouteDialog(false);
                    await loadRouteFromServer();


                }} route={editRoute} companyID={companyID}/>

            </Dialog>

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
