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


interface StationSelectorPageProps{
    onStationSelected:(stationID:number)=>void;
}
export const StationSelectorPage: React.FC<StationSelectorPageProps> = ({onStationSelected}):JSX.Element => {
    try {
        const diaData: DiaData = useRecoilValue(diaDataState);
        const stationList=Object.values(diaData.stations);

        return (
            <IonPage>
                    <IonHeader>
                        <IonToolbar>
                        <IonTitle>駅を選択してください</IonTitle>
                        </IonToolbar>
                        </IonHeader>
                <IonContent>
                    <StationListView  stationList={stationList} onStationSelected={onStationSelected}/>
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
