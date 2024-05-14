import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAssigned, getSource, getStatus } from '../../../store/slices/LeadSlices';
import { api } from '../../../utils/Utils';

export default function DropDown2({ leadData, lead, setLead, from }) {
    const statusData = useSelector((state) => state.status.statusData);
    const sourceData = useSelector((state) => state.source.sourceData);
    const assignedData = useSelector((state) => state.assigned.assignedData);
    let options = [];
    if (from === "Status") {
        options = statusData || [];
    } else if (from === "Source") {
        options = sourceData || [];
    } else {
        options = assignedData || [];
    }

    const handleChangeStatusSourceAssigned = (event, value) => {
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

    const getSelectedValue = () => {
        if (!leadData) return null;
        if (from === "Status") {
            const selected = options.find(option => option.id === leadData.status);
            return selected ? selected.name : null;
        } else if (from === "Source") {
            const selected = options.find(option => option.id === leadData.source);
            return selected ? selected.name : null;
        } else if (from === "Assigned") {
            const selected = options.find(option => option.id === leadData.assigned);
            return selected ? selected.full_name : null;
        }
        return null;
    };

    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            name={from}
            onChange={handleChangeStatusSourceAssigned}
            options={options.map(item => from === "Assigned" ? item.full_name : item.name)}
            value={getSelectedValue()}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={from} />}
        />
    );
}
