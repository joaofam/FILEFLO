import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from '../../components/PassPhrase/UploadForm/index';

jest.mock('axios');
jest.mock('web3');
jest.mock('../../service/AuthService', () => ({
  getUser: () => ({ username: 'testUser' }),
  getToken: () => 'testToken',
}));
jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/test/folderPath' }),
}));

const mockProps = {
  selectedFileName: 'testFile.txt',
  selectedFileHash: 'testFileHash',
  owners: ['testUser'],
};

describe('Form', () => {
  test('renders Form component', () => {
    const { getByText } = render(<Form {...mockProps} />);
    expect(getByText(/Download File/i)).toBeInTheDocument();
  });

  test('renders the correct elements', () => {
    render(<Form {...mockProps} />);
    expect(screen.getByText(/Download File/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Folder Passphrase/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
  });

  test('shows an error message if passphrase is empty', async () => {
    const { getByText, getByRole, getByPlaceholderText } = render(<Form {...mockProps} />);
    const downloadButton = getByRole('button', { name: /Download/i });

    fireEvent.click(downloadButton);

    await waitFor(() => {
      const errorMessage = getByText('Passphrase should not be empty');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('submitHandler is called when form is submitted', () => {
    render(<Form {...mockProps} />);
    const submitButton = screen.getByRole('button', { name: /Download/i });

    fireEvent.submit(submitButton);
  });

  test('error message is displayed when passphrase is empty', async () => {
    render(<Form {...mockProps} />);
    const submitButton = screen.getByRole('button', { name: /Download/i });

    await userEvent.click(submitButton);

    expect(await screen.findByText(/Passphrase should not be empty/i)).toBeInTheDocument();
  });
});
