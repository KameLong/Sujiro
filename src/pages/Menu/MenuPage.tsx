import {
    IonButton, IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader, IonMenuButton, IonMenuToggle, IonRouterLink,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import React, {useRef} from "react";
import {DiaData, EditDiaData} from "../../DiaData/DiaData";
import {diaDataState, loadSQL} from "../../store";
import {useHistory} from "react-router-dom";
import {TimeTable} from "../../DiaData/TimeTable";
import {Route} from "../../DiaData/Route";
import {useRecoilValue, useSetRecoilState} from "recoil";

export const MenuPage = () => {
    const splitPaneRef:React.MutableRefObject<HTMLIonMenuToggleElement|null> = useRef(null);
    const diaData:DiaData= useRecoilValue(diaDataState);
    const nav = useHistory().push;
    const setDiaData = useSetRecoilState(diaDataState);
    const openSQLite = async () => {
        const diaData=await loadSQL();
        setDiaData((old)=>{
            return diaData;
        })

    }
    const save=async()=> {
        const directory=await navigator.storage.getDirectory();
        let fileHandle = await directory.getFileHandle('save.json', { create: true });
        let writableStream = await fileHandle.createWritable();
        await writableStream.write(JSON.stringify(diaData));
        await writableStream.close();
    }
    const loadJson=async()=>{
        const directory=await navigator.storage.getDirectory();
        let fileHandle = await directory.getFileHandle('save.json');
        const file = await fileHandle.getFile();
        console.log(file);
        const text = await file.text();
        const diaData=EditDiaData.fromJSONobj(JSON.parse(text));
        console.log(diaData);
        setDiaData((old)=>{
            return diaData;
        })
    }
    const onClickStationList = () => {
        splitPaneRef.current?.click();
        nav(`/StationList`);
    }
    const onClickMakeTimeTable = () => {
        splitPaneRef.current?.click();
        nav(`/TimeTableEdit`);
    }

    return (
        <div style={{height: 'calc(100% - 100px)'}}>
            <IonMenuToggle ref={splitPaneRef}>
            </IonMenuToggle>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton></IonMenuButton>
                    </IonButtons>
                    <IonTitle>AOdia WEB</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonButton onClick={openSQLite} fill="clear" expand="block">OPEN_URL</IonButton>
                <IonButton onClick={save} fill="clear" expand="block">SAVE</IonButton>
                <IonButton onClick={loadJson} fill="clear" expand="block">LOAD</IonButton>
                <IonItem onClick={onClickStationList}>
                    駅編集
                </IonItem>
                <IonItem onClick={onClickMakeTimeTable}>
                    新規時刻表作成
                </IonItem>
                <IonList>
                    {
                        Object.values(diaData.timeTable).map(item => {
                            return (<TimeTableMenu2 key={item.id} diaData={diaData}
                                                    timeTable={item}/>)
                        })
                    }
                </IonList>
                <IonList>
                    {
                        Object.values(diaData.routes).map(item => {
                            return (<RouteMenu key={item.id} diaData={diaData}
                                               route={item}/>)
                        })
                    }
                </IonList>
            </IonContent>
        </div>
    );
}

interface TimeTableMenu2Props {
    diaData: DiaData,
    timeTable: TimeTable,
}
export function TimeTableMenu2(props:TimeTableMenu2Props){
    const nav=useHistory();
    const onClickDownLineTimeTable=()=> {
        nav.push(`/LineTimeTable?timetable=${props.timeTable.id}&direct=0`);
    }
    const onClickUpLineTimeTable=()=> {
        nav.push(`/LineTimeTable?timetable=${props.timeTable.id}&direct=1`);
    }

    return (
        <IonList key={props.timeTable.id}>
            <IonListHeader>
                <IonLabel>
                    {props.timeTable.name}
                </IonLabel>
            </IonListHeader>

            <IonItem onClick={onClickDownLineTimeTable}>
                下り時刻表
            </IonItem>
            <IonItem onClick={onClickUpLineTimeTable}>
                上り時刻表
            </IonItem>
            <IonItem>
                ダイヤグラム
            </IonItem>
        </IonList>

    )
}
interface RouteMenuProps {
    diaData: DiaData,
    route: Route,
}
export const RouteMenu=(props:RouteMenuProps)=>{
    useHistory().action="PUSH";
    useHistory().action
    const nav=useHistory().push;
    const onClickDownLineTimeTable=()=> {
        nav(`/RouteTimeTable?route=${props.route.id}&direct=0`);
    }
    const onClickUpLineTimeTable=()=> {
        nav(`/RouteTimeTable?route=${props.route.id}&direct=1`);
    }

    return (
        <IonList key={props.route.id}>
            <IonListHeader>
                <IonLabel>
                    {props.route.name}
                </IonLabel>
            </IonListHeader>

            <IonItem onClick={onClickDownLineTimeTable}>
                下り時刻表
            </IonItem>
            <IonItem onClick={onClickUpLineTimeTable}>
                上り時刻表
            </IonItem>
            <IonItem>
                ダイヤグラム
            </IonItem>
        </IonList>

    )
}

