import React from "react";
import {useLocation} from "react-router";
import {useFocusControl} from "../Test/useFocusController";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {timetableRoutesSelector, timetableSelector} from "../../store";
import classes from "../TimeTable/TimeTablePage.module.scss";
import {StationTimeEditView} from "../TimeTable/StationTimeEditView";
import {AppTitleState} from "../../App";

export const TimetableEditPage: React.FC= () => {
    try {
        const searchParams = new URLSearchParams(useLocation().search);
        const timeTableID = Number(searchParams.get("timetable"));
        const setTitle=useSetRecoilState(AppTitleState);

        setTimeout(()=>{setTitle((old)=>"TimeTableEdit");
        },0)


        const timeTable=useRecoilValue(timetableSelector(timeTableID));
        return (
            <div style={{paddingTop:'10px',height:'100%'}}>

            </div>

        );
    }catch(e){
        console.log(e);
        return (
            <div></div>
        );
    }
}
