import {useRecoilState, useRecoilValue} from "recoil";
import { PassengerBetweenStationAtom } from "../SujiroData/Passenger";
import {stationsAtom} from "../State";
import Paper from "@mui/material/Paper/Paper";
import TableContainer from "@mui/material/TableContainer/TableContainer";
import Table from "@mui/material/Table/Table";
import TableHead from "@mui/material/TableHead/TableHead";
import TableRow from "@mui/material/TableRow/TableRow";
import TableCell from "@mui/material/TableCell/TableCell";
import TableBody from "@mui/material/TableBody/TableBody";
import {MenuItem, TextField} from "@mui/material";
import React, {useState} from "react";
import Menu from "@mui/material/Menu";

function timeSec2Str(time:number){
    const hour=Math.floor(time/3600);
    const min=Math.floor((time%3600)/60);
    return hour.toString().padStart(2,'0')+min.toString().padStart(2,'0')
}

export default function PassengerPage(){
    const [passengerBetweenStation2,setPassengerBetweenStation] = useRecoilState(PassengerBetweenStationAtom);
    const passengerBetweenStation=passengerBetweenStation2[0].passenger;

    // メニュー用のstate
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };
    const copyTable=()=>{
        let str="\t";
        stations.forEach((station,index)=>{
            str+=station.name;
            if(index!==stations.length-1){
                str+="\t";
            }
        });
        str+="\n";
        stations.forEach((station,index)=>{
            str+=station.name;
            passengerBetweenStation[index].forEach((value,index2)=>{
                str+="\t"+value;
            });
            str+="\n";
        });
        navigator.clipboard.writeText(str);
        handleClose();
    }
    const pasteTable=(e:any)=>{
        navigator.clipboard.readText().then(clipText=>{
            const lines=clipText.split("\n");
            let data:number[][]=[];
            if(Number.isFinite(lines[0].split('\t')[0])){
                data=lines.map(line=>{
                    return line.split('\t').map(item=>{
                        return parseFloat(item);
                    })
                })
            }else{
                data=lines.slice(1).map(line=>{
                    return line.split('\t').slice(1).map(item=>{
                        return parseFloat(item);
                    })
                })
            }
            data=data.map(data2=>{
                return data2.concat(new Array<number>(stations.length).fill(0)).slice(0,stations.length);
            }).concat(new Array<number[]>(stations.length).fill(new Array<number>(stations.length).fill(0))).slice(0,stations.length);
            setPassengerBetweenStation(prev=>{
                return [{...prev[0],passenger:data}];
            });


            console.log(data);
            handleClose();
        });
    }



    const stations=useRecoilValue(stationsAtom);

    return (
        <div onContextMenu={handleContextMenu} style={{cursor: 'context-menu'}} onPaste={pasteTable}>
            <div>駅間流動</div>
            <span style={{marginLeft: '30px'}}>
            開始時刻：
            </span>
            <input value={timeSec2Str(passengerBetweenStation2[0].startTime)}
                   max={3000}
                   style={{width: '50px'}}
                   type={"number"}
                   onBlur={(e) => {
                       console.log(e);
                       setPassengerBetweenStation(prev => {
                           const timeStr = e.target.value;
                           switch (timeStr.length) {
                               case 3:
                                   return [{
                                       ...prev[0],
                                       startTime: parseInt(timeStr.substring(0, 1)) * 3600 + parseInt(timeStr.substring(1, 2))
                                   }];
                               case 4:
                                   return [{
                                       ...prev[0],
                                       startTime: parseInt(timeStr.substring(0, 2)) * 3600 + parseInt(timeStr.substring(2, 2))
                                   }];
                           }
                           return prev;
                       });
                   }}
            ></input>

            <span style={{marginLeft: '30px'}}>
                終了時刻：
            </span>
            <input value={timeSec2Str(passengerBetweenStation2[0].endTime)}
                   max={3000}
                   style={{width: '50px'}}
                   type={"number"}
                   onBlur={(e) => {
                       console.log(e);
                       setPassengerBetweenStation(prev => {
                           const timeStr = e.target.value;
                           switch (timeStr.length) {
                               case 3:
                                   return [{
                                       ...prev[0],
                                       endTime: parseInt(timeStr.substring(0, 1)) * 3600 + parseInt(timeStr.substring(1, 2))
                                   }];
                               case 4:
                                   return [{
                                       ...prev[0],
                                       endTime: parseInt(timeStr.substring(0, 2)) * 3600 + parseInt(timeStr.substring(2, 2))
                                   }];
                           }
                           return prev;
                       });
                   }}
            ></input>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table" style={{tableLayout: 'fixed'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{width: '150px'}}>発駅＼着駅</TableCell>
                            {stations.map((station) => (
                                <TableCell key={station.id} style={{width: '100px'}}>{station.name} </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stations.map((station, index) => (
                            <TableRow key={station.id}>
                                <TableCell style={{width: '100px'}}>{station.name}</TableCell>
                                {stations.map((station2, index2) => (
                                    <TableCell key={station2.id}>

                                        <input
                                            value={passengerBetweenStation[index][index2]}
                                            type={"number"}
                                            min={0}
                                            max={99999}
                                            disabled={station.id === station2.id}
                                            onChange={(e) => {
                                                const newPassengerBetweenStation = passengerBetweenStation.map((row, i) => {
                                                    if (i === index) {
                                                        return row.map((value, j) => {
                                                            if (j === index2) {
                                                                return parseFloat(e.target.value);
                                                            }
                                                            return value;
                                                        })
                                                    }
                                                    return row;
                                                })
                                                setPassengerBetweenStation(prev => {
                                                    return [{...prev[0], passenger: newPassengerBetweenStation}];
                                                });
                                            }}
                                        >

                                        </input>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>


            </TableContainer>
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
                        : undefined
                }

            >
                <MenuItem onClick={copyTable}>表をコピー</MenuItem>
                <MenuItem onClick={pasteTable}>表を貼り付け</MenuItem>
            </Menu>

        </div>
    );
}