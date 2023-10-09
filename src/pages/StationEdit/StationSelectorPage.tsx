import React, {useState} from "react";
import {DiaData} from "../../DiaData/DiaData";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {diaDataState} from "../../store";
import {AppTitleState} from "../../App";
import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonModal
} from "@ionic/react";
import {EditStationPage} from "./EditStationPage";
import {useKeyAlt} from "../../hooks/KeyHooks";
import {add} from "ionicons/icons";
import {StationListView} from "./StationList";
import {SujiroList} from "../../components/SujiroList";
import {Station} from "../../DiaData/Station";
import {StationView} from "./StationView";


interface StationSelectorPageProps{
    onStationSelected:(station:Station)=>void;
}
export const StationSelectorPage: React.FC<StationSelectorPageProps> = ({onStationSelected}):JSX.Element => {
    try {
        const diaData: DiaData = useRecoilValue(diaDataState);
        const stationList=Object.values(diaData.stations);
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
            <IonPage>
                    <IonHeader>
                        <IonToolbar>
                        <IonTitle>駅を選択してください</IonTitle>
                        </IonToolbar>
                        </IonHeader>
                <IonContent>
                    <SujiroList
                        renderRow={(station:Station,onClicked:(station:Station)=>void)=>{
                            return(<StationView  key={station.id} station={station} onClicked={onClicked}/>)}}
                        itemList={stationList}
                        sortList={sortStation}
                        onClicked={onStationSelected}
                    />
                    {/*<StationListView  stationList={stationList} onStationSelected={onStationSelected}/>*/}
                </IonContent>

            </IonPage>
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
