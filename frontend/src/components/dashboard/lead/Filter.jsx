import * as React from 'react';
import Button from '@mui/joy/Button';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Stack from '@mui/joy/Stack';
import { useSelector } from 'react-redux';

export default function Filter() {
  const statusData = useSelector(state => state.status.statusData);
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
          placeholder="Select a pet"
          name="pets"
          required
          multiple
          defaultValue={['dog', 'cat']}
          sx={{ minWidth: 200 }}
        >
          {
            statusData.map((item) => {
              return (
                <Option value={item.id}>{item.name}</Option>
              )
            })
          }
        </Select>
      </Stack>
    </form>
  );
}
