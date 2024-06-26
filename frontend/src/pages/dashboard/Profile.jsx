import * as React from 'react';
import MenuButton from '@mui/joy/MenuButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import Apps from '@mui/icons-material/Apps';
import Dropdown from '@mui/joy/Dropdown';

export default function Profile({handleLogout}) {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const createHandleClose = (index) => () => {
    if (typeof index === 'number') {
      setSelectedIndex(index);
    }
  };

  return (
    <Dropdown>
      <MenuButton startDecorator={<Apps />}>Profile</MenuButton>
      <Menu>
        <MenuItem
          {...(selectedIndex === 0 && { selected: true, variant: 'soft' })}
          onClick={createHandleClose(0)}
        >
          Random project
        </MenuItem>
        <MenuItem selected={selectedIndex === 1} onClick={createHandleClose(1)}>
          Production - web
        </MenuItem>
        <MenuItem selected={selectedIndex === 2} onClick={() => {createHandleClose(2);handleLogout()}}>
          LogOut
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
