import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';

test('renders Fileflo link', () => {
  render(<App />);
  const linkElement = screen.getByText(/fileflo/i);
  expect(linkElement).toBeInTheDocument();
});
