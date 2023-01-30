
import { createContext, useState, useRef,useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const DialogContext = createContext();

export default function DialogProvider({ children }) {

  const [dialogs, setDialogs] = useState([]);

  const createDialog = (option) => {
    const dialog = { ...option, open: true };
    setDialogs((dialogs) => [...dialogs, dialog]);
  };
  const closeDialog = () => {
    setDialogs((dialogs) => {
      const latestDialog = dialogs.pop();
      if (!latestDialog) return dialogs;
      if (latestDialog.onClose) latestDialog.onClose();
      return [...dialogs].concat({ ...latestDialog, open: false });
    });
  };
  const contextValue = useRef([createDialog, closeDialog]);
  return (
    <DialogContext.Provider value={contextValue.current}>
      {children}
      {dialogs.map((dialog, i) => {
        return <DialogContainer key={i} {...dialog} />;
      })}
    </DialogContext.Provider>
  );
}

export const useDialog = () => useContext(DialogContext);


// export function open(props){
//   const [openDialog, closeDialog] = useDialog();

//   const { title, contents } = props
//   openDialog({
//     children: (
//       <>
//         <DialogTitle>{ title }</DialogTitle>
//         <DialogContent>{ contents }</DialogContent>
//         <DialogActions>
//           <Button color="primary" onClick={closeDialog}>Close</Button>
//         </DialogActions>
//       </>
//     )
//   })

// }


function DialogContainer(props) {
  const { children, open, onClose, onKill } = props;

  return (
    <Dialog open={open} onClose={onClose} onExited={onKill}>
      {children}
    </Dialog>
  );
}