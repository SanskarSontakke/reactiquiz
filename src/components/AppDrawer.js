// src/components/AppDrawer.js
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography, useTheme
} from '@mui/material';
import {
  Link as RouterLink
} from 'react-router-dom';
import {
  subjectAccentColors
} from '../theme';
import ScienceIcon from '@mui/icons-material/Science';
import CalculateIcon from '@mui/icons-material/Calculate';
import BoltIcon from '@mui/icons-material/Bolt';
import BiotechIcon from '@mui/icons-material/Biotech';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import PollIcon from '@mui/icons-material/Poll';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import DashboardIcon from '@mui/icons-material/Dashboard';

const drawerWidth = 250;

function AppDrawer({ open, onClose }) {
  const theme = useTheme();

  const drawerItems = [
    { text: 'Dashboard', icon: <DashboardIcon sx={{ color: theme.palette.dashboardAccent?.main || theme.palette.grey[500] }} />, path: '/dashboard', color: theme.palette.dashboardAccent?.main || theme.palette.grey[500] },
    { text: 'Chemistry', icon: <ScienceIcon sx={{ color: subjectAccentColors.chemistry }} />, path: '/chemistry', color: subjectAccentColors.chemistry },
    { text: 'Physics', icon: <BoltIcon sx={{ color: subjectAccentColors.physics }} />, path: '/physics', color: subjectAccentColors.physics },
    { text: 'Mathematics', icon: <CalculateIcon sx={{ color: subjectAccentColors.mathematics }} />, path: '/mathematics', color: subjectAccentColors.mathematics },
    { text: 'Biology', icon: <BiotechIcon sx={{ color: subjectAccentColors.biology }} />, path: '/biology', color: subjectAccentColors.biology },
    { text: 'GK', icon: <PublicIcon sx={{ color: subjectAccentColors.gk }} />, path: '/gk', color: subjectAccentColors.gk },
    { text: 'Homibhabha', icon: <SchoolIcon sx={{ color: theme.palette.secondary.main }} />, path: '/homibhabha', color: theme.palette.secondary.main },
    { text: 'Results', icon: <PollIcon sx={{ color: theme.palette.resultsAccent?.main || theme.palette.info.main }}/>, path: '/results', color: theme.palette.resultsAccent?.main || theme.palette.info.main },
    { type: 'divider' },
    { text: 'My Account', icon: <AccountCircleIcon sx={{ color: theme.palette.accountAccent?.main || theme.palette.success.main }}/>, path: '/account', color: theme.palette.accountAccent?.main || theme.palette.success.main },
    { text: 'Friends', icon: <GroupIcon sx={{ color: theme.palette.friendsAccent?.main || theme.palette.info.main }}/>, path: '/friends', color: theme.palette.friendsAccent?.main || theme.palette.info.main },
    { text: 'Challenges', icon: <SportsKabaddiIcon sx={{ color: theme.palette.challengesAccent?.main || theme.palette.secondary.main }}/>, path: '/challenges', color: theme.palette.challengesAccent?.main || theme.palette.secondary.main },
    { text: 'About Us', icon: <InfoIcon sx={{ color: theme.palette.aboutAccent?.main || theme.palette.warning.main }}/>, path: '/about', color: theme.palette.aboutAccent?.main || theme.palette.warning.main },
  ];

  const drawerContent = (
    <Box
      sx={{ width: drawerWidth, height: '100%' }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.palette.background.paper, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
          ReactiQuiz
        </Typography>
      </Box>
      <Divider />
      <List>
        {drawerItems.map((item, index) => (
          item.type === 'divider' ?
            <Divider key={`divider-${index}`} sx={{ my: 1 }} /> :
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={RouterLink} to={item.path}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ color: item.color || theme.palette.text.primary }} />
              </ListItemButton>
            </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export default AppDrawer;