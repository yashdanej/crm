import axios from "axios";
import * as React from 'react';
import Button from '@mui/joy/Button';
import Snackbar from '@mui/joy/Snackbar';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

// export const BACKEND_URL = "http://65.0.30.99:3001/api/v1";
export const BACKEND_URL = "http://localhost:3001/api/v1";
// export const BACKEND = "http://65.0.30.99:3001";
export const BACKEND = "http://localhost:3001";

export const api = async (pathname, method, body, formData=false, includeCredentials = false) => {
    const axiosConfig = {
        url: `${BACKEND_URL}${pathname}`,
        method: method,
    };
    if(body){
        if(formData){
            const data = new FormData();
            for (const key in body) {
              if (body.hasOwnProperty(key)) {
                  data.append(key, body[key]);
              }
            }
            console.log('data', data);
            axiosConfig.data = data;
        }else{
            axiosConfig.data = body;
        }
    }
    if (includeCredentials) {
        axiosConfig.withCredentials = true;
    }

    return await axios(axiosConfig)
        .then((res) => res)
        .catch((e) => {
            console.log('inside: ', e);
            return e;
        });
};

export const changeText = (e, set, content, value) => {
    set({...content, [e.target.name]: value?value:e.target.value})
}

export default function SnackbarWithDecorators({snackAlert, setSnackAlert, text, color}) {
  return (
    <React.Fragment>
      <Snackbar
        variant="soft"
        color={color}
        open={snackAlert}
        onClose={() => setSnackAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        startDecorator={<PlaylistAddCheckCircleRoundedIcon />}
        endDecorator={
          <Button
            onClick={() => setSnackAlert(false)}
            size="sm"
            variant="soft"
            color={color}
          >
            Dismiss
          </Button>
        }
      >
        {text}
      </Snackbar>
    </React.Fragment>
  );
}

export const selectedItem = (leadData, item, from) => {
  let selected;
  if(from == "Status"){
    selected = item.find(option => option.id === leadData?.status);
  }else if(from === "Source"){
    selected = item.find(option => option.id === leadData?.source);
  }else{
    selected = item.find(option => option.id === leadData?.assigned);
  }
  if(from === "Assigned"){
    return selected ? selected.full_name : null;
  }
  return selected ? selected.name : null;
}
export const displayTimeOfPost = (ele) => {
  let timeDifference;
  const createdDate = new Date(ele);
  const currentDate = new Date();
  // Calculate the time difference in milliseconds
  timeDifference = currentDate.getTime() - createdDate.getTime();
  
  // Function to calculate the time difference in minutes, hours, days, weeks, or years
  const getTimeDifferenceString = () => {
    if (timeDifference < 60 * 1000) { // Less than 1 minute
      return `${Math.floor(timeDifference / 1000)} seconds ago`;
    } else if (timeDifference < 60 * 60 * 1000) { // Less than 1 hour
      return `${Math.floor(timeDifference / (60 * 1000))} minutes ago`;
    } else if (timeDifference < 24 * 60 * 60 * 1000) { // Less than 1 day
      return `${Math.floor(timeDifference / (60 * 60 * 1000))} hours ago`;
    } else if (timeDifference < 7 * 24 * 60 * 60 * 1000) { // Less than 1 week
      const daysAgo = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
      return daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`;
    } else if (timeDifference < 365 * 24 * 60 * 60 * 1000) { // Less than 1 year
      const weeksAgo = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
      return weeksAgo === 1 ? '1 week ago' : `${weeksAgo} weeks ago`;
    } else { // More than 1 year
      const yearsAgo = Math.floor(timeDifference / (365 * 24 * 60 * 60 * 1000));
      return yearsAgo === 1 ? '1 year ago' : `${yearsAgo} years ago`;
    }
  };
  return getTimeDifferenceString();
}



export const SimpleBadge = ({length}) => {
  return (
    <Badge className="mr-5" badgeContent={length} color="primary">
      <NotificationsIcon color="action" />
    </Badge>
  );
}

let timeDifference;
export const displayTime = (ele) => {
  const createdDate = new Date(ele);
  const currentDate = new Date();
  // Calculate the time difference in milliseconds
  timeDifference = currentDate.getTime() - createdDate.getTime();

  // Function to calculate the time difference in minutes, hours, days, weeks, or years
  const getTimeDifferenceString = () => {
    if (timeDifference < 60 * 1000) { // Less than 1 minute
      return `${Math.floor(timeDifference / 1000)} seconds ago`;
    } else if (timeDifference < 60 * 60 * 1000) { // Less than 1 hour
      return `${Math.floor(timeDifference / (60 * 1000))} minutes ago`;
    } else if (timeDifference < 24 * 60 * 60 * 1000) { // Less than 1 day
      return `${Math.floor(timeDifference / (60 * 60 * 1000))} hours ago`;
    } else if (timeDifference < 7 * 24 * 60 * 60 * 1000) { // Less than 1 week
      const daysAgo = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
      return daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`;
    } else if (timeDifference < 365 * 24 * 60 * 60 * 1000) { // Less than 1 year
      const weeksAgo = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
      return weeksAgo === 1 ? '1 week ago' : `${weeksAgo} weeks ago`;
    } else { // More than 1 year
      const yearsAgo = Math.floor(timeDifference / (365 * 24 * 60 * 60 * 1000));
      return yearsAgo === 1 ? '1 year ago' : `${yearsAgo} years ago`;
    }
  };
  return getTimeDifferenceString();
}