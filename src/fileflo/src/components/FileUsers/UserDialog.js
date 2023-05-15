// Built-in Dependencies
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// External Dependencies
import { AiFillCrown } from 'react-icons/ai';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import awsconfig from '../../aws-exports';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// Material UI Dependencies
import {
  Avatar,
  Box,
  Button,
  Dialog,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Internal Dependencies
import { enterPassphrase } from '../../utils/API/enterPassphrase.js';
import { folderPassphraseCheck } from '../../utils/API/folderPassphraseCheck.js';
import { retrieveUserPublicKeyAPI } from '../../utils/API/requestPublicKey.js';
import { encryptPassphrase } from '../../utils/API/encryptPassphrase';
import { getUser } from '../../service/AuthService';
import submitFolderPassphrase from '../../utils/API/submitFolderPassphrase';
import { updateFile } from '../../graphql/mutations';

Amplify.configure(awsconfig);

function UserDialog(props) {
  // Props
  const { onClose, selectedValue, setFiles, selectedId, open, setPath, owners, setFilter, setInFolder} = props;
  const { register, handleSubmit } = useForm({
  });

  // State variables
  const [owner, setOwner] = useState('');
  const [, setFolder] = useState('');
  const [checkedOwners, setCheckedOwners] = useState([]);
  const [passphrase, setPassphrase] = useState('');
  const [inputType, setInputType] = useState('password');
  const [, setPassphraseEntered] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [encryptedPassphrase, setEncryptedPassphrase] = useState(null);
  const [userAdded, setUserAdded] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [, setOpenCopy] = React.useState(false);
  const [folderPassphrase, setFolderPassphrase] = useState('')
  const [successMessage, setSuccessMessage] = useState('');

  // get the passphrase from session storage
  const sessionPassphrase = sessionStorage.getItem('personalPassphrase');
  
  // Util components
  const { pathname } = useLocation();
  const folderPath = pathname.split('/')[2];
  const user = getUser();
  const textRef = useRef(null);
  const openPop = Boolean(anchorEl);
  const id = openPop ? 'simple-popover' : undefined;

  // Filter files to get the files in the current folder and
  const filteredFiles = setFiles.filter(
    (file) => file.folder && file.folder.includes(folderPath)
  ); 
  const ownersList = setFilter?.map(file => file.owners)?.flat();
  const uniqueOwnersList = useMemo(() => [...new Set(ownersList)], [ownersList]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  // Reset userAdded state when it changes
  useEffect(() => { 
    setUserAdded(null);
  }, [userAdded]);

  // Set folder state when setPath changes
  useEffect(() => {
    if (setPath !== undefined) {
      setFolder(setPath);
    }
  }, [setPath]);

  // handle close dialog
  const handleClose = () => {
    onClose(selectedValue);
  };

  // handle click popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // handle close popover
  const handleClosePop = () => {
    setAnchorEl(null);
  };

  // Copy the encrypted passphrase to the clipboard
  const copyToClipboard = () => {
    setOpenCopy(true);
    if (textRef.current) {
        navigator.clipboard.writeText(textRef.current.textContent);
    };
  };

  // Form Submit handler
  const formSubmit = async () => {
    // Validate owner input
    if (owner.trim() === '') { 
      setErrorMessage('Please input an owner to share with');
      return;
    }
    setErrorMessage(null);

    // Validate passphrase input
    if (passphrase.trim() === '') {
      setErrorMessage('Passphrase should not be empty');
      return;
    }
    // Check if the passphrase is correct
    const error = await enterPassphrase(passphrase);
    if (error) {
        setErrorMessage(error);
        return;
    }
    
    // Check if the folder path is a Personal or Shared folder
    if (folderPath !== "Personal" && folderPath !== "Shared") {
      const response = await folderPassphraseCheck(user.username, folderPath, folderPassphrase)
      if (response.error) {
          setErrorMessage(response.error);
          return;
      }
      // Add folder with passphrase to user being added
      await submitFolderPassphrase(user.username, owner, folderPath, folderPassphrase, null, setErrorMessage);
      // Add user to the file
      await addUser();
      setSuccessMessage('User Successfully Added')
    } else {

      if (owner.trim() === '') { 
        setErrorMessage('Please input an owner to share with');
        return;
      }
      setErrorMessage(null);
      if (passphrase.trim() === '') {
        setErrorMessage('Passphrase should not be empty');
        return;
      }
      const error = await enterPassphrase(passphrase);
      if (error) {
          setErrorMessage(error);
          return;
      }
    
      try {
        const response = await retrieveUserPublicKeyAPI(owner)
        
        // Hashed passphrase and public key
        const publicKey = response.data.publicKey;
        const hashedPassphrase = user.passphrase[0];

        const data = await encryptPassphrase(publicKey, hashedPassphrase);

        // Check if the data is not null
        if (!data) {
          console.error('Failed to encrypt passphrase');
          return;
        }

        // Get the encrypted passphrase from the response
        const encryptedPassphrase = data.encrypted_passphrase;

        console.log('Encrypted Passphrase:', encryptedPassphrase);
        setEncryptedPassphrase(encryptedPassphrase);
        await addUser();
        // setUserAdded(true);
      } catch (error) {
        console.log('Error fetching public key:', error);
        setErrorMessage(error.response.data.message)
      }
    }
  };

  // Set the passphrase state when the session passphrase changes
  useEffect(() => { 
    if (sessionPassphrase !== null) {
      console.log("not null")
      setPassphrase(sessionPassphrase);
      setPassphraseEntered(true);
  } else {
      setPassphrase('')
      setPassphraseEntered(false);
  }}, [sessionPassphrase]);

  // Check if the user is the owner of the file
  useEffect(() => { 
    if (folderPath !== "Personal" && folderPath !== "Shared") {
      if (user.username === uniqueOwnersList[0]) {
        console.log("is owner")
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    } else {
        if (user.username === owners[0]) {
          console.log("is owner")
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      }
  }, [user.username, uniqueOwnersList, folderPath, owners]);
  
  // Toggle checked owners
  const toggleChecked = (owner) => {
    if (checkedOwners.includes(owner)) {
      setCheckedOwners(checkedOwners.filter((checked) => checked !== owner));
    } else {
      setCheckedOwners([...checkedOwners, owner]);
    }
  };

  // Add user to the file
  const addUser = async () => {
    try {
      for (const file of filteredFiles) {
        let userData;
        // If user is sharing a Personal or Shared File
        if (folderPath === 'Personal' || folderPath === 'Shared') {
          userData = {
            id: selectedId,
            owners: [...file.owners, owner],
            folder: "Shared",
          };
        // If a user is sharing an individual file in a folder than isn't Personal or Shared
        } else if (setPath !== null && pathname !== '/folder/personal' && pathname !== '/folder/Shared') {
          userData = {
            id: file.id,
            owners: [...file.owners, owner],
            folder: setPath,
          };
        // If a user is sharing a folder
        } else if (setInFolder === true) {
          userData = {
            id: file.id,
            owners: [...file.owners, owner],
            folder: setPath,
          };
        } else {
        // If a user is sharing a file in a folder
          userData = {
            id: filteredFiles,
            owners: [...file.owners, owner],
            folder: folderPath,
          };
        }
        await API.graphql(graphqlOperation(updateFile, { input: userData }));
      }
    } catch (err) {
      console.log('error adding file:', err);
    }
  };

  return (
    // Dialog
    <Dialog onClose={handleClose} open={open}>
      <div className="login-block">
        {/* Form */}
        <form onSubmit={handleSubmit(formSubmit)}>
          {/* Logo */}
          <img 
              className='form-logo'
              alt="fileflo"
              src={require("../../assets/filefloicon-removebg-preview.png")}
            />
            <Typography
              sx={{ 
                fontFamily: "space-grotesk, monospace",
                color: "white",
                fontSize: "20px",
                textAlign: "center",
                paddingBottom:"8px",
                fontWeight: "bold"
              }}
            >
              Shared Users
            </Typography>
            {/* List of users */}
            <List sx={{ pt: 0 }}>
            {setInFolder ? (
              uniqueOwnersList.map((owner, index) => (
                // Render a list item for each unique owner
                <ListItem key={index} disableGutters>
                  <ListItemButton className='ListItem'>
                    <ListItemAvatar>
                      <Avatar className='Avatar' sx={{ bgcolor: "#333333", color: blue[600] }}>
                        <PersonIcon sx={{ width: "75% !important", marginLeft: "20px" }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#FFFFFF',
                            fontFamily: "space-grotesk, monospace",
                            fontSize: 18
                          }}
                        >
                          {owner}
                        </Typography>
                      }
                    />
                    {/* Render the crown icon for the first owner */}
                    {index === 0 && <AiFillCrown />}
                    {/* Render either a checked or unchecked icon for other owners based on their checked status */}
                    {index >= 1 &&
                      (checkedOwners.includes(owner) ? (
                        <CheckCircleIcon onClick={() => toggleChecked(owner)} />
                      ) : (
                        <RadioButtonUncheckedIcon onClick={() => toggleChecked(owner)} />
                      ))}
                  </ListItemButton>
                </ListItem>
              ))
            ) : // remove duplicate owners from the list
              selectedValue && 
              Array.from(new Set(selectedValue)).map((owner, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemButton className='ListItem'>
                    <ListItemAvatar>
                      <Avatar className='Avatar' sx={{ bgcolor: "#333333", color: blue[600] }}>
                        <PersonIcon sx={{ width: "75% !important", marginLeft: "20px" }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#FFFFFF',
                            fontFamily: "space-grotesk, monospace",
                            fontSize: 18
                          }}
                        >
                          {owner}
                        </Typography>
                      }
                    />
                    {/* Render the crown icon for the first owner */}
                    {index === 0 && <AiFillCrown />}
                    {/* Render either a checked or unchecked icon for other owners based on their checked status */}
                    {index >= 1 && <RadioButtonUncheckedIcon />}
                  </ListItemButton>
                </ListItem>
              ))
            }
            {/* owner input */}
            <label className='label'>Username</label>
            <div className='input-container'>
              <AddIcon className='icon'/>
              <input
                {...register("owner")}
                id="share-with"
                type="text"
                value={owner}
                placeholder='Joao'
                onChange={(event) => setOwner(event.target.value)}
              />
            </div>
            { /* if folder not Personal or Shared */ }
            {folderPath !== "Personal" && folderPath !== "Shared" ?
              (
                <div>
                  <label className='label'>Enter Folder Passphrase</label>
                  <div className='input-container'>
                    <KeyIcon className='icon'/>
                    <input
                      {...register("folderPassphrase")}
                      value={folderPassphrase}
                      onChange={data => setFolderPassphrase(data.target.value)}
                      type={inputType}
                      placeholder='Cat Dog Duck'
                    />
                    {inputType === 'password' ? (
                      <VisibilityIcon className="togglePassword" onClick={togglePasswordVisibility}>
                        Show
                      </VisibilityIcon>
                    ) : (
                      <VisibilityOffIcon className="togglePassword" onClick={togglePasswordVisibility}>
                        Hide
                      </VisibilityOffIcon>
                    )}
                  </div>
                </div>
              ) : (null)
            }
            { /* Display encrypted passphrase */ }
            {!encryptedPassphrase || userAdded ? null : (
              <Box style={{
                  border: '1px solid #262626',
                  borderRadius: '5px',
                  width: '100%',
                  backgroundColor: '#404040',
                  wordWrap: 'break-word',
                  padding: '10px',
                  paddingTop: '20px',
              }}>
                  <Typography sx={{color: "#bebebe", padding: "10px", fontFamily: "space-grotesk, monospace", fontSize: "14px"}}>Here is the encrypted passphrase for this file. <Typography sx={{display: "inline", fontWeight: "bold", color: "white", padding: "10px", fontFamily: "space-grotesk, monospace", fontSize: "14px"}} >{owner}</Typography> will need to acquire it in order to be able to download this file</Typography>
                  <Button sx={{color: "white"}} aria-describedby={id} variant="contained" onClick={handleClick}>
                      Display Encrypted Passphrase
                  </Button>
                  <Popover
                      sx={{color: "blue", width: "25%", maxWidth: "40%"}}
                      id={id}
                      open={openPop}
                      anchorEl={anchorEl}
                      onClose={handleClosePop}
                      anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                      }}>
                      <ContentCopyIcon 
                          sx={{
                              color: "gray", 
                              cursor: "pointer", 
                              position: "absolute", 
                              marginTop: "10px"
                              }}
                          onClick={copyToClipboard}>
                      </ContentCopyIcon>
                      <Typography 
                          ref={textRef}
                          sx={{
                              p: 2, 
                              fontFamily: "space-grotesk, monospace", 
                              paddingTop: "30px",
                              fontSize: "12px",
                              color: "#bebebe", 
                              backgroundColor: "#333333",
                              overflow: "hidden",
                              maxWidth: "100%", // Set the maxWidth to 100%
                              wordWrap: "break-word", // Ensure the text wraps to the next line
                              }}>
                          {encryptedPassphrase}
                      </Typography>
                  </Popover>
              </Box>
            )}
            {/* passphrase input if sessionPassphrase is not null */}
            {sessionPassphrase ? null : (
            <div>
              <label className='label'>Enter Passphrase</label>
              <div className='input-container'>
                <KeyIcon className='icon'/>
                <input
                  {...register("passphrase")}
                  value={passphrase === '7WyCKRT3nSnH7fT' ? '' : passphrase}
                  onChange={data => setPassphrase(data.target.value)}
                  type={inputType}
                  placeholder='Cat Dog Duck'
                />
                {inputType === 'password' ? (
                  <VisibilityIcon className="togglePassword" onClick={togglePasswordVisibility}>
                    Show
                  </VisibilityIcon>
                ) : (
                  <VisibilityOffIcon className="togglePassword" onClick={togglePasswordVisibility}>
                    Hide
                  </VisibilityOffIcon>
                )}
              </div>
            </div>
          )}
          {/* add and cancel button */}
          {isOwner ? (
            <button
              className='Add-User'
              type="submit" 
            >
            Add User
            </button>
          ) : null}
            <button
              className='Cancel-Button'
              value="Register"
              onClick={async () => handleClose()}
            >
            Close    
            </button>
            </List>
        </form>
        {/* Error and success messages */}
        {errorMessage && <p className="errorResponsePassphrase">{errorMessage}</p>}
        {successMessage && <p className="errorResponsePassphrase">{successMessage}</p>}
      </div>
    </Dialog>
  );
}

// Prop Types
UserDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
  };

export default UserDialog;