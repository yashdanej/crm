import * as React from 'react';
import Button from '@mui/joy/Button';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Stack from '@mui/joy/Stack';
import { useSelector } from 'react-redux';

export default function DropDown({from}) {
  let sourceData = useSelector(state => state.source.sourceData);
  let assignedData = useSelector(state => state.assigned.assignedData);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        alert(JSON.stringify(formJson));
      }}
    >
      <Stack spacing={2} alignItems="flex-start">
        <Select
          placeholder="Select a pet"
          name="foo"
          required
          sx={{ minWidth: 200 }}
        >
          {
            from === "Source"?
            (
              sourceData.map((item) => {
                return (
                  <Option value={item.id}>{item.name}</Option>
                )
              })
            ):(
              assignedData.map((item) => {
                return (
                  <Option value={item.id}>{item.full_name}</Option>
                )
              })
            )
          }
        </Select>
      </Stack>
    </form>
  );
}
