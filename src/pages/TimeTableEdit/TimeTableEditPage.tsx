import React from "react";
import {useLocation} from "react-router";
import {useFocusControl} from "../Test/useFocusController";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {timetableRoutesSelector, timetableSelector} from "../../store";
import classes from "../TimeTable/TimeTablePage.module.scss";
import {StationTimeEditView} from "../TimeTable/StationTimeEditView";
import {AppTitleState} from "../../App";
import {IonIcon, IonLabel, IonRouterOutlet, IonSegmentButton, IonSegment, IonTabBar, IonTabButton, IonTabs} from "@ionic/react";
import {Redirect, Route} from "react-router-dom";
import {library, playCircle, radio, search} from "ionicons/icons";
import {IonReactRouter} from "@ionic/react-router";

export const TimetableEditPage: React.FC= () => {
    try {
        const searchParams = new URLSearchParams(useLocation().search);
        const timeTableID = Number(searchParams.get("timetable"));
        const setTitle=useSetRecoilState(AppTitleState);

        setTimeout(()=>{setTitle((old)=>"時刻表 設定編集");
        },0)




        const timeTable=useRecoilValue(timetableSelector(timeTableID));
        return (
            <IonSegment value="station" style={{boxSizing: 'border-box',padding:'0px 50px'}}>
                <IonSegmentButton value="station">
                    <IonLabel>駅追加/削除</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="route">
                    <IonLabel>路線追加/削除</IonLabel>
                </IonSegmentButton>
            </IonSegment>

            //     <IonReactRouter>
            //         <IonTabs>
            //             <IonRouterOutlet>
            //                 </IonRouterOutlet>
            // <IonTabBar slot="bottom">
            //     <IonTabButton tab="home" >
            //         <IonIcon icon={playCircle} />
            //         <IonLabel>Listen now</IonLabel>
            //     </IonTabButton>
            //
            //     <IonTabButton tab="radio" >
            //         <IonIcon icon={radio} />
            //         <IonLabel>Radio</IonLabel>
            //     </IonTabButton>
            //
            //     <IonTabButton tab="library">
            //         <IonIcon icon={library} />
            //         <IonLabel>Library</IonLabel>
            //     </IonTabButton>
            //
            // </IonTabBar>
            //                  </IonTabs>
            //             </IonReactRouter>
        //     <IonReactRouter>
        //         <IonTabs>
        //             <IonRouterOutlet>
        //                 <Redirect exact path="/" to="/home" />
        //                 {/*
        //   Use the render method to reduce the number of renders your component will have due to a route change.
        //
        //   Use the component prop when your component depends on the RouterComponentProps passed in automatically.
        // */}
        //                 <Route path="./home" render={() => <HomePage />} exact={true} />
        //                 <Route path="./radio" render={() => <RadioPage />} exact={true} />
        //                 <Route path="./library" render={() => <LibraryPage />} exact={true} />
        //             </IonRouterOutlet>
        //
        //
        //     </IonTabs>
        //     </IonReactRouter>

        );
    }catch(e){
        console.log(e);
        return (
            <div></div>
        );
    }
}


export const HomePage: React.FC= () =>{
    return (<div>Home</div>);
}

export const RadioPage: React.FC= () =>{
    return (<div>Radio</div>);
}
export const LibraryPage: React.FC= () =>{
    return (<div>Library</div>);
}