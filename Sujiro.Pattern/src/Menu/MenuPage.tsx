import {
    Button,
    Divider,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Route, Station} from "../SujiroData/DiaData";
import {auth} from "../firebase";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {TreeItem, TreeView} from "@mui/x-tree-view";
import style from "../App.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {useNavigate, useParams} from "react-router-dom";
import {axiosClient} from "../Hooks/AxiosHook";
import {useLoadData, useSaveData} from "../State";
export interface MenuPageProps {
}
export default function MenuPage({}:MenuPageProps) {
    const {companyID} = useParams<{ companyID: string }>();
    const {routeID} = useParams<{ routeID: string }>();
    const [routes,setRoutes] = useState<Route[]>([]);
    console.log(companyID,routeID);
    const navigate = useNavigate();
    const saveData=useSaveData();
    const loadData=useLoadData();

    const loadMenuDataFromServer=async()=>{
        if(companyID===undefined){
            return;
        }
        axiosClient.get(`/api/MenuPage/company/${companyID}?timestamp=${new Date().getTime()}`
        ).then(res => {
            console.log(res.data);
            if(res.data.routes){
                setRoutes(res.data.routes);
            }
        }).catch(err=>{});
    }

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            await loadMenuDataFromServer();
        });
    },[]);


    return (
        <div >
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    {"RouteName"}
                </Typography>
            </Toolbar>
            <Divider/>
            <TreeView defaultExpanded={[routeID?.toString()??""]}
                      aria-label="file system navigator"
                      className={style.nav}
                      defaultCollapseIcon={<ExpandMoreIcon/>}
                      defaultExpandIcon={<ChevronRightIcon/>}
            >
                <TreeItem nodeId={"100"} label={"駅一覧"} onClick={e => {
                    navigate(`/StationList`);
                }}/>
                <TreeItem nodeId={"101"} label={"種別"} onClick={e => {
                    navigate(`/TrainTypeList`);
                }
                }/>
                <TreeItem nodeId={"1"} label="下り時刻表" onClick={e => {
                    navigate(`/TimeTable/0`);
                }}/>
                <TreeItem nodeId={"2"} label="上り時刻表" onClick={e => {
                    navigate(`/TimeTable/1`);
                }}/>
                <TreeItem nodeId={"3"} label="ダイヤグラム"
                          onClick={e => {
                              navigate(`/Diagram`);
                          }}
                />
                <TreeItem nodeId={"4"} label="乗降客数"
                          onClick={e => {
                              navigate(`/Passenger`);
                          }}
                />
                <TreeItem nodeId={"5"} label="列車乗降"
                          onClick={e => {
                              navigate(`/TrainPage`);
                          }}
                />

                <TreeItem style={{marginTop: '10px'}} nodeId={"200"} label={"LICENSE"}
                          onClick={e => {
                              window.location.href = "/License"
                          }}
                />
            </TreeView>

            <Button onClick={saveData}>
                SAVE
            </Button>
            <Button onClick={loadData}>
                LOAD
            </Button>

        </div>
    )
}




