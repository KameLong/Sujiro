import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowEditStopReasons,
    GridSlots,
} from '@mui/x-data-grid';

import {Card, TableCell, TableRow, TableHead, Table, TableContainer, Paper, TableBody, Checkbox} from "@mui/material";
import {useEffect} from "react";
import { MuiColorInput } from 'mui-color-input'
import {TrainType} from "../SujiroData/DiaData";
import {useRecoilState} from "recoil";
import {trainTypesAtom} from "../State";






export default function  TrainTypeListPage() {
    const [rows, setRows] = useRecoilState(trainTypesAtom);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    useEffect(()=>{
        console.log(rows);
    },[rows]);

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };


    const processRowUpdate = (newRow: TrainType) => {
        setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
        return newRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '駅順',
            width: 50,
            valueGetter:    (value:number, _:TrainType) => {
                const row=rows.find(item=>item.id===value);
                if(!row){
                    return "";
                }
                return rows.indexOf(row);
            }
             },
        {
            field: 'name',
            headerName: '駅名',
            width: 180,
            editable: true },
        {   field: 'textColor',
            headerName: '時刻表文字色',
            width: 130 ,
            renderEditCell: (params) => (
             <MuiColorInput format="hex" value={"#000000"} onChange={()=>{}}/>
            ),


        },
        {   field: 'type',
            headerName: '主要駅',
            width: 130,
            type: "singleSelect",
            getOptionValue: (value: any) => value.code,
            getOptionLabel: (value: any) => value.name,
            valueOptions: [
                { code: 0, name: "一般駅" },
                { code: 1, name: "主要駅" }
            ],
            editable: true
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        // <GridActionsCellItem
                        //     icon={<CancelIcon />}
                        //     label="Cancel"
                        //     className="textPrimary"
                        //     onClick={handleCancelClick(id)}
                        //     color="inherit"
                        // />,
                    ];
                }

                return [
                    // <GridActionsCellItem
                    //     icon={<EditIcon />}
                    //     label="Edit"
                    //     className="textPrimary"
                    //     onClick={handleEditClick(id)}
                    //     color="inherit"
                    // />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    interface HeadCell {
        disablePadding: boolean;
        id: string;
        label: string;
        numeric: boolean;
    }

    const headCells: readonly HeadCell[] = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Dessert (100g serving)',
        },
        {
            id: 'calories',
            numeric: true,
            disablePadding: false,
            label: 'Calories',
        },
        {
            id: 'fat',
            numeric: true,
            disablePadding: false,
            label: 'Fat (g)',
        },
        {
            id: 'carbs',
            numeric: true,
            disablePadding: false,
            label: 'Carbs (g)',
        },
        {
            id: 'protein',
            numeric: true,
            disablePadding: false,
            label: 'Protein (g)',
        },
    ];

    return (

        <Box sx={{ width: '100%' }} p={5}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>種別名</TableCell>
                            <TableCell>種別略称</TableCell>
                            <TableCell>時刻表文字色</TableCell>
                            <TableCell>ダイヤグラム線色</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >

                                <TableCell>
                                    {row.id}
                                </TableCell>
                                <TableCell>
                                    {row.name}
                                </TableCell>
                                <TableCell>
                                    {row.shortName}
                                </TableCell>
                                <TableCell>
                                    <div style={{width:'50px',height:'30px',background:row.color}}>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}






