import React, { useState } from 'react';
import { 
    TextField, 
    Box, 
    InputAdornment, 
    IconButton, 
    Typography 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        onSearch(query);  // Trigger the search functionality
    };

    return (
        <Box display="flex" justifyContent="center" width="100%">
            <TextField
                variant="outlined"
                placeholder="Search Blog Posts..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    minWidth: '300px',
                    maxWidth: '500px',
                    flexGrow: 1,
                }}
            />
        </Box>
    );
};

export default SearchBar;
