// Built-in imports
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// External imports
import Web3 from 'web3';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Amplify } from 'aws-amplify';

// Material-UI imports
import { Typography } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Internal imports
import awsconfig from '../../../aws-exports';
import FileMetadata from '../../../build/FileMetadata.json';
import { getUser, getToken } from '../../../service/AuthService';
import { confirmPassphrase } from '../../../utils/API/confirmPassphrase';
import { folderPassphraseCheck } from '../../../utils/API/folderPassphraseCheck';
import { decryptPassphrase } from '../../../utils/API/Flask/decryptPassphrase';
import { retrievePrivateKeyAPI } from '../../../utils/API/retrievePrivateKey';
import { decryptFile } from '../../../utils/API/Flask/decryptFile';
import '../../../utils/CSS/Container.css';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsconfig);

const ipfsFileURL = 'https://cloudflare-ipfs.com/ipfs/';
  
// Zod schema for form validation
const schema = z.object({
  passphrase: z.string().min(0, 'Upload Name is required'),
});

// Form Component
export const Form = (props) => {
  // Props
  const { selectedFileHash, owners } = props;

  // State Variables
  const [passphrase, setPassphrase] = useState('');
  const [inputType, setInputType] = useState('password');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [encryptedPassphrase, setEncryptedPassphrase] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [ownerPassphrase, setOwnerPassphrase] = useState('');
  const [folderPassphrase, setFolderPassphrase] = useState('');

  const user = getUser();
  const token = getToken();
  const userPassphrase = sessionStorage.getItem('personalPassphrase');
  // const fileType = selectedFileName.split('.').pop();
  const { pathname } = useLocation();
  const folderPath = pathname.split('/')[2];

  const formData = new FormData();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  const { register } = useForm({
    resolver: zodResolver(schema),
  });

  // Retrieve the user's private key from the database
  const getUserPrivateKey = useCallback(async () => {
    const privateKey = await retrievePrivateKeyAPI(
      user.username,
      process.env.API_KEY
    );
    if (!privateKey) {
      console.error('Failed to get user private key');
      return;
    }
    setPrivateKey(privateKey);
  }, [user.username]);

  useEffect(() => {
    if (!isOwner) {
      getUserPrivateKey();
    }
  }, [isOwner, getUserPrivateKey]);

  const automaticFileDownload = async (
    ipfsHash,
    newFilename,
    fileType,
    updatedFolderPassphrase
  ) => {
    try {
      // Confirm passphrase
      const response = await confirmPassphrase(user.username, 'test');
  
      // Check if the response is not null
      if (!response) {
        console.error('Failed to confirm passphrase');
        return;
      }
  
      // Fetch file from IPFS
      const IPFSresponse = await fetch(ipfsFileURL + ipfsHash);
      const IPFSdata = await IPFSresponse.text();
      formData.append('hex_data', IPFSdata);
  
      // Determine the final passphrase to use for decryption
      let finalPassphrase;
      if (isOwner) {
        finalPassphrase = user.passphrase[0];
      } else {
        finalPassphrase = ownerPassphrase;
      }
      if (folderPath !== 'Personal' && folderPath !== 'Shared') {
        finalPassphrase = updatedFolderPassphrase;
      }
  
      // Decrypt the file
      const flaskResponse = await decryptFile(finalPassphrase, fileType);
  
      // Convert the decrypted bytes to a file and initiate the download
      const blob = new Blob([flaskResponse.data], { type: `\${fileType}` });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = newFilename;
      link.click();
  
      // Update session storage and state
      sessionStorage.setItem('personalPassphrase', passphrase);
      sessionStorage.setItem('personalPassphrase', passphrase);
      setPassphrase(userPassphrase);
      console.log('token change', token);
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response.data.message);
    }
  };

  // Retrieve the IPFS hash from the smart contract
  const getFileIPFSHashFromBlockchain = async () => {
    try {
      const web3 = new Web3(
        new Web3.providers.HttpProvider(
          'https://sepolia.infura.io/v3/7720f63fce8443e5b85e0acc7356c0cf'
        )
      );

      // Get the contract ABI and address
      const contractABI = FileMetadata.abi;
      const networkId = '11155111';
      const contractAddress = FileMetadata.networks[networkId].address;
      const contractInstance = new web3.eth.Contract(
        contractABI,
        contractAddress
      );

      // Log the contract ABI and address
      console.log('Contract ABI:', contractABI);
      console.log('Contract Address:', contractAddress);

      console.log('selectedFileHash:', selectedFileHash);
      const accounts = await web3.eth.getAccounts();

      // Get the IPFS hash from the smart contract
      const ipfsHash = await contractInstance.methods
        .getMetadata(selectedFileHash)
        .call({ from: accounts[0], gas: 3000000 });
      console.log(ipfsHash);

      // Return the correct IPFS hash, new filename, and file type
      return {
        ipfsHash: ipfsHash[4],
        newFilename: ipfsHash[0],
        fileType: ipfsHash[1],
      };
    } catch (err) {
      console.log(err);
      setErrorMessage('Failed to retrieve IPFS hash from the smart contract');
      return null;
    }
  };

  // Check if the user is the owner of the file
  useEffect(() => {
    if (user.username === owners[0]) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [user.username, owners]);

  // Submit handler
  const submitHandler = async () => {
    if (folderPath !== 'Personal' && folderPath !== 'Shared') {
      if (folderPassphrase.trim() === '') {
        setErrorMessage('Passphrase should not be empty');
        return;
      }
      setErrorMessage(null);
      const folderPassphraseCheckResponse = await folderPassphraseCheck(
        user.username,
        folderPath,
        folderPassphrase
      );
      let updatedFolderPassphrase = folderPassphrase;
      if (folderPassphraseCheckResponse === false) {
        setErrorMessage('Passphrase is incorrect');
        return;
      } else {
        updatedFolderPassphrase =
          folderPassphraseCheckResponse.passphrase.split(' : ')[1];
        console.log('UPDATEDFOLDERPASSPHRASE', updatedFolderPassphrase);
      }
      setErrorMessage(null);
      const fileMetadata = await getFileIPFSHashFromBlockchain();
      if (fileMetadata) {
        automaticFileDownload(
          fileMetadata.ipfsHash,
          fileMetadata.newFilename,
          fileMetadata.fileType,
          updatedFolderPassphrase
        );
      }
    } else {
      if (passphrase.trim() === '') {
        setErrorMessage('Passphrase should not be empty');
        return;
      }
      setErrorMessage(null);
      const fileMetadata = await getFileIPFSHashFromBlockchain();
      if (!isOwner) {
        const data2 = {
          private_key: privateKey,
          encrypted_passphrase: encryptedPassphrase,
        };
        console.log(data2);
        
        // Send the hashed passphrase and public key to the Flask backend
        const decryptedPassphraseData = await decryptPassphrase(privateKey, encryptedPassphrase);
        
        // Check if the decryptedPassphraseData is not null
        if (!decryptedPassphraseData) {
          console.error('Failed to decrypt passphrase');
          return;
        }
        
        // Get the encrypted passphrase from the response
        const decryptedPassphrase = decryptedPassphraseData.decrypted_passphrase;
        console.log('DecryptedPassphrase:', decryptedPassphrase);
        setOwnerPassphrase(decryptedPassphrase.decrypted_passphrase);
        if (fileMetadata) {
          automaticFileDownload(
            fileMetadata.ipfsHash,
            fileMetadata.newFilename,
            fileMetadata.fileType
          );
        }
      } else {
        if (fileMetadata) {
          automaticFileDownload(
            fileMetadata.ipfsHash,
            fileMetadata.newFilename,
            fileMetadata.fileType
          );
        }
      }
    }
  };

  return (
    <div>
      <div className="form-block">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitHandler(event);
          }}
        >
          {/* Logo */}
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
            Download File
          </Typography>
          {/* If folder not Personal and not Shared */}
          {folderPath !== 'Personal' && folderPath !== 'Shared' ? (
            <>
              <div className="text-content">
                To download this file please enter the passphrase that
                corresponds to this folder.
              </div>
              <div>
                {/* Folder Passphrase */}
                <label className="label">Enter Folder Passphrase</label>
                <div className="input-container">
                  <KeyIcon className="icon" />
                  <input
                    {...register('folderPassphrase')}
                    value={folderPassphrase}
                    onChange={(data) => setFolderPassphrase(data.target.value)}
                    type="password"
                    placeholder="Folder Passphrase"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-content">
                To download this file please enter the pass-phrase you have
                entered when creating this account.
              </div>
              {/* Passphrase */}
              <label className="label">Enter Passphrase</label>
              <div className="input-container">
                <KeyIcon className="icon" />
                <input
                  {...register('passphrase')}
                  value={passphrase === '7WyCKRT3nSnH7fT' ? '' : passphrase}
                  onChange={(data) => setPassphrase(data.target.value)}
                  type={inputType}
                  placeholder="Cat Dog Duck"
                />
                {inputType === 'password' ? (
                  <VisibilityIcon
                    className="togglePassword"
                    onClick={togglePasswordVisibility}
                  >
                    Show
                  </VisibilityIcon>
                ) : (
                  <VisibilityOffIcon
                    className="togglePassword"
                    onClick={togglePasswordVisibility}
                  >
                    Hide
                  </VisibilityOffIcon>
                )}
              </div>
            </>
          )}
          {/* If not owner or folder not in Shared or not in Personal */}
          {isOwner ||
          (folderPath !== 'Shared' && folderPath !== 'Personal') ? null : (
            <>
              <div>
                {/* Encrypted Passphrase */}
                <label className="label">Encrypted Passphrase</label>
                <div className="input-container">
                  <KeyIcon className="icon" />
                  <input
                    {...register('encryptedPassphrase')}
                    value={encryptedPassphrase}
                    onChange={(data) =>
                      setEncryptedPassphrase(data.target.value)
                    }
                    type="text"
                    placeholder="Cat Dog Duck"
                  />
                </div>
              </div>
              <div>
                {/* Private Key */}
                <label className="label">Private Key</label>
                <div className="input-container">
                  <KeyIcon className="icon" />
                  <input
                    {...register('privateKey')}
                    value={privateKey}
                    onChange={(data) => setPrivateKey(data.target.value)}
                    type="password"
                    placeholder="Paste your private key here"
                  />
                </div>
              </div>
            </>
          )}

          <button id="submit-button" className="submit-button" type="submit">
            Download
          </button>
        </form>
        {/* Error Message */}
        {errorMessage && (
          <p className="errorResponsePassphrase">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Form;
