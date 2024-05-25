import { useState } from 'react';

const useDropdown = (initialState = {}) => {
  const [openStates, setOpenStates] = useState(initialState);

  const toggleDropdown = (key) => {
    setOpenStates((prevStates) => ({
      ...prevStates,
      [key]: !prevStates[key],
    }));
  };

  return { openStates, toggleDropdown };
};

export default useDropdown;