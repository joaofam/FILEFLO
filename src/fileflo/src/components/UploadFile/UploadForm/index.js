// Built-in Dependencies
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

// External Dependencies
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MdOutlineDescription, MdOutlineInfo } from 'react-icons/md';
import '@aws-amplify/ui-react/styles.css';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import awsconfig from '../../../aws-exports';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import Web3 from 'web3';

// Material-UI Dependencies
import { Typography, styled } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Internal Dependencies
import { getUser } from '../../../service/AuthService';
import { enterPassphrase } from '../../../utils/API/enterPassphrase.js';
import { folderPassphraseCheck } from '../../../utils/API/folderPassphraseCheck.js';
import { postEncryptedFile } from '../../../utils/API/Flask/encryptFile';
import FileUpload from './FileUpload';
import FileList from './FileList';
import '../../../utils/CSS/Container.css';
import { createFile } from '../../../graphql/mutations';
import FileMetadata from '../../../build/FileMetadata.json';

Amplify.configure(awsconfig);

// Progress Bar sytling
const Progress = styled(LinearProgress)(({ theme }) => ({
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#9933ff',
  },
}));

const projectId = process.env.REACT_APP_PROJECT_ID;
const projectSecretKey = process.env.REACT_APP_PROJECT_KEY;
const authorization = 'Basic ' + btoa(projectId + ':' + projectSecretKey);

const schema = z.object({
  name: z.string().min(1, 'Upload Name is required'),
});

