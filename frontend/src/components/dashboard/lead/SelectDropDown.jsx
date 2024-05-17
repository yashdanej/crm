import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect } from 'react';

export default function SelectDropDown({name, data, set, value}) {
  const handleChange = (event) => {
    set(event.target.value);
  };
  return (
    <Box sx={{ minWidth: 120, marginTop: "20px" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{name}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Age"
          onChange={handleChange}
        >
            {
                data?.map((item) => {
                    return (
                        <MenuItem value={item.id}>{item.name?item.name:item.full_name}</MenuItem>
                    )
                })
            }
        </Select>
      </FormControl>
    </Box>
  );
}
