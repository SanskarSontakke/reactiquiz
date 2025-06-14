// src/pages/FriendsPage.js
import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Alert, CircularProgress,
  List, ListItem, ListItemText, IconButton, Divider, Grid, Stack, useTheme,
  Tooltip 
} from '@mui/material';
import { darken } from '@mui/material/styles'; // Ensure darken is imported
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'; 

import { useNavigate } from 'react-router-dom';

import apiClient from '../api/axiosInstance';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog'; 


function FriendsPage({ currentUser }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const FRIENDS_ACCENT_COLOR = theme.palette.friendsAccent?.main || theme.palette.info.main; // Use new accent

  const [friendSearchTerm, setFriendSearchTerm] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [friendSearchError, setFriendSearchError] = useState('');
  const [friendRequestStatus, setFriendRequestStatus] = useState({});
  
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoadingPendingRequests, setIsLoadingPendingRequests] = useState(false);
  const [pendingRequestError, setPendingRequestError] = useState('');

  const [friendsList, setFriendsList] = useState([]);
  const [isLoadingFriendsList, setIsLoadingFriendsList] = useState(false);
  const [friendsListError, setFriendsListError] = useState('');

  const [authStatusResolved, setAuthStatusResolved] = useState(currentUser !== undefined && currentUser !== null);

  const [unfriendConfirmationOpen, setUnfriendConfirmationOpen] = useState(false);
  const [userToUnfriend, setUserToUnfriend] = useState(null); 
  const [unfriendError, setUnfriendError] = useState('');

  const fetchPendingRequests = useCallback(async () => { 
    if (!currentUser || !currentUser.token) return;
    setIsLoadingPendingRequests(true);
    setPendingRequestError('');
    try {
        const response = await apiClient.get('/api/friends/requests/pending', {
            headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        setPendingRequests(response.data || []);
    } catch (err) {
        setPendingRequestError(err.response?.data?.message || "Failed to fetch pending requests.");
    } finally {
        setIsLoadingPendingRequests(false);
    }
  }, [currentUser]);

  const fetchFriendsList = useCallback(async () => { 
    if (!currentUser || !currentUser.token) return;
    setIsLoadingFriendsList(true);
    setFriendsListError('');
    try {
        const response = await apiClient.get('/api/friends', {
            headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        setFriendsList(response.data || []);
    } catch (err) {
        setFriendsListError(err.response?.data?.message || "Failed to fetch friends list.");
    } finally {
        setIsLoadingFriendsList(false);
    }
  }, [currentUser]);


  useEffect(() => {
    if (currentUser !== undefined) { 
        setAuthStatusResolved(true);
        if (currentUser) { 
            fetchPendingRequests();
            fetchFriendsList();
        }
    }
  }, [currentUser, fetchPendingRequests, fetchFriendsList]);


  const handleSearchUsers = async () => { 
    if (!friendSearchTerm.trim() || friendSearchTerm.trim().length < 2) {
        setFriendSearchError('Please enter at least 2 characters to search.');
        setSearchedUsers([]);
        return;
    }
    setIsSearchingUsers(true);
    setFriendSearchError('');
    setFriendRequestStatus({});
    try {
        const response = await apiClient.get(`/api/users/search?username=${friendSearchTerm.trim()}`, {
            headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        setSearchedUsers(response.data || []);
        if (response.data.length === 0) {
            setFriendSearchError('No users found matching your search.');
        }
    } catch (err) {
        setFriendSearchError(err.response?.data?.message || "Error searching for users.");
        setSearchedUsers([]);
    } finally {
        setIsSearchingUsers(false);
    }
   };
  const handleSendFriendRequest = async (receiverUsername) => { 
    setFriendRequestStatus(prev => ({ ...prev, [receiverUsername]: 'sending' }));
    try {
        const response = await apiClient.post('/api/friends/request', 
            { receiverUsername },
            { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );
        setFriendRequestStatus(prev => ({ ...prev, [receiverUsername]: 'sent' }));
    } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error sending request';
        setFriendRequestStatus(prev => ({ ...prev, [receiverUsername]: errorMessage }));
    }
  };
  const handleRespondToRequest = async (requestId, action) => { 
     try {
        await apiClient.put(`/api/friends/request/${requestId}`, 
            { action },
            { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );
        fetchPendingRequests(); 
        if (action === 'accept') fetchFriendsList(); 
    } catch (err) {
        setPendingRequestError(err.response?.data?.message || `Failed to ${action} request.`);
    }
  };
  const openUnfriendConfirmation = (friend) => { 
    setUserToUnfriend(friend);
    setUnfriendConfirmationOpen(true);
    setUnfriendError('');
  };
  const handleConfirmUnfriend = async () => { 
    if (!userToUnfriend || !currentUser || !currentUser.token) {
        setUnfriendError("Cannot unfriend: User data missing.");
        return;
    }
    try {
        await apiClient.delete(`/api/friends/unfriend/${userToUnfriend.friendId}`, {
            headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        setUnfriendConfirmationOpen(false);
        setUserToUnfriend(null);
        fetchFriendsList(); 
    } catch (err) {
        console.error("Error unfriending user:", err);
        setUnfriendError(err.response?.data?.message || "Failed to unfriend user.");
    }
  };

  if (!authStatusResolved) { 
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <CircularProgress sx={{ color: FRIENDS_ACCENT_COLOR }} />
        </Box>
    );
  }
  if (!currentUser) { 
    return (
        <Box sx={{ p: 3, textAlign: 'center', maxWidth: '600px', margin: 'auto', mt: 4 }}>
            <Paper elevation={3} sx={{p:3}}>
                <Typography variant="h6">Please log in to manage friends.</Typography>
                <Button variant="contained" onClick={() => navigate('/account')} sx={{mt: 2, backgroundColor: FRIENDS_ACCENT_COLOR, '&:hover': {backgroundColor: darken(FRIENDS_ACCENT_COLOR, 0.2)}}}>Go to Login</Button>
            </Paper>
        </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: '800px', margin: 'auto', mt: 2 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" gutterBottom sx={{ color: FRIENDS_ACCENT_COLOR, fontWeight: 'bold' }}>
                <GroupIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.3em', color: FRIENDS_ACCENT_COLOR }} />
                Manage Friends
            </Typography>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/account')} sx={{color: FRIENDS_ACCENT_COLOR}}>
                My Profile
            </Button>
        </Stack>

        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: FRIENDS_ACCENT_COLOR, opacity: 0.85 }}>Find Friends</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TextField
                    fullWidth
                    label="Search for users by username"
                    variant="outlined"
                    size="small"
                    value={friendSearchTerm}
                    onChange={(e) => {setFriendSearchTerm(e.target.value); setFriendSearchError('');}}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleSearchUsers(); }}
                />
                <Button onClick={handleSearchUsers} variant="contained" disabled={isSearchingUsers} startIcon={<SearchIcon />} sx={{backgroundColor: FRIENDS_ACCENT_COLOR, '&:hover': {backgroundColor: darken(FRIENDS_ACCENT_COLOR, 0.2)}}}>
                    {isSearchingUsers ? <CircularProgress size={20} color="inherit"/> : "Search"}
                </Button>
            </Box>
            {friendSearchError && <Alert severity="info" sx={{ mb: 1 }}>{friendSearchError}</Alert>}
            {searchedUsers.length > 0 && (
                <List dense sx={{maxHeight: 200, overflow: 'auto', border: `1px solid ${theme.palette.divider}`, borderRadius: 1}}>
                    {searchedUsers.map(user => {
                        let buttonText = 'Add Friend';
                        let buttonDisabled = false;
                        let buttonColor = "secondary"; // Using secondary as a default that can be overridden
                        let currentStatus = friendRequestStatus[user.identifier];

                        if (currentStatus === 'sending') {
                            buttonText = 'Sending...';
                            buttonDisabled = true;
                        } else if (currentStatus === 'sent') {
                            buttonText = 'Request Sent';
                            buttonDisabled = true;
                            buttonColor = "success";
                        } else if (typeof currentStatus === 'string' && 
                                   currentStatus !== 'error' && 
                                   currentStatus !== 'Add Friend' && 
                                   currentStatus) { 
                            buttonText = currentStatus; 
                            buttonDisabled = true;
                            buttonColor = "info"; 
                        }

                        return (
                            <ListItem 
                                key={user.id} 
                                secondaryAction={
                                    <Tooltip title={buttonText} placement="top">
                                        <span>
                                            <Button 
                                                size="small" 
                                                variant="outlined"
                                                color={buttonColor}
                                                onClick={() => handleSendFriendRequest(user.identifier)}
                                                disabled={buttonDisabled}
                                                startIcon={currentStatus === 'sending' ? <CircularProgress size={16}/> : <PersonAddAlt1Icon />}
                                                sx={{minWidth: '120px', textTransform: 'none'}} 
                                            >
                                                {buttonText}
                                            </Button>
                                        </span>
                                    </Tooltip>
                                }
                            >
                                <ListItemText primary={user.identifier} />
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: FRIENDS_ACCENT_COLOR, opacity: 0.85 }}>Pending Friend Requests</Typography>
            {isLoadingPendingRequests && <CircularProgress size={24} sx={{ color: FRIENDS_ACCENT_COLOR }} />}
            {pendingRequestError && <Alert severity="error" sx={{mb:1}}>{pendingRequestError}</Alert>}
            {!isLoadingPendingRequests && pendingRequests.length === 0 && !pendingRequestError && (
                <Typography color="text.secondary">No pending friend requests.</Typography>
            )}
            {pendingRequests.length > 0 && (
                <List dense sx={{maxHeight: 200, overflow: 'auto', border: `1px solid ${theme.palette.divider}`, borderRadius: 1}}>
                    {pendingRequests.map(req => (
                        <ListItem key={req.requestId} 
                            secondaryAction={
                                <Stack direction="row" spacing={0.5}>
                                    <Tooltip title="Accept Request">
                                        <IconButton size="small" sx={{color: theme.palette.success.main}} onClick={() => handleRespondToRequest(req.requestId, 'accept')} aria-label="accept friend request">
                                            <CheckIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Decline Request">
                                        <IconButton size="small" sx={{color: theme.palette.error.main}} onClick={() => handleRespondToRequest(req.requestId, 'decline')} aria-label="decline friend request">
                                            <CloseIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            }
                        >
                            <ListItemText primary={req.username} secondary="Wants to be your friend" />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>

        <Divider sx={{ my: 3 }} />
        
        <Box>
            <Typography variant="h6" gutterBottom sx={{ color: FRIENDS_ACCENT_COLOR, opacity: 0.85 }}>My Friends</Typography>
            {isLoadingFriendsList && <CircularProgress size={24} sx={{ color: FRIENDS_ACCENT_COLOR }}/>}
            {friendsListError && <Alert severity="error" sx={{mb:1}}>{friendsListError}</Alert>}
            {!isLoadingFriendsList && friendsList.length === 0 && !friendsListError && (
                <Typography color="text.secondary">You currently have no friends. Find some above!</Typography>
            )}
            {friendsList.length > 0 && (
                <List dense sx={{maxHeight: 300, overflow: 'auto', border: `1px solid ${theme.palette.divider}`, borderRadius: 1}}>
                    {friendsList.map(friend => (
                        <ListItem 
                            key={friend.friendId}
                            secondaryAction={
                                <Stack direction="row" spacing={0.5}>
                                    <Tooltip title="Unfriend">
                                        <IconButton size="small" color="error" onClick={() => openUnfriendConfirmation(friend)} aria-label={`unfriend ${friend.friendUsername}`}>
                                            <PersonRemoveIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            }
                        >
                            <ListItemText primary={friend.friendUsername} />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
      </Paper>
      <DeleteConfirmationDialog
        open={unfriendConfirmationOpen}
        onClose={() => setUnfriendConfirmationOpen(false)}
        onConfirm={handleConfirmUnfriend}
        title="Confirm Unfriend" 
        message={`Are you sure you want to unfriend ${userToUnfriend?.friendUsername}? This action cannot be undone.`}
        error={unfriendError}
      />
    </Box>
  );
}

export default FriendsPage;