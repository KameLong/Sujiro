import { Redirect, Route } from 'react-router-dom';
import {
    IonApp,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenu,
    IonMenuButton,
    IonPage,
    IonRouterOutlet,
    IonSplitPane,
    IonTitle,
    IonToolbar,
    setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import React, {useRef} from "react";
import Example from "./pages/TimeTableEdit/ModalSample";
import {MenuPage} from "./pages/Menu/MenuPage";
import {TimeTableViewPage} from "./pages/TimeTable/TimeTablePage";
import {StationListPage} from "./pages/StationEdit/StationList";
// import {TimeTableEditPage} from "./pages/TimeTableEdit/TimeTableEditPage";
import {ListConnectorView} from "./pages/Common/ListConnector";

import classes from "./App.module.css"
setupIonicReact();

const App: React.FC = () => {
    const title="タイトル";

    return(
        <IonApp>
            <IonReactRouter>
                <IonSplitPane contentId="main-content" >
                    <IonMenu className={classes.IonMenu} contentId="main-content" side="start" >
                        <MenuPage />
                    </IonMenu>

                <IonPage id="main-content"  className={classes.noScrollBar}>
                        <IonHeader>
                            <IonToolbar>
                                <IonButtons slot="start">
                                    <IonMenuButton></IonMenuButton>
                                </IonButtons>
                                <IonTitle>{title}</IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent >
                            <Route exact path="/" component={ListConnectorView}/>
                            <Route exact path="/home">
                                <Example />
                            </Route>
                            <Route exact path="/LineTimeTable" component={TimeTableViewPage}/>
                            {/*<Route exact path="/RouteTimeTablePDF" component={RouteTimeTablePDF } />*/}
                            <Route exact path="/StationList" component={StationListPage} />
                            {/*<Route path="/TimeTableEdit" component={TimeTableEditPage } />*/}
                        </IonContent>
                    </IonPage>
                </IonSplitPane>
            </IonReactRouter>
        </IonApp>
    );
}
export default App;
