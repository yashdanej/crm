import axios from "axios";
import * as React from 'react';
import Button from '@mui/joy/Button';
import Snackbar from '@mui/joy/Snackbar';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';
axios.defaults.withCredentials = true;
export const api = async (pathname, method, body, formData=false, includeCredentials = false) => {
    const axiosConfig = {
        url: `http://localhost:3000/api/v1${pathname}`,
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