import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { setUserSession, resetUserSession } from '../../service/AuthService';
import { Auth } from 'aws-amplify';
import Login from '../../pages/Login/Login';
import { loginUser } from '../../utils/API/login';

jest.mock('../../service/AuthService');
jest.mock('aws-amplify');
jest.mock('../../utils/API/login', () => ({
  loginUser: jest.fn(() => Promise.reject({
    response: {
      status: 401,
      data: {
        message: 'Invalid credentials'
      }
    }
  }))
}));

describe('Login component', () => {
  beforeEach(() => {
    resetUserSession.mockClear();
    setUserSession.mockClear();
    loginUser.mockClear();
    Auth.signIn.mockClear();
  });

  it('renders the login form', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('submits the login form with valid credentials', async () => {
    const mockUser = { name: 'John Doe' };
    const mockToken = 'mock-token';

    loginUser.mockResolvedValueOnce({ user: mockUser, token: mockToken });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => expect(loginUser).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(loginUser).toHaveBeenCalledWith('testuser', 'password'));

    await waitFor(() => expect(setUserSession).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(setUserSession).toHaveBeenCalledWith(mockUser, mockToken));

    await waitFor(() => expect(Auth.signIn).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(Auth.signIn).toHaveBeenCalledWith('testuser', 'password'));

    await waitFor(() => expect(screen.queryByText('Both username and password are required')).toBeNull());
    await waitFor(() => expect(screen.queryByText('Sorry....the backend server is down. Please try again later!!')).toBeNull());
    });
  });



