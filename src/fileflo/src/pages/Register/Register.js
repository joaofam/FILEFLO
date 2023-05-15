// External Imports
import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BiUser, BiLockAlt, BiLock, BiMale } from 'react-icons/bi';
import { MdOutlineEmail } from 'react-icons/md';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
// Material UI
import { Typography } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
// Internal Imports
import '../Login/login.css';

// API endpoint for register
const registerUrl =
  'https://s41eemifi8.execute-api.eu-west-1.amazonaws.com/prod/register';

// Validation schema
const schema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z
      .string()
      .email()
      .regex(
        new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
        'Email address is not valid'
      ),
    password: z
      .string()
      .regex(
        new RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
        'Password must contain: \n • Minimum of 8 characters \n • At least one uppercase character \n • At least one lowercase character \n • One number \n • One special character'
      ),
    repassword: z.string(),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Passwords don't match",
    path: ['repassword'],
  });

// Initial form state
const initialFormState = { username: '', password: '', email: '' };

// Register component
const Register = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  // Zod form validation
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });

  const { errors, isSubmitting } = formState;

  // Submit handler for the register form
  const formSubmit = async () => {
    // Check if all fields are filled
    if (
      formData.username.trim() === '' ||
      formData.email.trim() === '' ||
      formData.name.trim() === '' ||
      formData.password.trim() === '' ||
      formData.repassword.trim() === ''
    ) {
      setMessage('All fields are required');
      return;
    }
    // Check if passwords match
    if (formData.password.trim() !== formData.repassword.trim()) {
      setMessage('Passwords do not match');
      return;
    }
    setMessage(null);

    // Request configuration
    const requestConfig = {
      headers: {
        'x-api-key': 'mOZT1CQkd09PPTwCJ32Hp7qFhNrZPr2F65HMP0Fm',
      },
    };
    const requestBody = {
      username: formData.username,
      email: formData.email,
      name: formData.name,
      password: formData.password,
    };
    // Sign up the user using Auth.signUp
    try {
      const { user } = await Auth.signUp({
        name: formData.name,
        username: formData.username,
        password: formData.password,
        attributes: {
          email: formData.email,
        },
      });
      console.log(user);
      localStorage.setItem('username', user.username);
    } catch (error) {
      console.log('error signing up:', error);
    }

    // API call for register
    axios
      .post(registerUrl, requestBody, requestConfig)
      .then((response) => {
        console.log(formData.username);
        // Navigate user to Confirm page
        navigate('/confirm', { replace: true });
        setMessage('Registration Successful');
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setMessage(error.response.data.message);
        } else {
          setMessage(
            'sorry....the backend server is down!! please try again later'
          );
        }
      });
  };

  return (
    <div>
      <div className="login-block">
        <form onSubmit={handleSubmit(formSubmit)}>
          {/* Logo */}
          <img
            className="form-logo"
            alt="fileflo"
            src={require('../../assets/filefloicon-removebg-preview.png')}
          />
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator=">"
            aria-label="breadcrumb"
            sx={{
              '& ol': {
                justifyContent: 'center',
                margin: 'auto',
                color: 'purple',
                fontSixe: '14px',
                paddingBottom: 1.5,
              },
            }}
          >
            <Link sx={{ color: 'White' }} underline="hover" color="inherit">
              Register
            </Link>
            <Typography
              sx={{
                fontFamily: 'space-grotesk, monospace',
                color: '#7f7f7f',
              }}
            >
              Confirm
            </Typography>
            <Typography
              sx={{
                fontFamily: 'space-grotesk, monospace',
                color: '#7f7f7f',
              }}
            >
              Passphrase
            </Typography>
          </Breadcrumbs>
          <Typography
            sx={{
              fontFamily: 'space-grotesk, monospace',
              color: 'white',
              fontSize: '20px',
              textAlign: 'center',
              paddingBottom: '8px',
              fontWeight: 'bold',
            }}
          >
            Create an Account
          </Typography>
          {/* Name input */}
          <label className="label">Name</label>
          <div className="input-container">
            <BiMale className="icon" />
            <input
              {...register('name')}
              type="text"
              name="name"
              value={formData.name}
              onChange={(data) =>
                setFormData({ ...formData, name: data.target.value })
              }
              placeholder="Name"
            />
          </div>
          {/* error message */}
          <div className="errorResponse">{errors.name?.message}</div>
          {/* Username input */}
          <label className="label">Username</label>
          <div className="input-container">
            <BiUser className="icon" />
            <input
              {...register('username')}
              type="text"
              name="username"
              value={formData.username}
              onChange={(data) =>
                setFormData({ ...formData, username: data.target.value })
              }
              // OLD WAY INCASE NEW WAY IS BROKEN onChange={data => setUsername(data.target.value)}
              placeholder="Username"
            />
          </div>
          {/* Email input */}
          <label className="label">Email</label>
          <div className="input-container">
            <MdOutlineEmail className="icon" />
            <input
              {...register('email')}
              type="text"
              name="email"
              value={formData.email}
              onChange={(data) =>
                setFormData({ ...formData, email: data.target.value })
              }
              placeholder="Email"
            />
          </div>
          {/* error message */}
          <div className="errorResponse" style={{ whiteSpace: 'pre-wrap' }}>
            {errors.email?.message}
          </div>

          {/* Password input */}
          <label className="label">Password</label>
          <div className="input-container">
            <BiLockAlt className="icon" />
            <input
              {...register('password')}
              type="password"
              name="password"
              value={formData.password}
              onChange={(data) =>
                setFormData({ ...formData, password: data.target.value })
              }
              placeholder="••••••••"
            />
          </div>
          {/* error message */}
          <div className="errorResponse" style={{ whiteSpace: 'pre-wrap' }}>
            {errors.password?.message}
          </div>

          {/* Confirm Password input */}
          <label className="label">Confirm Password</label>
          <div className="input-container">
            <BiLock className="icon" />
            <input
              {...register('repassword')}
              type="password"
              value={formData.repassword}
              onChange={(data) =>
                setFormData({ ...formData, repassword: data.target.value })
              }
              placeholder="••••••••"
            />
          </div>
          {/* error message */}
          <div className="errorResponse">{errors.repassword?.message}</div>
          {/* Submit button */}
          <button
            type="submit"
            value="Register"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            Sign up
          </button>
        </form>
        {/* Already have an account? */}
        <Typography
          sx={{
            fontFamily: 'space-grotesk, monospace',
            color: '#bebebe',
            fontSize: '12px',
            textAlign: 'center',
            paddingTop: '14px',
          }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            sx={{ color: 'white', textDecorationColor: '#bebebe' }}
          >
            Login!
          </Link>
        </Typography>
        {/* Error message */}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
