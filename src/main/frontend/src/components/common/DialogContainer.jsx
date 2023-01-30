import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


function DialogContainer(props) {
    const { children, open, onClose, onKill } = props;

    return (
        <Dialog open={open} onClose={onClose} onExited={onKill}>
            {children}
        </Dialog>
    );
}

export default DialogContainer