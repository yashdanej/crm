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

export function MenuPopup() {
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
    if (socket) {
      socket.on("notification received", (notification) => {
        console.log();
        dispatch(getUserNotification(notification));
      });
    }
  }, [socket, dispatch, getUser]);
  const notification = useSelector(state => state.notification.notification);
  const assignedData = useSelector(state => state.assigned.assignedData);

  
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Badge className="mr-5 cursor-pointer" badgeContent={notification?.length} color="primary" {...bindTrigger(popupState)}>
            <NotificationsIcon color="action" />
          </Badge>
          {
            notification?.length>0 &&
          <Menu {...bindMenu(popupState)}>
            {
              notification?.map((item) => {
                return (
                  <MenuItem>{assignedData.find(option => option.id === item.senderuser_id)?.full_name} assigned a lead to {assignedData.find(option => option.id === item.receiveuser_id)?.full_name}</MenuItem>
                )
              })
            }
          </Menu>
          }
        </React.Fragment>
      )}
    </PopupState>
  )
}