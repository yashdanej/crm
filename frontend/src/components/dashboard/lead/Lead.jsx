import React from 'react'
import Button from '@mui/joy/Button';
import Add from '@mui/icons-material/Add';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/joy/IconButton';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Table from './Table';

const Lead = () => {
  return (
    <div className='w-[95%] m-auto my-[2%]'>
      <div className='flex gap-4'>
        <Button startDecorator={<Add />}>New Lead</Button>
        <IconButton variant="soft" >
          <FavoriteBorder />
        </IconButton>
        <IconButton variant="soft" aria-label="Open in new tab" component="a" href="#as-link">
          <OpenInNew />
        </IconButton>
      </div>
      <div className='my-6'>
        <Table/>
      </div>
    </div>
  )
}

export default Lead
