import * as React from 'react';
import Button from '@mui/joy/Button';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Stack from '@mui/joy/Stack';
import { useSelector } from 'react-redux';

export default function Filter({ setStatusQuery }) {
  const statusData = useSelector(state => state.status.statusData);

  const handleChange = (event, newValue) => {
    setStatusQuery(newValue);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const selectedPets = JSON.parse(formJson.pets);
        alert(JSON.stringify(selectedPets));
      }}
    >
      <Stack spacing={2} alignItems="flex-start">
        <Select
          placeholder="Select a status"
          name="status"
          required
          multiple
          onChange={handleChange}
          sx={{ minWidth: 200 }}
        >
          {
            statusData.map((item) => {
              return (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              );
            })
          }
        </Select>
      </Stack>
    </form>
  );
}
