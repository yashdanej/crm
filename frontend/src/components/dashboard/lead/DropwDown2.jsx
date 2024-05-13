import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAssigned, getSource, getStatus } from '../../../store/slices/LeadSlices';
import { api } from '../../../utils/Utils';

export default function DropDown2({ lead, setLead, from }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const getDropdownData = async () => {
            let pathname;
            if (from === "Status") {
                pathname = "/lead/getstatus";
                dispatch(getStatus(await fetchData(pathname)));
            } else if (from === "Source") {
                pathname = "/lead/getsources";
                dispatch(getSource(await fetchData(pathname)));
            } else {
                pathname = "/lead/getusers";
                dispatch(getAssigned(await fetchData(pathname)));
            }
        };
        getDropdownData();
    }, [dispatch, from]);

    const statusData = useSelector((state) => state.status.statusData);
    const sourceData = useSelector((state) => state.source.sourceData);
    const assignedData = useSelector((state) => state.assigned.assignedData);

    const fetchData = async (pathname) => {
        try {
            const response = await api(pathname, false, false, true);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
            return [];
        }
    };

    let options = [];
    if (from === "Status") {
        options = statusData || [];
    } else if (from === "Source") {
        options = sourceData || [];
    } else {
        options = assignedData || [];
    }

    const handleChangeStatusSourceAssigned = (event, value) => {
        console.log('value', value);
        let selectedOption;
        if(from === "Assigned"){
            selectedOption = options.find(option => option.full_name === value);
        }else{
            selectedOption = options.find(option => option.name === value);
        }
        setLead(prevLead => ({
            ...prevLead,
            [from.toLowerCase()]: selectedOption.id
        }));
    };

    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            name={from}
            onChange={handleChangeStatusSourceAssigned}
            options={options.map(item => from === "Assigned" ? item.full_name : item.name)}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={from} />}
        />
    );
}
