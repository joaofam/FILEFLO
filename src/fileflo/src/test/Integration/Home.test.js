import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../../pages/Home/Home';

describe('Home component', () => {
  it('renders the home page elements', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    expect(screen.getByText('Welcome to')).toBeInTheDocument();
    expect(screen.getByAltText('fileflo')).toBeInTheDocument();
    expect(screen.getByText('FILEFLO')).toBeInTheDocument();
    expect(screen.getByText('Current Version v1.00')).toBeInTheDocument();
    expect(screen.getByText('Current explorable features + many more')).toBeInTheDocument();

    // Check for the presence of the grid items
    expect(screen.getByText('Dashboard to control all your files')).toBeInTheDocument();
    expect(screen.getByText('Upload at maximum safety')).toBeInTheDocument();
    expect(screen.getByText('Share a file with any other Fileflo user(s)')).toBeInTheDocument();
    expect(screen.getByText('Manage your files in organized Folders')).toBeInTheDocument();

    // Check for the presence of the images inside the grid items
    expect(screen.getAllByAltText('fileflo-upload-page').length).toBe(1);
    expect(screen.getAllByAltText('fileflo-upload').length).toBe(1);
    expect(screen.getAllByAltText('fileflo-shared').length).toBe(1);
    expect(screen.getAllByAltText('fileflo').length).toBe(1);
  });
});
