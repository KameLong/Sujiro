/**
 * Routeを選択させるためのPageです
 */
import React, {useEffect, useRef, useState} from "react";
import {
    IonButton,
    IonButtons,
    IonCard, IonCardHeader, IonCardTitle,
    IonContent,
    IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonList,
    IonPage, IonSearchbar,
    IonTitle,
    IonToolbar,
    useIonAlert
} from "@ionic/react";
import {useSelector} from "react-redux";
import {DiaData} from "../../DiaData/DiaData";
import {Route} from "../../DiaData/Route";


interface StationSelectorModalProps{
    onDismiss: (routeID: number| null | undefined , role?: string) => void;

}
export const RouteSelector:React.FC<StationSelectorModalProps>=({onDismiss}):JSX.Element=>{
    const modal = useRef<HTMLIonModalElement>(null);
    const [presentAlert] = useIonAlert();
    const state = useSelector((state:{diaData:DiaData}) => state);
    const diaData: DiaData = state.diaData;


    const onRouteSelected=(routeID:number)=>{

        onDismiss(routeID);
        // if(onRouteSelect){
        //     onRouteSelect(routeID);
        // }

    }
    return(
        <IonPage ref={modal} >
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Route選択</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Route駅一覧</IonCardTitle>
                    </IonCardHeader>
                    <RouteListView routeList={Object.values(diaData.routes)} onRouteSelected={onRouteSelected}/>
                </IonCard>
            </IonContent>
        </IonPage>
    )
}


interface RouteListViewProps{
    routeList:Route[]
    onRouteSelected?:{(routeID:number):void};
}
export const RouteListView: React.FC<RouteListViewProps> = ({routeList,onRouteSelected}:RouteListViewProps):JSX.Element => {
    try {


        const [query, setQuery] = useState<string>('');
        const [showRouteList,setShowRouteList]=useState<Route[]>([]);
        const [sortedRouteList,setSortedRouteList]=useState<Route[]>([]);
        useEffect(() => {
            console.log("query Effect")
            if(query.length==0){
                setSortedRouteList((prev)=>routeList);
            }else{
                const queryedStationList=routeList.filter(route=>route.name.includes(query)||route.id.toString().includes(query));
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
                setSortedRouteList(()=>tmp);
            }

        }, [query,routeList.length]);
        useEffect(() => {
            setShowRouteList(()=>sortedRouteList.slice(0,100));
        }, [sortedRouteList]);

        const onRouteClicked=(routeID:number)=>{
            if(onRouteSelected){
                onRouteSelected(routeID);
            }
        }

        const generateItems = () => {
            console.log("generateItems");
            setShowRouteList((prev)=>{
                return sortedRouteList.slice(0,prev.length+100);
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
                        showRouteList.map(route=>{
                            return <RouteSimpleView key={route.id} route={route} onItemClicked={onRouteSelected}/>
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

interface RouteSimpleViewProps{
    route:Route;
    onItemClicked?: {(stationID:number):void; };
}
export const RouteSimpleView: React.FC<RouteSimpleViewProps> = ({route,onItemClicked=undefined}:RouteSimpleViewProps):JSX.Element => {
    const onClickEvent=()=>{
        if(onItemClicked){
            onItemClicked(route.id);
        }

    }
    return(
        <IonItem  onClick={onClickEvent} >
            <div>
                {
                    route.name
                }
            </div>
        </IonItem>
    )
}
