// Built-in imports
import React, { useState, useEffect, createContext } from 'react';

// External imports
import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiFillCrown } from 'react-icons/ai';
import '@fontsource/space-grotesk';

// Material UI imports
import {
  Breadcrumbs,
  Box,
  Card,
  CardActions,
  CardContent,
  createTheme,
  FormControl,
  Grid,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';

// Internal imports
import awsconfig from '../../aws-exports';
import { deleteFile } from '../../graphql/mutations';
import {
  onCreateFile,
  onUpdateFile,
  onDeleteFile,
} from '../../graphql/subscriptions';
import { listFiles } from '../../graphql/queries';
import getFileIcon from '../../components/FileIcons/FileIcons';
import NoFile from '../../components/NoFiles/NoFile';
import SortFiles from '../../components/SortFiles/SortFiles';
import { UploadContainer } from '../../components/UploadFile/Container';
import { DownloadContainer } from '../../components/PassPhrase/Container';
import HelpDrawer from '../../components/HelpDrawer/HelpDrawer';
import { FolderCreate } from '../../components/FolderCreate/Container';
import UserDialog from '../../components/FileUsers/UserDialog';
import { getUser } from '../../service/AuthService';
import './Upload.css';

Amplify.configure(awsconfig);

export const CommunityContext = createContext({
  availableGroups: [],
  refreshGroups: () => null,
});

const Upload = (props) => {
  // Props
  const { sortType } = props;
  // State variables
  const navigate = useNavigate();
  const [, setOwners] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [, setEncryptedVal] = useState('');
  const [folders, setFolders] = useState([]);
  const [path, setPath] = useState('');
  const [filter, setFilter] = useState([]);
  const [inFolder, setInFolder] = useState('');
  const [sortValue, setSortValue] = useState(null);
  const [hoveredFileId, setHoveredFileId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const user = getUser();
  const [Files, setFiles] = useState([]);
  const [currentUser, setCurrentUser] = useState('');

  // Get the current path
  const { pathname } = useLocation();
  const folderName = pathname.split('/')[2];
  // Filter files by folder
  const filteredFiles = Files.filter(
    (file) => file.folder && file.folder.includes(folderName)
  );

  // Get unique folders
  const uniqueFolders = new Set(
    folders.filter((folder) => folder !== null).flat()
  );

  // Fetching files and setting up subscriptions
  useEffect(() => {
    // Get the current user
    const getCurrentUser = async (file) => {
      try {
        setCurrentUser(await Auth.currentAuthenticatedUser());
      } catch (err) {
        console.log(err);
        return false;
      }
    };

    getCurrentUser();

    const subscriptionFilter = { filter: {} };

    const fetchFiles = async () => {
      const result = await API.graphql(graphqlOperation(listFiles));
      setFiles(result.data.listFiles.items);
      setOwners(result.data.listFiles.items.map((item) => item.owners));
      const folders = result.data.listFiles.items.map((item) => item.folder);
      setFolders(folders);
    };

    fetchFiles();

    // Subscriptions
    const createSub = API.graphql(
      graphqlOperation(onCreateFile, subscriptionFilter)
    ).subscribe({
      next: ({ value }) => {
        setFiles((Files) => [...Files, value.data.onCreateFile]);
      },
    });

    const updateSub = API.graphql(
      graphqlOperation(onUpdateFile, subscriptionFilter)
    ).subscribe({
      next: ({ value }) => {
        setFiles((Files) => {
          const toUpdateIndex = Files.findIndex(
            (item) => item.id === value.data.onUpdateFile.id
          );
          // If the File doesn't exist, treat it like an "add"
          if (toUpdateIndex === -1) {
            return [...Files, value.data.onUpdateFile];
          }
          return [
            ...Files.slice(0, toUpdateIndex),
            value.data.onUpdateFile,
            ...Files.slice(toUpdateIndex + 1),
          ];
        });
      },
    });

    const deleteSub = API.graphql(graphqlOperation(onDeleteFile)).subscribe({
      next: ({ value }) => {
        setFiles((Files) => {
          const toDeleteIndex = Files.findIndex(
            (item) => item.id === value.data.onDeleteFile.id
          );
          return [
            ...Files.slice(0, toDeleteIndex),
            ...Files.slice(toDeleteIndex + 1),
          ];
        });
      },
    });
    // Clean up subscriptions
    return () => {
      createSub.unsubscribe();
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, []);

  // Handle folder click
  const handleFolderClick = (folder) => {
    navigate(`/folder/${folder}`, { replace: true });
  };
  const triggerText = 'Upload File';
  const onSubmit = (event) => {
    event.preventDefault(event);
  };

  // User dialog handler
  const handleClickOpen = (owners, id, value) => {
    setInFolder(false);
    setSelectedValue(owners);
    setSelectedId(id);
    setPath(value);
    setOpen(true);
  };

  // User dialog handler for groups
  const handleClickOpenGroups = (value) => {
    setInFolder(true);
    setFilter(
      Files.filter((file) => file.folder && file.folder.includes(value))
    );
    setPath(value);
    setOpen(true);
  };

  // Check if user is owner
  const checkAccess = (user, owners) => {
    if (owners.length > 0 && owners[0] === user) {
      return true;
    }
    return false;
  };

  // User dialog handler
  const handleClose = (value) => {
    setOpen(false);
    setEncryptedVal(value);
  };

  // Sort handler
  const handleSortChange = (value) => {
    setSortValue(value);
  };

  // Filter handler
  const fileFilter = (File) =>
    File.name !== null &&
    (File.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      File.fileName.toLowerCase().includes(searchValue.toLowerCase()));

  // Sort handler
  const fileSort = (a, b) => {
    // Sort alphabetically by File.name
    if (sortValue === 10) {
      return a.name.localeCompare(b.name);
    }
    // Sort by File.createdAt in ascending order
    else if (sortValue === 20) {
      return a.fileName.localeCompare(b.fileName);
    }
    // Sort by File.createdAt in ascending order
    else if (sortValue === 30) {
      const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(year, month - 1, day);
      };
      return (
        parseDate(a.createdAt.split('\n')[1]) -
        parseDate(b.createdAt.split('\n')[1])
      );
    }
    // Sort by File.createdAt in descending order
    else if (sortValue === 40) {
      const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(year, month - 1, day);
      };
      return (
        parseDate(b.createdAt.split('\n')[1]) -
        parseDate(a.createdAt.split('\n')[1])
      );
    }
    // do nothing
    else {
      return 0;
    }
  };

  // Theme for select
  const theme = createTheme({
    components: {
      MuiList: {
        styleOverrides: {
          backgroundColor: 'blue',
        },
      },
    },
  });

  return (
    <div>
      {/* User dialog component*/}
      <UserDialog
        setFilter={filter}
        selectedValue={selectedValue}
        selectedId={selectedId}
        open={open}
        onClose={handleClose}
        owners={selectedValue}
        setPath={path}
        setFiles={Files}
        setInFolder={inFolder}
      >
        {' '}
      </UserDialog>

      {/* Main container */}
      <div className="app__container">
        {/* Left side container */}
        <div className="folder-container">
          <Typography
            sx={{ fontFamily: 'space-grotesk, monospace', fontSize: 29 }}
          >
            Folders
          </Typography>
          {/* Folder create component*/}
          <FolderCreate triggerText={'Create Folder'} onSubmit={onSubmit} />
          {/* Folder list */}
          <List
            className="folder-list"
            sx={{
              width: '100%',
              maxWidth: '100%',
              backgroundColor: '#2f3031',
              borderRadius: '5px',
              ':hover': {
                boxShadow: 20,
              },
            }}
          >
            {/* Personal folder */}
            <ListItem disableGutters>
              <PersonIcon sx={{ left: '12px' }} />
              <ListItemText
                sx={{ cursor: 'pointer' }}
                primary={'Personal'}
                onClick={() => handleFolderClick('Personal')}
              />
            </ListItem>

            {/* Shared folder */}
            <ListItem disableGutters>
              <FolderSharedOutlinedIcon />
              <ListItemText
                sx={{ cursor: 'pointer' }}
                primary={'Shared'}
                onClick={() => handleFolderClick('Shared')}
              />
            </ListItem>

            {/* Folder select component*/}
            <ThemeProvider theme={theme}>
              <Box>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      color: 'white',
                      fontFamily: 'space-grotesk monospace',
                      fontSize: '16px',
                    }}
                  >
                    Folders
                  </InputLabel>
                  <Select
                    sx={{
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: '#color',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9933ff',
                        borderWidth: '0.15rem',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9933ff',
                      },
                      cursor: 'pointer',
                    }}
                    className="select"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                  >
                    {/* Map over unique folders */}
                    {[...uniqueFolders]
                      .filter(
                        (value) =>
                          value !== null &&
                          value !== 'Personal' &&
                          value !== 'Shared'
                      )
                      .sort((a, b) =>
                        a.localeCompare(b, 'en', { sensitivity: 'case' })
                      )
                      .map((value) => (
                        <div>
                          <FolderIcon
                            sx={{
                              position: 'relative',
                              marginBottom: '-35px',
                            }}
                          />
                          <MenuItem
                            sx={{
                              fontSize: '16px',
                              fontFamily: 'space-grotesk, monospace',
                              backgroundColor: '#2f3031',
                              color: 'white',
                              position: 'relative',
                              marginBottom: '-21px',
                              paddingLeft: '45px',
                              width: '80%',
                            }}
                            value={value}
                            onClick={() => handleFolderClick(value)}
                          >
                            {value}
                            <Tooltip
                              placement="top"
                              sx={{ fontFamily: 'space-grotesk' }}
                              title={
                                <Typography
                                  sx={{
                                    fontSize: '12px',
                                    fontFamily: 'space-grotesk',
                                  }}
                                >
                                  Users
                                </Typography>
                              }
                            >
                              <GroupsIcon
                                sx={{
                                  cursor: 'pointer',
                                  position: 'absolute',
                                  marginLeft: '300px',
                                }}
                                onClick={() => {
                                  setPath(value);
                                  handleClickOpenGroups(value);
                                }}
                              />
                            </Tooltip>
                          </MenuItem>
                        </div>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </ThemeProvider>
          </List>
        </div>
        {/* Right side container */}
        <div className="upload-container">
          {/* Breadcrumbs */}
          <Breadcrumbs
            aria-label="breadcrumb"
            separator=">"
            sx={{
              color: '#9933ff',
              fontSixe: '18px',
              paddingBottom: 1.5,
            }}
          >
            <Link
              sx={{ color: 'gray' }}
              style={{
                fontFamily: 'space-grotesk, monospace',
                fontSize: '28px',
                letterSpacing: '0.34px',
              }}
              underline="hover"
              color="inherit"
              href="/Home"
            >
              FILEFLO
            </Link>
            <Link
              sx={{ color: 'gray' }}
              style={{
                fontFamily: 'space-grotesk, monospace',
                fontSize: '28px',
              }}
              underline="hover"
              color="inherit"
              href="/material-ui/getting-started/installation/"
            >
              Folder
            </Link>
            <Typography
              sx={{
                color: 'white',
                fontSize: '28px',
                fontFamily: 'space-grotesk, monospace',
              }}
            >
              {folderName}
            </Typography>
          </Breadcrumbs>

          {/* Upload file component*/}
          <UploadContainer
            className="upload-button"
            triggerText={triggerText}
            onSubmit={onSubmit}
            setInFolder={setInFolder}
          />

          {/* Search and sort components */}
          <Box
            component="form"
            sx={{
              '& > :not(style)': { width: '15ch', height: '1.65ch' },
              marginLeft: '43.5%',
              paddingBottom: '35px',
              position: 'relative',
              top: '-4px',
              paddingLeft: '1%',
            }}
            noValidate
            autoComplete="off"
          >
            {/* Search for file component */}
            <Box sx={{ paddingLeft: '1%' }}>
              <TextField
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="search-file"
                id="standard-basic"
                label="Search for File"
                variant="standard"
                color="secondary"
                sx={{
                  input: {
                    color: 'white',
                    fontFamily: 'space-grotesk, monospace',
                  },
                  label: {
                    color: '#bebebe',
                    fontSize: 16,
                    fontFamily: 'space-grotesk, monospace',
                  },
                  variant: { color: 'white' },
                  marginLeft: '20%',
                  width: '90%',
                  marginTop: '4%',
                }}
              />
            </Box>
            {/* Sort files component */}
            <SortFiles
              sortTypeUpload={sortType}
              onSortValueChange={handleSortChange}
            ></SortFiles>
            {/* Help drawer component */}
            <HelpDrawer className="help"></HelpDrawer>
          </Box>

          {/* File list */}
          <Box>
            <Grid
              container
              spacing={2}
              style={{
                maxHeight: '100vh',
                overflowY: 'auto',
                overflowX: 'hidden',
                height: '950px',
                maxWidth: '299%',
                overflow: 'auto',
              }}
            >
              {/* No files component */}
              {!filteredFiles ? (
                <Grid
                  sx={{
                    marginBottom: '40%',
                    marginRight: '30%',
                  }}
                  container
                  spacing={1}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <NoFile />
                </Grid>
              ) : (
                filteredFiles
                  .filter(fileFilter)
                  .sort(fileSort)
                  .map((File) => {
                    return (
                      <Card
                        className="card"
                        item
                        xs={2.1}
                        key={File.id}
                        owners={File.owners}
                        onMouseEnter={() => setHoveredFileId(File.id)}
                        onMouseLeave={() => setHoveredFileId(null)}
                        sx={{
                          backgroundColor: '#2f3031',
                          position: 'relative',
                          margin: '10px',
                          marginBottom: '2px',
                          transition: 'opacity 0.3s ease-in-out',
                          ':hover': {
                            boxShadow: 20,
                          },
                        }}
                      >
                        {/* File card */}
                        <CardContent>
                          <Box
                            sx={{ position: 'relative', marginBottom: '-50px' }}
                          >
                            {getFileIcon(
                              File.fileName.split('.')[1],
                              File.fileName.split('.')[0]
                            )}
                          </Box>
                          <Typography
                            sx={{
                              marginLeft: '40px',
                              paddingTop: '25px',
                              fontSize: 12,
                              fontFamily: 'space-grotesk',
                              color: '#bebebe',
                            }}
                            color="text.secondary"
                            gutterBottom
                          >
                            {File.fileName}
                          </Typography>

                          {/* Check if user is owner and folder is not 
                          in Personal or Shared. If not display crown icon */}
                          {user.username === File.owners[0] &&
                          folderName !== 'Personal' ? (
                            <AiFillCrown
                              fontSize="20px"
                              color="#545658"
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                              }}
                            ></AiFillCrown>
                          ) : null}

                          {/* File name */}
                          <Typography
                            variant="h5"
                            component="div"
                            sx={{
                              fontSize: 24,
                              color: 'white',
                              textAlign: 'center',
                              fontFamily: 'space-grotesk, monospace',
                            }}
                          >
                            {File.name}
                          </Typography>

                          {/* File description */}
                          <Typography
                            sx={{
                              mb: 1.5,
                              fontSize: '14px',
                              textAlign: 'center',
                              color: 'white',
                            }}
                            color="text.secondary"
                          >
                            {File.description}
                          </Typography>

                          {/* File created at */}
                          <Typography
                            sx={{
                              mb: 0,
                              fontSize: '10px',
                              fontFamily: 'space-grotesk, monospace',
                              color: 'white',
                            }}
                            color="text.secondary"
                          >
                            Created:
                          </Typography>

                          {/* File created at time*/}
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 0,
                              fontSize: '10px',
                              fontFamily: 'space-grotesk, monospace',
                              color: '#bebebe',
                            }}
                            color="text.secondary"
                          >
                            {File.createdAt.split('\n')[1]}
                          </Typography>

                          {/* File created at date */}
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 1.5,
                              fontSize: '10px',
                              fontFamily: 'space-grotesk, monospace',
                              color: '#bebebe',
                            }}
                            color="text.secondary"
                          >
                            {File.createdAt.split('\n')[0]}
                          </Typography>
                        </CardContent>

                        {/* File card actions */}
                        <CardActions>
                          <Tooltip
                            placement="top"
                            sx={{
                              opacity: hoveredFileId === File.id ? 1 : 0,
                              fontFamily: 'space-grotesk',
                            }}
                            title={
                              <Typography
                                sx={{
                                  fontSize: '12px',
                                  fontFamily: 'space-grotesk',
                                }}
                              >
                                {' '}
                                Shared Users{' '}
                              </Typography>
                            }
                          >
                            {/* PersonIcon to display users */}
                            <PersonIcon
                              sx={{
                                position: 'relative',
                                height: '28px',
                                right: '-25px',
                                cursor: 'pointer',
                                opacity: hoveredFileId === File.id ? 1 : 0,
                                transition: 'opacity 0.2s ease-in-out',
                              }}
                              onClick={() =>
                                handleClickOpen(File.owners, File.id, null)
                              }
                            ></PersonIcon>
                          </Tooltip>

                          {/* Download component */}
                          <DownloadContainer
                            trigger={true}
                            selectedFileHash={File.hashValue}
                            selectedFileName={File.fileName}
                            owners={File.owners}
                            hoveredFileId={hoveredFileId}
                            FileId={File.id}
                            setInFolder={setInFolder}
                          ></DownloadContainer>

                          {/* Delete component */}
                          {checkAccess(currentUser.username, File.owners) ? (
                            <Tooltip
                              placement="top"
                              sx={{
                                opacity: hoveredFileId === File.id ? 1 : 0,
                                fontFamily: 'space-grotesk',
                              }}
                              title={
                                <Typography
                                  sx={{
                                    fontSize: '12px',
                                    fontFamily: 'space-grotesk',
                                  }}
                                >
                                  Delete
                                </Typography>
                              }
                            >
                              {/* Delete icon to delete file */}
                              <DeleteIcon
                                sx={{
                                  cursor: 'pointer',
                                  position: 'relative',
                                  height: '30px',
                                  marginBottom: '1px',
                                  marginRight: '-10px',
                                  right: '-0%',
                                  opacity: hoveredFileId === File.id ? 1 : 0,
                                  transition: 'opacity 0.2s ease-in-out',
                                }}
                                className="delete-icon"
                                onClick={async () => {
                                  API.graphql(
                                    graphqlOperation(deleteFile, {
                                      input: { id: File.id },
                                    })
                                  );
                                }}
                              />
                            </Tooltip>
                          ) : null}
                        </CardActions>
                      </Card>
                    );
                  })
              )}
            </Grid>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Upload;
