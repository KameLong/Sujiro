import {useRecoilState} from "recoil";
import {patternSettingsAtom} from "../SujiroData/PatternTrain";
import {Grid} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useEffect, useState} from "react";



export function PatternSettingView() {
    //patternSettingsAtomの読み書き
    const [patternSetting, setPatternSetting] = useRecoilState(patternSettingsAtom);

    const [repMin,setRepMin]=useState<number>(0);
    const [repSec,setRepSec]=useState<number>(0);

    useEffect(()=>{
        setPatternSetting({...patternSetting,period:repMin*60+repSec});
    },[repMin,repSec]);
    useEffect(() => {
        setRepMin(Math.floor(patternSetting.period / 60));
        setRepSec(patternSetting.period % 60);
    }, []);






    return (
        <Grid container>
            <Grid lg={4} p={2}>
                <div>
                    繰り返しの周期
                </div>
                <TextField
                    variant="standard"
                    type="number"
                    InputProps={{
                        inputProps: {
                            min: 0, // 最小値
                            max: 999 // 最大値
                        }
                    }}
                    value={repMin}
                    onChange={(e)=>setRepMin(parseInt(e.target.value))}
                    InputLabelProps={{
                        shrink: true,
                    }}

                />
                分
                <TextField
                    variant="standard"
                    type="number"
                    InputProps={{
                        inputProps: {
                            min: 0, // 最小値
                            max: 59 // 最大値
                        }
                    }}
                    value={repSec}
                    onChange={(e)=>setRepSec(parseInt(e.target.value))}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                秒
            </Grid>
            <Grid lg={4} p={2}>
                <div>
                    繰り返しの回数
                </div>
                <TextField
                    variant="standard"
                    type="number"
                    InputProps={{
                        inputProps: {
                            min: 0, // 最小値
                            max: 999 // 最大値
                        }
                    }}
                    value={patternSetting.repetitionNum}
                    onChange={(e)=>setPatternSetting({...patternSetting,repetitionNum:parseInt(e.target.value)})}
                    InputLabelProps={{
                        shrink: true,
                    }}

                />
                回

            </Grid>

        </Grid>
    )


}