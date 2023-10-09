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
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {diaDataState, stationsSelector} from "../../store";
import {add, chevronUpCircle, colorPalette, globe} from "ionicons/icons";
import {AppTitleState} from "../../App";
import {EditStationPage} from "./EditStationPage";
import {useKeyAlt} from "../../hooks/KeyHooks";
import {SujiroList} from "../../components/SujiroList";
import {Action, useUndo} from "../../hooks/UndoRedo";
import {useKey} from "react-use";


export const StationListPage: React.FC = ():JSX.Element => {
    try {
        const diaData: DiaData = useRecoilValue(diaDataState);
        const stationList=Object.values(diaData.stations);
        const setTitle=useSetRecoilState(AppTitleState);

        const [editModalTitle, setEditModalTitle] = useState('新規駅作成');
        const [editModalStationID, setEditModalStationID] = useState(-1);
        const [run]=useUndo();
        const [a,setA]=useRecoilState(stationsSelector);

        const [present, dismiss] = useIonModal(EditStationPage, {
            title:editModalTitle,
            stationID:editModalStationID,
            onDismiss: (data: string, role: string) => dismiss(data, role),
        });

        useKeyAlt("Insert",()=>{
            openNewStation();
        });
        useKeyAlt("Delete",()=>{
            console.log("Delete");
            const deleteList=selected();

            const deleteAction:Action={
                action:()=>{
                    setA(old=>{
                        const next={...old};
                        deleteList.forEach(station=>{
                            delete next[station.id];
                        })
                        return next;
                    })
                },
                undo:()=>{
                    setA(old=>{
                        const next={...old};
                        deleteList.forEach(station=>{
                            next[station.id]=station;
                        })
                        return next;
                    })
                }
            }
            run(deleteAction);

        })


        setTimeout(()=>{setTitle((old)=>"StationList");
        },0)

        const openNewStation=()=>{
            setEditModalTitle(()=>"新規駅作成");
            setEditModalStationID(()=>-1);
            present();
        }

        const openEditStation=(stationID:number)=>{
            setEditModalTitle(()=>"駅編集");
            setEditModalStationID(()=>stationID);
            present();
        }


        const addNewStation=()=>{
            openNewStation();

        }
        let selected:()=>Station[];
        const getSelected= (a:()=>Station[])=>{
            selected=a;
        }

        const sortStation=(stationList:Station[],query:string)=>{
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
            return tmp;



        }

        return (
            <div  style={{height:'100vh'}}
            >
                <SujiroList renderRow={(station:Station,onClicked:(station:Station)=>void)=>{
                    return(<StationView  key={station.id} station={station} onClicked={onClicked}/>)}}
                            itemList={stationList}
                            sortList={sortStation}
                            onClicked={(station=>{
                                openEditStation(station.id);
                            })}
                            getSelected={getSelected}
                />




                <IonFab style={{margin:"10px"}} slot="fixed" vertical="bottom" horizontal="end">
                    <IonFabButton onClick={addNewStation}>
                        <IonIcon icon={add} ></IonIcon>
                    </IonFabButton>
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
    stationList:Station[],
    onStationSelected?:((stationID:number)=>void)
}
 export const StationListView: React.FC<StationListViewProps> = ({stationList,onStationSelected}:StationListViewProps):JSX.Element => {
    return (
        <SujiroList renderRow={(station:Station,onClicked:(station:Station)=>void)=>{
            return(<StationView  key={station.id} station={station} onClicked={onClicked}/>)}}
                    itemList={stationList}
                    sortList={(stationList,query)=>{
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
                        return tmp;



                    }}
                    onClicked={(station=>{
                        if(onStationSelected){
                            onStationSelected(station.id)
                        }
                    })}/>
    )
 }

