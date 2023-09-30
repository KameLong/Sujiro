import React, {useEffect, useState} from "react";

import {DiaData} from "../../DiaData/DiaData";
import {Station} from "../../DiaData/Station";
import {useDispatch, useSelector} from "react-redux";

import {
    IonContent, IonFab, IonFabButton, IonFabList,
    IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent,
    IonList,
    IonRouterOutlet, IonSearchbar, useIonModal,
} from '@ionic/react';
import {StationSimpleView, StationView} from "./StationView";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {diaDataState} from "../../store";
import {add, chevronUpCircle, colorPalette, globe} from "ionicons/icons";
import {AppTitleState} from "../../App";
import {EditStationPage} from "./EditStationPage";
import {OverlayEventDetail} from "@ionic/core/components";
import {useKey} from "react-use";
import {useKeyAlt} from "../../hooks/KeyHooks";


export const StationListPage: React.FC = ():JSX.Element => {

    try {

        const diaData: DiaData = useRecoilValue(diaDataState);
        const stationList=Object.values(diaData.stations);
        const setTitle=useSetRecoilState(AppTitleState);

        const [editModalTitle, setEditModalTitle] = useState('新規駅作成');
        const [editModalStationID, setEditModalStationID] = useState(-1);

        const [present, dismiss] = useIonModal(EditStationPage, {
            title:editModalTitle,
            stationID:editModalStationID,
            onDismiss: (data: string, role: string) => dismiss(data, role),
        });

        useKeyAlt("Insert",()=>{
            openNewStation();
        });


        setTimeout(()=>{setTitle((old)=>"StationList");
        },0)

        function openNewStation() {
            setEditModalTitle(()=>"新規駅作成");
            setEditModalStationID(()=>-1);
            present();
        }

        const addNewStation=()=>{
            console.log("addNewStation");
            openNewStation();

        }
        return (
            <div>
                <StationListView  stationList={stationList}/>

                <IonFab style={{margin:"10px"}} slot="fixed" vertical="bottom" horizontal="end">
                    <IonFabButton onClick={addNewStation}>
                        <IonIcon icon={add} ></IonIcon>
                    </IonFabButton>
                    {/*<IonFabList side="top">*/}
                    {/*    <IonFabButton>*/}
                    {/*        <IonIcon icon={document}></IonIcon>*/}
                    {/*    </IonFabButton>*/}
                    {/*    <IonFabButton>*/}
                    {/*        <IonIcon icon={colorPalette}></IonIcon>*/}
                    {/*    </IonFabButton>*/}
                    {/*    <IonFabButton>*/}
                    {/*        <IonIcon icon={globe}></IonIcon>*/}
                    {/*    </IonFabButton>*/}
                    {/*</IonFabList>*/}
                </IonFab>
            </div>
        );
    }catch(e:any){
        console.log(e);
        return (
            <div>
                <div>エラーが発生しました</div>
                <div>{e.toString()}</div>
            </div>
        );
    }
}


interface StationListViewProps{
    stationList:Station[]
}
export const StationListView: React.FC<StationListViewProps> = ({stationList}:StationListViewProps):JSX.Element => {
    try {


        const [query, setQuery] = useState<string>('');
        const [showStationList,setShowStationList]=useState<Station[]>([]);
        const [sortedStationList,setSortedStationList]=useState<Station[]>([]);
        useEffect(() => {
            console.log("query Effect")
            if(query.length==0){
                setSortedStationList((prev)=>stationList);
            }else{
                const queryedStationList=stationList.filter(station=>station.name.includes(query)||station.id.toString().includes(query)||station.address.includes(query));
                const tmp=queryedStationList.sort((a,b)=>{
                    let score=0;

                    if(a.name===query){
                        score-=100;
                    }
                    if(b.name===query){
                        score+=100;
                    }
                    if(a.name.includes(query)){
                        score-=10;
                    }
                    if(b.name.includes(query)){
                        score+=10;
                    }
                    if(a.id.toString()===query){
                        score-=20;
                    }
                    if(b.id.toString()===query){
                        score+=20;
                    }
                    return score;
                })
                setSortedStationList(()=>tmp);
            }

        }, [query,stationList.length]);
        useEffect(() => {
            setShowStationList(()=>sortedStationList.slice(0,100));
        }, [sortedStationList]);

        const generateItems = () => {
            console.log("generateItems");
            setShowStationList((prev)=>{
                return sortedStationList.slice(0,prev.length+100);
            })
        };


    return (
        <div>
            <IonSearchbar value={query} onIonChange={e =>{
                console.log(e.detail.value);
                setQuery((prev)=>e.detail.value??"");
            }}
            >
            </IonSearchbar>
            <IonList>

                {
                    showStationList.map(station=>{
                        // return <IonItem  key={station.id} style={{padding:'5px 0px',display:"flex"}}><div style={{width:'100px'}}>{station.id}</div>
                        //     <div style={{width:'230px'}}>{station.name}</div>
                        //     <div style={{width:'100px'}}>{station.address}</div></IonItem>
                        return <StationView key={station.id} station={station} onClick2={(id)=>{console.log(id)}}/>
                    })
                }
            </IonList>
            <IonInfiniteScroll
                onIonInfinite={(ev) => {
                    generateItems();
                    setTimeout(() => ev.target.complete(), 500);
                }}
            >
                <IonInfiniteScrollContent></IonInfiniteScrollContent>
            </IonInfiniteScroll>
        </div>
    );
}catch(e:any){
    console.log(e);
    return (
        <div>
            <div>エラーが発生しました</div>
            <div>{e.toString()}</div>
        </div>
    );
}
}


