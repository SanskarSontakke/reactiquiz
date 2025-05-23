// src/components/AppDrawer.js
import React from 'react';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, Box, Typography, useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ScienceIcon from '@mui/icons-material/Science';
import CalculateIcon from '@mui/icons-material/Calculate';
import BoltIcon from '@mui/icons-material/Bolt';
import BiotechIcon from '@mui/icons-material/Biotech';
import PollIcon from '@mui/icons-material/Poll';
import { subjectAccentColors } from '../theme';

const drawerWidth = 250;

function AppDrawer({ open, onClose }) {
  const theme = useTheme();

  const drawerItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/', color: theme.palette.text.primary },
    { text: 'Chemistry', icon: <ScienceIcon sx={{ color: subjectAccentColors.chemistry }}/>, path: '/chemistry', color: subjectAccentColors.chemistry },
    { text: 'Physics', icon: <BoltIcon sx={{ color: subjectAccentColors.physics }}/>, path: '/physics', color: subjectAccentColors.physics },
    { text: 'Mathematics', icon: <CalculateIcon sx={{ color: subjectAccentColors.mathematics }}/>, path: '/mathematics', color: subjectAccentColors.mathematics },
    { text: 'Biology', icon: <BiotechIcon sx={{ color: subjectAccentColors.biology }}/>, path: '/biology', color: subjectAccentColors.biology },
    { text: 'Results', icon: <PollIcon />, path: '/results', color: theme.palette.text.primary },
  ];

  const drawerContent = (
    <Box
      sx={{ width: drawerWidth, height: '100%' }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.palette.background.paper, borderBottom: `1px solid ${theme.palette.divider}` }}>
        {/* MODIFIED LINE BELOW */}
        <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="ReactiQuiz Logo" style={{ width: 40, height: 40, marginRight: 12 }} />
        <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
          ReactiQuiz
        </Typography>
      </Box>
      <Divider />
      <List>
        {drawerItems.map((item) => (
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