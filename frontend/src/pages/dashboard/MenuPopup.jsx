import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { useDispatch, useSelector } from "react-redux";
import { BACKEND, BACKEND_URL, api } from '../../utils/Utils';
import { getUserNotification } from '../../store/slices/Notification';
import { useEffect } from 'react';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import io from 'socket.io-client';
import { useState } from 'react';
import addNotification from "react-push-notification";
import { Notifications } from 'react-push-notification';

export function MenuPopup() {
  const notification = useSelector(state => state.notification.notification);
  const assignedData = useSelector(state => state.assigned.assignedData);
  const socket = useSelector(state => state.notification.socket);
  let getUser = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  useEffect(() => {
    api("/notification/getusernotification", "get", false, false, true)
    .then((res) => {
      console.log("res fron notification", res);
      dispatch(getUserNotification(res.data.data));
    })
    .catch((err) => {
      console.log("err in notification", err);
    });
    
  }, [dispatch]);
  const cli = () => {
    console.log("hello 222-----------");
    addNotification({
      title: "New notification received",
      message: "New lead assigned",
      duration: 5000,
      native: true
    });
   
  }
  useEffect(() => {
    if (socket) {
      const handleNotification = (notification) => {
        console.log("notification received", notification);
        console.log("in2", notification);
        dispatch(getUserNotification(notification));
        cli();
        let audio = new Audio("/notification.wav")
        try {
          const start = () => {
            audio.play()
          }
          start()
        } catch (error) {
          console.log("play failed");
        }
      };
      socket.on("notification received", handleNotification);
      return () => {
        socket.off("notification received", handleNotification);
      };
    }
  }, [socket, dispatch])
  console.log("notification", notification);
  return (
    <>
    <Notifications/>
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Badge className="mr-5 cursor-pointer" badgeContent={notification && notification?.length-1} color="primary" {...bindTrigger(popupState)}>
            <NotificationsIcon color="action" />
          </Badge>
          { notification &&
            notification?.length>0 &&
          <Menu {...bindMenu(popupState)}>
            {
              notification?.map((item, index) => {
                console.log("notification?.length", notification?.length);
                console.log("index", index);
                if(notification?.length - 1 === index) return;
                return (
                  <MenuItem key={item.id}>{assignedData.find(option => option.id === item?.senderuser_id)?.full_name} assigned a lead to {assignedData.find(option => option.id === item?.receiveuser_id)?.full_name}</MenuItem>
                )
              })
            }
          </Menu>
          }
        </React.Fragment>
      )}
    </PopupState>
    </>
  )
}