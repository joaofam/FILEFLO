// Built-in Dependencies
import React, { useState } from 'react';

// External Dependencies
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Material-UI Dependencies
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyIcon from '@mui/icons-material/Key';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// Internal Dependencies
import '@aws-amplify/ui-react/styles.css';
import '../../../utils/CSS/Container.css';
import awsconfig from '../../../aws-exports';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import { createFile } from '../../../graphql/mutations';
import { getUser } from '../../../service/AuthService';
import { listFiles } from '../../../graphql/queries';
import { MdCreateNewFolder } from 'react-icons/md';
import submitFolderPassphrase from '../../../utils/API/submitFolderPassphrase';

Amplify.configure(awsconfig);

// Zod Schema
const schema = z.object({
  folder: z
    .string()
    .regex(
      new RegExp(/^(?!.*(Shared|shared|Personal|personal)).{1,}$/),
      'Folder is not Valid'
    ),
});

// Form Component
export const Form = (props) => {
  // State Variables
  const [folder, createFolders] = useState('');
  const [, setFolders] = useState([]);
  const [folderPassphrase, setFolderPassphrase] = useState('');
  const [, setErrorMessage] = useState(null);
  const [checked, setChecked] = useState('');

  const user = getUser();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  
  // GraphQL Mutation
  const createFolder = async () => {
    try {
      const folderData = {
        folder: folder.replace(/\s+/g, '-'),
      };
      await API.graphql(graphqlOperation(createFile, { input: folderData }));

      window.location.reload();
    } catch (err) {
      console.log('error creating Folder:', err);
    }
  };

  // GraphQL Query
  const fetchFolders = async () => {
    try {
      const result = await API.graphql(graphqlOperation(listFiles));
      const folders = result.data.listFiles.items.map((item) => item.folder);
      setFolders(folders);
    } catch (err) {
      console.log('error fetching folders:', err);
    }
  };

  // useEffect Hook to get folders
  useState(() => {
    fetchFolders();
  }, []);

  // Submit Handler
  const submitHandler = async (data) => {
    if (checked === true) {
      await submitFolderPassphrase(
        user.username,
        null,
        folder,
        folderPassphrase,
        createFolder,
        setErrorMessage
      );
    } else {
      createFolder();
    }
  };

  // Handle Change
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="form-block">
      <form onSubmit={handleSubmit(submitHandler)}>
        {/* logo */}
        <img
          className="form-logo"
          alt="fileflo"
          src={require('../../../assets/filefloicon-removebg-preview.png')}
        />
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
          Create a Folder
        </Typography>
        {/* folder name input */}
        <div className="text-content">Enter name of Folder</div>
        <div className="input-container">
          <MdCreateNewFolder className="icon" />
          <input
            {...register('folder')}
            type="text"
            value={folder}
            placeholder="Folder name"
            onChange={(event) => createFolders(event.target.value)}
          />
        </div>
        <div className="check-container">
          <FormControl component="fieldset">
            <KeyIcon className="Key" />
            <FormControlLabel
              className="checkbox"
              checked={checked}
              onChange={handleChange}
              value="end"
              control={<Checkbox />}
              label={
                <Typography
                  variant="body1"
                  style={{
                    fontSize: '14px',
                    color: 'gray',
                  }}
                >
                  Allow sharing of folder
                </Typography>
              }
              labelPlacement="end"
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <Tooltip
              title={
                <Typography style={{ fontSize: '12px' }}>
                  Setting a unique passphrase allows for further security
                  measures ensuring this folder is only accessible through the
                  passphrase. <br />
                  If no passphrase is set: <br />• All files in folder will be
                  accesible to shared users without passphrase once a user is
                  added to the folder.
                </Typography>
              }
              placement="top"
            >
              <HelpOutlineIcon className="tooltip" style={{ fontSize: 18 }} />
            </Tooltip>
          </FormControl>
        </div>
        {/* folder passphrase input */}
        {checked ? (
          <div className="input-container">
            <KeyIcon className="passphrase" />
            <label className="label">Create Folder Passphrase</label>
            <input
              {...register('key')}
              type="text"
              value={folderPassphrase}
              placeholder="Cat dog meow"
              onChange={(event) => setFolderPassphrase(event.target.value)}
            />
          </div>
        ) : null}
        {/* error message */}
        {errors.folder?.message && (
          <p className="message">{errors.folder.message}</p>
        )}
        <button className="submit-button" type="submit">
          Create
        </button>
      </form>
    </div>
  );
};
export default Form;
