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

import {Card} from "@mui/material";
import {useEffect} from "react";
import {Station} from "../SujiroData/DiaData";
import {useRecoilState} from "recoil";
import {stationsAtom, trainTypesAtom} from "../State";






interface EditToolbarProps {
    setRows: (newRows: (oldRows: Station[]) => Station[]) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}



export default function StationListPage() {
    const [rows, setRows] = useRecoilState(stationsAtom);
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


    const processRowUpdate = (newRow: Station) => {
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
            valueGetter:    (value:number, _:Station) => {
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
        {   field: 'style',
            headerName: '駅時刻形式',
            width: 130 ,
            type: "singleSelect",
            getOptionValue: (value: any) => value.code,
            getOptionLabel: (value: any) => value.name,
            valueOptions: [
                { code: 0x11, name: "発時刻" },
                { code: 0x33, name: "発着" },
                { code: 0x12, name:  "下り着時刻" },
                { code: 0x21, name: "上り着時刻"}
            ],
            editable: true


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

    return (
        <Box sx={{ minWidth: 275 }} p={5}>
            <Card variant="outlined">
            <DataGrid
                rows={rows}
                autoHeight
                pageSizeOptions={[ 100]}
                checkboxSelection
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                // slots={{
                //     toolbar: EditToolbar as GridSlots['toolbar'],
                // }}
                // slotProps={{
                //     toolbar: { setRows, setRowModesModel },
                // }}
            />
        </Card>
        </Box>
    );
}




