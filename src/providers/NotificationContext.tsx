import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { createContext, useState } from "react";
import { Notification as NotificationModel } from "@models/notification";
import { useEffect } from 'react';

const val = {
  severity: "info",
  message: "",
  isVisible: false,
} as NotificationModel;

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export const NotificationProvider = (props: any) => {
  const classes = useStyles();
  const [notification, setNotification] = useState<NotificationModel>(val);

  useEffect(() => {
    let promise: any;
    if (notification.isVisible) {
      promise = setTimeout(() => handleClose(), 4000);
    }
    return () => {
      if (promise) {
        clearTimeout(promise);
      }
    }
  }, [notification.isVisible])

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    setNotification({ ...notification, isVisible: false });
  };
  return (
    <>
      <NotificationContext.Provider value={[notification, setNotification]}>
        {props.children}
        <div className={classes.root}>
          <Snackbar
            open={notification.isVisible}
            autoHideDuration={4000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity={notification.severity as any}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </div>
      </NotificationContext.Provider>
    </>
  );
};

export const NotificationContext = createContext<any>(val);
