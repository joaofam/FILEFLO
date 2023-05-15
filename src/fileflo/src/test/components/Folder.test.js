import { render, fireEvent, screen } from '@testing-library/react';
import Form from '../../components/FolderCreate/UploadForm/index';

jest.mock("../../aws-exports");
jest.mock('../../graphql/mutations');
jest.mock('../../graphql/queries');
jest.mock('../../service/AuthService');
jest.mock('../../utils/API/submitFolderPassphrase');

describe('Form Component', () => {
  beforeEach(() => {
    render(<Form />);
  });

  test('renders form correctly', () => {
    expect(screen.getByText('Create a Folder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Folder name')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('folder passphrase input appears when checkbox is checked', () => {
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(screen.getByPlaceholderText('Cat dog meow')).toBeInTheDocument();
  });

  test('folder passphrase input disappears when checkbox is unchecked', () => {
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    expect(screen.queryByPlaceholderText('Cat dog meow')).not.toBeInTheDocument();
  });
});
