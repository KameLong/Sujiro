import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import React, {useEffect} from "react";
import {
    Button,
    Checkbox,
    Dialog,
    FormControlLabel,
    Input,
    Paper,
    styled,
    StyledEngineProvider,
    TextField
} from "@mui/material";
import {Close} from "@mui/icons-material";
import './test.css';

interface TimeEditProps {
    time: number;
    onChange: (time: number,kurisage:boolean,kuriage:boolean) => void;
    deleteTime:()=>void;
}

const useTimeShiftPattern=()=>{
    const [retroactive,setRetroactive]=React.useState(false);
    const [advance,setAdvance]=React.useState(false);
    return {retroactive,setRetroactive,advance,setAdvance};

}
export default function TimeEdit({time,onChange,deleteTime}:TimeEditProps) {
    const timeShiftPattern=useTimeShiftPattern();
    const [editTime,setEditTime]=React.useState(time);
    const [editTimeStr,setEditTimeStr]=React.useState(time2Str(editTime));
    useEffect(()=>{
        setEditTimeStr(time2Str(editTime));
    },[editTime]);
    useEffect(() => {
        setEditTime(time);
    }, [time]);
    const timeShift=(shift:number)=>{
        // setEditTime((editTime+shift+24*3600)%(24*3600));
        onChange(shift,timeShiftPattern.advance,timeShiftPattern.retroactive);
    }
    function time2Str(time:number){
        if(time<0){
            return "";
        }
        const ss=time%60;
        const mm=Math.floor(time/60)%60;
        const hh=Math.floor(time/3600)%24;
        return `${hh.toString().padStart(1,'0')}${mm.toString().padStart(2,'0')}${ss.toString().padStart(2,'0')}`;
    }
    function timeStr2Int(str:string){
        let hh=0;
        let mm=0;
        let ss=0;
        switch (str.length) {
            case 6:
                hh=parseInt(str.substring(0,2));
                mm=parseInt(str.substring(2,4));
                ss=parseInt(str.substring(4,6));
                break;
            case 5:
                hh=parseInt(str.substring(0,1));
                mm=parseInt(str.substring(1,3));
                ss=parseInt(str.substring(3,5));
                break;
            case 4:
                hh=parseInt(str.substring(0,2));
                mm=parseInt(str.substring(2,4));
                break;
            case 3:
                hh=parseInt(str.substring(0,1));
                mm=parseInt(str.substring(1,3));
                break;
            default:
                return -1;
        }
            if(Number.isNaN(hh)||Number.isNaN(mm)||Number.isNaN(ss)) {
                return -1;
            }
            console.log(hh,mm,ss);

            if(hh<24&&mm<60&&ss<60){
                return hh * 3600 + mm * 60 + ss;
            }else{
                return -1;
            }
    }

    return(
        <StyledEngineProvider injectFirst>

        <Grid container spacing={2} style={{margin:'0px auto',width:'360px'}}>
            <Grid xs={3} style={{verticalAlign:'center'}} >
                時刻編集
            </Grid>
            <Grid xs={3} >
                <Button variant={"contained"} style={{backgroundColor:'lightpink',color:'black'}}
                onClick={()=>{
                    deleteTime();
                }}>時刻削除</Button>
            </Grid>
            <Grid xs={4} >
                {/*<TextField label="時刻" type="number" defaultValue="07:30" />*/}
                <Input type='number' value={editTimeStr} onChange={e=>setEditTimeStr(e.target.value)}
                onBlur={(e)=>{
                    console.log(e.target.value);
                    const time=timeStr2Int(e.target.value);
                    console.log(time)
                    ;
                    if(time>=0){
                        setEditTime(time);
                    }else {
                        const result = window.confirm('正しい時刻ではありません。この時刻を削除しますか？');
                        if(result) {
                            setEditTime(-1);
                        }else {
                            e.preventDefault();
                            setTimeout(()=>{
                                e.target.focus();
                            },0);
                        }

                    }
                }}
                ></Input>
            </Grid>
            <Grid xs={2} >
                <Close/>
            </Grid>
            <Grid xs={2} >
                <Button variant={'contained'} style={{backgroundColor:'lightBlue',color:'black'}}
                 onClick={()=>timeShift(10)}>
                    +10秒
                </Button>
            </Grid>
            <Grid xs={2} >
                <Button variant={'contained'} style={{backgroundColor:'lightBlue',color:'black'}}
                        onClick={()=>timeShift(15)}>

                +15秒
                </Button>
            </Grid>
            <Grid xs={2} >
                <Button variant={'contained'} style={{backgroundColor:'lightBlue',color:'black'}}
                        onClick={()=>timeShift(60)}>
                +1分
                </Button>
            </Grid>
            <Grid xs={2} >
                <Button variant={'contained'} style={{backgroundColor:'lightBlue',color:'black'}}
                        onClick={()=>timeShift(600)}>
                +10分
                </Button>
            </Grid>
            <Grid xs={4} >
                <FormControlLabel  control={<Checkbox size={"small"} value={timeShiftPattern.retroactive}
                     onChange={(e)=>{timeShiftPattern.setRetroactive(e.target.checked)}}/>
                } label="前え倒し"/>
            </Grid>
            <Grid xs={2} >
                <Button variant={'contained'} style={{backgroundColor:'lightGreen',color:'black'}}
                        onClick={()=>timeShift(-10)}>
                -10秒
                </Button>
            </Grid>
            <Grid xs={2} >
                <Button variant={'contained'} style={{backgroundColor:'lightGreen',color:'black'}}
                        onClick={()=>timeShift(-15)}>

                -15秒
                </Button>
            </Grid>
            <Grid xs={2} >
                <Button variant={'contained'} style={{backgroundColor:'lightGreen',color:'black'}}
                        onClick={()=>timeShift(-60)}>
                -1分
                </Button>
            </Grid>
            <Grid xs={2} >
                <Button variant={'contained'} style={{backgroundColor:'lightGreen',color:'black'}}
                        onClick={()=>timeShift(-600)}>
                -10分
                </Button>
            </Grid>
            <Grid xs={4} >
                <FormControlLabel  control={<Checkbox size={"small"} value={timeShiftPattern.advance}
                              onChange={(e)=>{timeShiftPattern.setAdvance(e.target.checked)}}
                    />} label="後ろ倒し"/>
            </Grid>
        </Grid>
            {/*<Dialog open={true} onClose={()=>{}}>*/}
            {/*    <TextField label="時刻" type="number" value={editTimeStr} onChange={e=>setEditTimeStr(e.target.value)}></TextField>*/}
            {/*</Dialog>*/}
        </StyledEngineProvider>
    )
}