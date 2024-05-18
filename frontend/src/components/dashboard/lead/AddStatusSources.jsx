import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import { useState } from 'react';
import { useEffect } from 'react';
import { api } from '../../../utils/Utils';
import { ChromePicker } from 'react-color'; // Import the color picker component

export default function AddStatusSources({ openS, setOpenS, from }) {
    const [name, setName] = useState("");
    const [status, setStatus] = useState({
        name: "",
        statusorder: 0,
        color: "#000000" // Default color value
    });

    const onSubmit = () => {
        const pathname = from === "Status" ? "/lead/addstatus" : "/lead/addsources";
        const body = from === "Status" ? status : { name: name }; // Correctly determine the body based on the 'from' prop
        console.log("body", body);
        api(pathname, "post", body, false, true) // Pass the 'body' directly to the API request
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        console.log(status, name);
    }, [status, name]);

    const handleColorChange = (color) => {
        setStatus({ ...status, color: color.hex }); // Update the color value
    }

    return (
        <React.Fragment>
            <Modal open={openS} onClose={() => setOpenS(false)}>
                <ModalDialog>
                    <DialogTitle>Add new {from === "Status" ? "status" : "source"}</DialogTitle>
                    <DialogContent>
                        Fill in the information of the {from === "Status" ? "status" : "source"}.
                    </DialogContent>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            setOpenS(false);
                        }}
                    >
                        {
                            from === "Status" ? (
                                <Stack spacing={2}>
                                    <FormControl>
                                        <FormLabel>{from === "Status" ? "Status" : "Source"} Name</FormLabel>
                                        <Input
                                            required
                                            value={status.name}
                                            name="name"
                                            onChange={(e) => setStatus({ ...status, [e.target.name]: e.target.value })}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Color</FormLabel>
                                        <ChromePicker
                                            color={status.color}
                                            onChangeComplete={handleColorChange}
                                        />
                                    </FormControl>
                                    <Button onClick={onSubmit} type="submit">Submit</Button>
                                </Stack>
                            ) : (
                                <Stack spacing={2}>
                                    <FormControl>
                                        <FormLabel>{from === "Status" ? "Status" : "Source"} Name</FormLabel>
                                        <Input
                                            required
                                            value={name}
                                            name="name"
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </FormControl>
                                    <Button onClick={onSubmit} type="submit">Submit</Button>
                                </Stack>
                            )
                        }
                    </form>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
