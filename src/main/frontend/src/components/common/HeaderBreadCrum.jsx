import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';

import { useLocation } from 'react-router-dom';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';


export default function HeaderBreadCrum(props) {
    const { list } = props
    return <>
        <Breadcrumbs
            separator={<HorizontalRuleIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ml:1 , pt: 0, pb: 0}}>
            {list.map((item,i) => <Typography variant='subTitle' key={i}>{item}</Typography> )}
        </Breadcrumbs>
        <Divider/>
    </>
}