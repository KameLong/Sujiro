import React from 'react';
import {Container, Paper, Tabs, useTheme, Tab} from '@mui/material';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import StationListView from "./StationListView";
import {useRequiredParams} from "../Hooks/useRequiredParams";
import RouteListView from "./RouteListView";
function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}
function CompanyPage() {
    const {companyID} = useRequiredParams<{ companyID: string }>();

    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };



    return (
        <div>
            <Container>
                <Paper sx={{ padding: 4, marginY: 2 }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        // indicatorColor="secondary"
                        textColor="inherit"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="所属駅リスト" {...a11yProps(0)} />
                        <Tab label="所属路線リスト" {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={value} index={0} dir={theme.direction} >
                        <StationListView companyID={companyID}/>

                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <RouteListView companyID={companyID}/>
                    </TabPanel>
                </Paper>
            </Container>
        </div>
    );
}

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}




export default CompanyPage;