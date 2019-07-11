import React from 'react';
import { IconContext } from 'react-icons';
import { MdEmail } from 'react-icons/md';

export default () => {
  const iconContainer = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  };

  return (
    <IconContext.Provider value={{ style: { fontSize: '2em' } }}>
      <div style={iconContainer}>
        <MdEmail />
      </div>
    </IconContext.Provider>
  );
};