export const Form = (props, ffile, setInFolder) => {
  // State Variables
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [setFile] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [, setHash] = useState('');
  const [encryptedVal, setEncryptedVal] = useState('');
  const { pathname } = useLocation();
  const folderPath = pathname.split('/')[2];
  const [isSubmitting, setIsSubmitting] = useState(false); // new state
  const [passphrase, setPassphrase] = useState('');
  const [folderPassphrase, setFolderPassphrase] = useState('');
  const [encryptedPassphrase, setEncryptedPassphrase] = useState('');
  const [inputType, setInputType] = useState('password');
  const [errorMessage, setErrorMessage] = useState('');
  const [, setPassphraseEntered] = useState(false);
  const [blockchainUpload, setBlockchainUpload] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const user = getUser();
  const sessionPassphrase = sessionStorage.getItem('personalPassphrase');

  const ipfs = ipfsHttpClient({
    url: 'https://ipfs.infura.io:5001/api/v0',
    headers: {
      authorization,
    },
  });

  // Initialize the web3 instance
  const web3 = useMemo(() => {
    return new Web3('https://sepolia.infura.io/v3/7720f63fce8443e5b85e0acc7356c0cf');
  }, []);

  // Initialize the contract instance
  const networkId = '11155111';
  const contractABI = FileMetadata.abi;
  const contractAddress = FileMetadata.networks[networkId].address;
  const contract = useMemo(() => {
    return new web3.eth.Contract(contractABI, contractAddress);
  }, [web3, contractABI, contractAddress]);
  

  // Upload metadata to the blockchain function
  const uploadMetadataToBlockchain = useCallback(async (metadata) => {
    console.log('Uploading metadata to the blockchain...');
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    const data = contract.methods
      .addMetadata(
        metadata.fileName,
        metadata.fileType,
        metadata.fileSize,
        metadata.ipfsHash
      )
      .encodeABI();

    const gas = await contract.methods
      .addMetadata(
        metadata.fileName,
        metadata.fileType,
        metadata.fileSize,
        metadata.ipfsHash
      )
      .estimateGas({ from: account.address });

    const gasPrice = web3.utils.toWei('2', 'gwei');
    const tx = {
      from: account.address,
      to: contractAddress,
      gas,
      gasPrice,
      data,
    };

    console.log('Signing the transaction...');
    const signedTx = await account.signTransaction(tx);
    console.log('Sending the signed transaction...');
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }, [contract, contractAddress, web3]);

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  // useForm handler
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // handle submission status
  useEffect(() => {
    if (blockchainUpload) {
      setIsSubmitting(false);
    }
  }, [blockchainUpload]);

  // Submit Handler
  const submitHandler = async (data) => {
    // Validate the form
    // Check if the data.name is entered
    if (!data.name) {
      setErrorMessage('Upload Name should not be empty');
      return;
    }
    // Check if the name is entered
    if (name.trim() === '') {
      return;
    }
    setErrorMessage('');
    // Check if the passphrase is entered
    if (passphrase.trim() === '') {
      setErrorMessage('Passphrase should not be empty');
      return;
    }

    // Check if the folder passphrase is entered
    const error = await enterPassphrase(passphrase);
    if (error) {
      setErrorMessage(error);
      return;
    }

    // Check folder passphrase if folder is not 'Personal' or 'Shared'
    if (folderPath !== 'Personal' && folderPath !== 'Shared') {
      const response = await folderPassphraseCheck(
        user.username,
        folderPath,
        folderPassphrase
      );
      if (response.error) {
        setErrorMessage(response.error);
        return;
      }
      const encryptedPassphrase = response.passphrase.split(' : ')[1];
      setEncryptedPassphrase(encryptedPassphrase);
    } else {
      setEncryptedPassphrase(user.passphrase[0]);
    }
    setIsReady(true);
  };

  // Remove file handler
  const removeFile = (filename) => {
    setFiles(files.filter((file) => file.name !== filename));
  };

  // Add file handler
  const addFile = useCallback(async (file) => {
    // Encrypt the file
    console.log('Encrypting the file...');
    const responseData = await postEncryptedFile(file, encryptedPassphrase);
    if (!responseData) {
      console.error('Failed to post encrypted file');
      return;
    }


    const encryptedData = responseData.data.hex_data;
    console.log('File encrypted successfully.');

    // Upload the encrypted file to IPFS
    console.log('Uploading the encrypted file to IPFS...');
    const result = await ipfs.add(encryptedData);
    console.log('File uploaded to IPFS successfully:', result);
    
    // Set the uploaded images
    setUploadedImages([
      ...uploadedImages,
      {
        cid: result.cid,
        path: result.path,
      },
    ]);

    let today = new Date();
    let date =
      today.getHours() +
      ':' +
      today.getMinutes() +
      ':' +
      today.getSeconds() +
      '\n' +
      today.getDate() +
      '/' +
      parseInt(today.getMonth() + 1) +
      '/' +
      today.getFullYear();

    // Set the hash and encrypted value
    await Promise.all([setHash(result.path), setEncryptedVal(encryptedData)]);
    const currentHash = result.path;
    console.log('IPFS hash:', currentHash);

    // Add file to the database
    try {
      const fileData = {
        fileName: files[0].name,
        hashValue: currentHash,
        name: name,
        description: description,
        createdAt: date,
        updatedAt: 'updatedAt',
        folder: pathname === '/upload' ? 'personal' : folderPath,
      };
      await API.graphql(graphqlOperation(createFile, { input: fileData }));

      // Upload metadata to the blockchain
      console.log('Uploading metadata to the blockchain...');
      const metadata = {
        fileName: name,
        fileType: file.type,
        fileSize: file.size,
        ipfsHash: currentHash,
      };
      console.time('blockchainUpload');

      // Upload metadata to the blockchain
      const blockchainResult = await uploadMetadataToBlockchain(metadata);
      if (blockchainResult) {
        console.timeEnd('blockchainUpload');
        console.log(
          'File metadata uploaded to the blockchain successfully.',
          blockchainResult
        );
        setBlockchainUpload(true);
      }
    } catch (err) {
      console.log('error adding file:', err);
    }
  }, [encryptedPassphrase, ipfs, uploadedImages, files, name, description, pathname, folderPath, uploadMetadataToBlockchain]);

  // Passphrase handler
  useEffect(() => {
    if (sessionPassphrase !== null) {
      console.log('not null');
      setPassphrase(sessionPassphrase);
      setPassphraseEntered(true);
    } else {
      setPassphrase('');
      setPassphraseEntered(false);
    }
  }, [sessionPassphrase]);

  // Prepare progress bar
  useEffect(() => {
    const proceedWithFileAddition = async () => {
      if (isReady && encryptedPassphrase) {
        setIsSubmitting(true);
        delete files[0]['isUploading'];
        await addFile(files[0]);
        setTimeout(() => {
          setIsSubmitting(false);
        }, 3000);
        setIsReady(false); // Reset the state after the process is completed
      }
    };
    proceedWithFileAddition();
  }, [addFile, isReady, encryptedPassphrase, files]);

  return (
    <div className="form-block">
      <form onSubmit={handleSubmit(submitHandler)}>
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
          Upload a File
        </Typography>

        {/* Upload File */}
        <label className="label" htmlFor="fileUpload">Upload File</label>
        <FileUpload
          id="fileUpload"
          encryptedValue={encryptedVal}
          type="file"
          files={files}
          setFiles={setFiles}
          removeFile={removeFile}
          onChange={(data) => setFile(data.target.value)}
        />

        {/* Display the file list */}
        <FileList files={files} removeFile={removeFile} />

        {/* file name input */}
        <label className="label">Choose a Name for Upload</label>
        <div className="input-container">
          <MdOutlineDescription className="icon" />
          <input
            {...register('name')}
            value={name}
            onChange={(data) => setName(data.target.value)}
            type="text"
            placeholder="Analytical Report on Machine Learning"
          />
        </div>
        <div className="errorResponse">{errors.name?.message}</div>
        
        {/* file description input */}
        <label className="label">File Description </label>
        <label className="label-optional">(Optional)</label>
        <div className="input-container">
          <MdOutlineInfo className="icon" />
          <input
            {...register('description')}
            type="text"
            value={description}
            placeholder="This file contains such and such"
            onChange={(data) => setDescription(data.target.value)}
          />
        </div>
        {sessionPassphrase ? null : (
          <div>
            {/* passphrase input */}
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
          </div>
        )}
        {/* If folder not in Personal and not in Shared */}
        {folderPath !== 'Personal' && folderPath !== 'Shared' ? (
          <div>
            {/* folder passphrase input */}
            <label className="label">Enter Folder Passphrase</label>
            <div className="input-container">
              <KeyIcon className="icon" />
              <input
                {...register('folderPassphrase')}
                value={folderPassphrase}
                onChange={(data) => setFolderPassphrase(data.target.value)}
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
          </div>
        ) : null}

        <button className="submit-button" type="submit">
          {isSubmitting ? (
            <Progress sx={{ backgroundColor: 'white' }} />
          ) : (
            'Upload'
          )}
        </button>
      </form>
      {/* Error Message */}
      {errorMessage && (
        <p className="errorResponsePassphrase">{errorMessage}</p>
      )}
    </div>
  );
};

export default Form;
