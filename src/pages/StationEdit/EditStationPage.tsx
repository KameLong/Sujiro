import React, {useState} from "react";
import {
    IonButton,
    IonButtons,
    IonContent, IonGrid,
    IonHeader,
    IonInput,
    IonItem, IonList,
    IonPage, IonRow,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {useRecoilState, useRecoilValue} from "recoil";
import {stationSelector} from "../../store";
import {StationEdit} from "../../DiaData/Station";
import {useKey} from "react-use";
import {useKeyAlt} from "../../hooks/KeyHooks";

interface EditStationPageProps{
    onDismiss: (data?: string | null | undefined | number, role?: string) => void;
    title:string,
    stationID:number
}

export const EditStationPage: React.FC<EditStationPageProps> = ({onDismiss,title,stationID}):JSX.Element => {
    const [station,setStation]=useState(useRecoilValue(stationSelector(stationID))??StationEdit.newStation());
    const [_,commitStationSelector]=useRecoilState(stationSelector(station.id));

    const commitStation=()=>{
        commitStationSelector(station);

    }
    useKeyAlt("Enter",(e) =>{
            commitStation();
            onDismiss();
    });

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => onDismiss()} color="medium" >
                            Cancel
                        </IonButton>
                    </IonButtons>
                    <IonTitle>{title}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => {
                            commitStation();
                            onDismiss();
                        }}
                                   strong={true}>
                            決定
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                <IonItem>
                    <IonInput  labelPlacement="stacked" label="駅名" placeholder="新規駅名" value={station.name}
                               onInput={(e)=>setStation(old=>{
                                   return{...old,name:(e.target as HTMLInputElement).value as string}})}
                    />
                </IonItem>
                    <IonItem>
                        <IonInput  labelPlacement="stacked" label="(OPTION)詳細説明" placeholder="" value={station.address}
                                   onInput={(e)=>setStation(old=>{
                                       return{...old,address:(e.target as HTMLInputElement).value as string}})}
                        />
                    </IonItem>

                    <IonItem>
                        <IonInput type={"number"} labelPlacement="stacked" label="緯度" placeholder="35.00" value={station.lat}
                                  onInput={(e)=>setStation(old=>{
                                      return{...old,lat:Number.parseFloat((e.target as HTMLInputElement).value)}})}
                        />
                    </IonItem>
                    <IonItem>
                        <IonInput type={"number"} labelPlacement="stacked" label="経度" placeholder="135.00" value={station.lon}
                                  onInput={(e)=>setStation(old=>{
                                      return{...old,lon:Number.parseFloat((e.target as HTMLInputElement).value)}})}
                        />
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    )
}
