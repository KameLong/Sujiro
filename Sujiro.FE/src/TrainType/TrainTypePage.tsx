import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    List,
    ListItem,
    Paper, styled,
    Table, TableBody, TableCell, tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {Home} from "@mui/icons-material";
import React, {useCallback, useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import {Route, RouteStation, Station, TrainType} from "../SujiroData/DiaData";
import {auth} from "../firebase";
import {useRequiredParamsHook} from "../Hooks/UseRequiredParamsHook";
import {axiosClient} from "../Hooks/AxiosHook";
import {blue} from "@mui/material/colors";
export interface TrainTypeListPageProps {
}
export default function TrainTypeListPage({}:TrainTypeListPageProps) {
    const {companyID} = useRequiredParamsHook<{ companyID: string }>();
    const [trainTypes,setTrainTypes]=useState<TrainType[]>([]);
    const loadTrainTypes=useCallback(()=>{
        axiosClient.get(`/api/TrainType/${companyID}?timestamp=${new Date().getTime()}`,
        ).then(res => {
            setTrainTypes(res.data);
        }).catch(err=>{});
    },[]);
    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            loadTrainTypes();
        });
    },[]);
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover
        }
    }));
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: blue[500],
            color: theme.palette.common.white
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        }
    }));
    return (
        <>
            <TableContainer component={Paper} sx={{display:{xs:"none",sm:"flex"}}}>
                <Table size="small">
                    <TableHead>
                        {/*<TableRow>*/}
                        {/*    {tableData.head?.map((value) => <StyledTableCell align="center">{value}</StyledTableCell>)}*/}
                        {/*</TableRow>*/}
                    </TableHead>
                    <TableBody>
                        {trainTypes.map((trainType) => (
                            <StyledTableRow>
                                <StyledTableCell align="center">{trainType.name}</StyledTableCell>
                                <StyledTableCell align="center">{trainType.shortName}</StyledTableCell>
                                <StyledTableCell align="center">{trainType.color}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Table for Mobile */}
            <TableContainer component={Paper} sx={{display:{xs:"flex",sm:"none"}}}>
                <Table size="small">
                    <TableBody>
                        {trainTypes.map((trainType) => (
                            <StyledTableRow key={trainType.trainTypeID}>
                                <TableContainer>
                                    <Table size="small" style={{tableLayout:"fixed"}}>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell component="th" scope="row" style={{width:"30%"}}>種別名</TableCell>
                                                <TableCell>{trainType.name}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row" style={{width:"30%"}}>種別略称</TableCell>
                                                <TableCell>{trainType.shortName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row" style={{width:"30%"}}>種別色</TableCell>
                                                <TableCell>{trainType.color}</TableCell>
                                            </TableRow>

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
    </>
)
}

