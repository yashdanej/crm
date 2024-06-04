import * as React from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Stack from '@mui/joy/Stack';
import { useSelector } from 'react-redux';

export default function DropDown({ from, onChange }) {
  const sourceData = useSelector(state => state.source.sourceData);
  const assignedData = useSelector(state => state.assigned.assignedData);

  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <Stack spacing={2} alignItems="flex-start">
      <Select
        placeholder={`Select ${from}`}
        onChange={handleChange}
        multiple
        sx={{ minWidth: 200 }}
      >
        {
          from === "Source" ?
            sourceData?.map((item) => (
              <Option key={item.id} value={item.id}>{item.name}</Option>
            )) :
            assignedData?.map((item) => (
              <Option key={item.id} value={item.id}>{item.full_name}</Option>
            ))
        }
      </Select>
    </Stack>
  );
}
