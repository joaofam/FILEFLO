// Built-in Dependencies
import React, { useEffect } from 'react';

// Material-UI Dependencies
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// SortFiles Component
function SortFiles({ sortTypeUpload, onSortValueChange }) {
  // State Variables
  const [sortType, setSortType] = React.useState('');

  // handleChange function
  const handleChange = (event) => {
    setSortType(event.target.value);
  };

  // useEffect hook
  useEffect(() => {
    onSortValueChange(sortType);
  }, [sortType, onSortValueChange]);

  return (
    <Box
      sx={{
        fontFamily: 'space-grotesk',
        color: 'gray',
        position: 'relative',
        marginLeft: '35%',
        height: '41%',
        fontSize: '20px',
        marginTop: '-2.5%',
      }}
    >
      <FormControl fullWidth>
        <InputLabel
          id="demo-simple-select-label"
          sx={{ fontFamily: 'space-grotesk, monospace', color: '#bebebe' }}
        >
          Sort Files
        </InputLabel>
        <Select
          sx={{
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: '#color',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#9933ff',
              borderWidth: '0.15rem',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#9933ff',
            },
            cursor: 'pointer',
            height: '50px',
            backgroundColor: '#2f3031',
            color: 'White',
            minWidth: '25%',
            maxWidth: '100%',
          }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sortType}
          label="Sort Files"
          onChange={handleChange}
        >
          <MenuItem
            sx={{
              color: 'white',
              fontSize: '16px',
              fontFamily: 'space-grotesk',
              '&.Mui-selected': { color: '#9933ff' },
              '.MuiInput-input': {
                fontSize: '45px',
              },
            }}
            value={10}
          >
            Name
          </MenuItem>
          <MenuItem
            sx={{
              color: 'white',
              fontSize: '16px',
              fontFamily: 'space-grotesk',
            }}
            value={20}
          >
            File Name
          </MenuItem>
          <MenuItem
            sx={{
              color: 'white',
              fontSize: '16px',
              fontFamily: 'space-grotesk',
            }}
            value={30}
          >
            Most Recent Files
          </MenuItem>
          <MenuItem
            sx={{
              color: 'white',
              fontSize: '16px',
              fontFamily: 'space-grotesk',
            }}
            value={40}
          >
            Oldest Files
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default SortFiles;
