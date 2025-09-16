import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Slider,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Person,
  Notifications,
  Palette,
  Schedule,
  Save,
  Edit,
  ExpandMore,
  Storage,
  Delete
} from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';

const PreferencesPage = () => {
  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState('');

  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || '',
    bio: 'Passionate developer focused on productivity and task management.',
    timezone: 'UTC-5',
    language: 'English'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    weeklyReports: true,
    deadlineAlerts: true,
    teamUpdates: false,
    reminderSound: true,
    notificationVolume: 50
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: 'blue',
    compactMode: false,
    showAvatars: true,
    animationsEnabled: true,
    fontSize: 'medium'
  });

  // Productivity Settings
  const [productivitySettings, setProductivitySettings] = useState({
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    focusTime: 25, // Pomodoro timer
    breakTime: 5,
    weekStart: 'Monday',
    defaultTaskPriority: 'medium',
    autoArchiveCompleted: true,
    smartScheduling: true,
    aiSuggestions: true
  });

  const handleSaveSettings = (settingType) => {
    setSaveStatus(`${settingType} settings saved successfully!`);
    // In a real app, this would make API calls to save settings
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleResetToDefaults = () => {
    // Reset all settings to defaults
    setSaveStatus('Settings reset to defaults');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const colorOptions = ['blue', 'green', 'purple', 'orange', 'red', 'teal'];
  const themeOptions = ['light', 'dark', 'auto'];
  const fontSizeOptions = ['small', 'medium', 'large'];
  const timeZoneOptions = ['UTC-8', 'UTC-7', 'UTC-6', 'UTC-5', 'UTC-4', 'UTC+0', 'UTC+1', 'UTC+5'];
  const languageOptions = ['English', 'Spanish', 'French', 'German', 'Japanese'];

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings & Preferences
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Customize your MindGraph experience
        </Typography>
      </Box>

      {/* Save Status Alert */}
      {saveStatus && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {saveStatus}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <Person sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Profile Settings</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar
                      sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
                    >
                      <Person sx={{ fontSize: 50 }} />
                    </Avatar>
                    <Button variant="outlined" startIcon={<Edit />}>
                      Change Photo
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={profileSettings.firstName}
                        onChange={(e) => setProfileSettings({
                          ...profileSettings,
                          firstName: e.target.value
                        })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={profileSettings.lastName}
                        onChange={(e) => setProfileSettings({
                          ...profileSettings,
                          lastName: e.target.value
                        })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={profileSettings.email}
                        onChange={(e) => setProfileSettings({
                          ...profileSettings,
                          email: e.target.value
                        })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        value={profileSettings.username}
                        onChange={(e) => setProfileSettings({
                          ...profileSettings,
                          username: e.target.value
                        })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Bio"
                        value={profileSettings.bio}
                        onChange={(e) => setProfileSettings({
                          ...profileSettings,
                          bio: e.target.value
                        })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Timezone</InputLabel>
                        <Select
                          value={profileSettings.timezone}
                          onChange={(e) => setProfileSettings({
                            ...profileSettings,
                            timezone: e.target.value
                          })}
                          label="Timezone"
                        >
                          {timeZoneOptions.map(tz => (
                            <MenuItem key={tz} value={tz}>{tz}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select
                          value={profileSettings.language}
                          onChange={(e) => setProfileSettings({
                            ...profileSettings,
                            language: e.target.value
                          })}
                          label="Language"
                        >
                          {languageOptions.map(lang => (
                            <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={() => handleSaveSettings('Profile')}
                  >
                    Save Profile Changes
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <Notifications sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Notification Settings</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Email Notifications" 
                        secondary="Receive updates via email"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: e.target.checked
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Push Notifications" 
                        secondary="Browser push notifications"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            pushNotifications: e.target.checked
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Task Reminders" 
                        secondary="Reminders for upcoming tasks"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.taskReminders}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            taskReminders: e.target.checked
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Weekly Reports" 
                        secondary="Weekly productivity summaries"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.weeklyReports}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            weeklyReports: e.target.checked
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Deadline Alerts" 
                        secondary="Alerts for approaching deadlines"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.deadlineAlerts}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            deadlineAlerts: e.target.checked
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Notification Sound" 
                        secondary="Play sounds for notifications"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.reminderSound}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            reminderSound: e.target.checked
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography gutterBottom>Notification Volume</Typography>
                    <Slider
                      value={notificationSettings.notificationVolume}
                      onChange={(e, value) => setNotificationSettings({
                        ...notificationSettings,
                        notificationVolume: value
                      })}
                      valueLabelDisplay="auto"
                      min={0}
                      max={100}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={() => handleSaveSettings('Notification')}
                  >
                    Save Notification Settings
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Appearance Settings */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <Palette sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Appearance Settings</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={appearanceSettings.theme}
                      onChange={(e) => setAppearanceSettings({
                        ...appearanceSettings,
                        theme: e.target.value
                      })}
                      label="Theme"
                    >
                      {themeOptions.map(theme => (
                        <MenuItem key={theme} value={theme}>
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography gutterBottom>Primary Color</Typography>
                  <Box display="flex" gap={1} sx={{ mb: 2 }}>
                    {colorOptions.map(color => (
                      <Chip
                        key={color}
                        label={color}
                        clickable
                        color={appearanceSettings.primaryColor === color ? 'primary' : 'default'}
                        onClick={() => setAppearanceSettings({
                          ...appearanceSettings,
                          primaryColor: color
                        })}
                      />
                    ))}
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>Font Size</InputLabel>
                    <Select
                      value={appearanceSettings.fontSize}
                      onChange={(e) => setAppearanceSettings({
                        ...appearanceSettings,
                        fontSize: e.target.value
                      })}
                      label="Font Size"
                    >
                      {fontSizeOptions.map(size => (
                        <MenuItem key={size} value={size}>
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Compact Mode" 
                        secondary="Use smaller spacing and elements"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={appearanceSettings.compactMode}
                          onChange={(e) => setAppearanceSettings({
                            ...appearanceSettings,
                            compactMode: e.target.checked
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Show Avatars" 
                        secondary="Display user avatars in lists"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={appearanceSettings.showAvatars}
                          onChange={(e) => setAppearanceSettings({
                            ...appearanceSettings,
                            showAvatars: e.target.checked
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Animations" 
                        secondary="Enable interface animations"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={appearanceSettings.animationsEnabled}
                          onChange={(e) => setAppearanceSettings({
                            ...appearanceSettings,
                            animationsEnabled: e.target.checked
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={() => handleSaveSettings('Appearance')}
                  >
                    Save Appearance Settings
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Productivity Settings */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <Schedule sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Productivity Settings</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Working Hours</Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="time"
                        label="Start Time"
                        value={productivitySettings.workingHours.start}
                        onChange={(e) => setProductivitySettings({
                          ...productivitySettings,
                          workingHours: {
                            ...productivitySettings.workingHours,
                            start: e.target.value
                          }
                        })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="time"
                        label="End Time"
                        value={productivitySettings.workingHours.end}
                        onChange={(e) => setProductivitySettings({
                          ...productivitySettings,
                          workingHours: {
                            ...productivitySettings.workingHours,
                            end: e.target.value
                          }
                        })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>

                  <Typography gutterBottom>Focus Time (minutes)</Typography>
                  <Slider
                    value={productivitySettings.focusTime}
                    onChange={(e, value) => setProductivitySettings({
                      ...productivitySettings,
                      focusTime: value
                    })}
                    valueLabelDisplay="auto"
                    min={15}
                    max={60}
                    step={5}
                    sx={{ mb: 2 }}
                  />

                  <Typography gutterBottom>Break Time (minutes)</Typography>
                  <Slider
                    value={productivitySettings.breakTime}
                    onChange={(e, value) => setProductivitySettings({
                      ...productivitySettings,
                      breakTime: value
                    })}
                    valueLabelDisplay="auto"
                    min={5}
                    max={30}
                    step={5}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Smart Scheduling" 
                        secondary="AI-powered task scheduling"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={productivitySettings.smartScheduling}
                          onChange={(e) => setProductivitySettings({
                            ...productivitySettings,
                            smartScheduling: e.target.checked
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="AI Suggestions" 
                        secondary="Get AI-powered productivity tips"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={productivitySettings.aiSuggestions}
                          onChange={(e) => setProductivitySettings({
                            ...productivitySettings,
                            aiSuggestions: e.target.checked
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Auto-archive Completed" 
                        secondary="Automatically archive completed tasks"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={productivitySettings.autoArchiveCompleted}
                          onChange={(e) => setProductivitySettings({
                            ...productivitySettings,
                            autoArchiveCompleted: e.target.checked
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={() => handleSaveSettings('Productivity')}
                  >
                    Save Productivity Settings
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Advanced Actions
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="outlined"
                onClick={handleResetToDefaults}
                color="warning"
              >
                Reset to Defaults
              </Button>
              <Button
                variant="outlined"
                startIcon={<Storage />}
                color="info"
              >
                Export Settings
              </Button>
              <Button
                variant="outlined"
                startIcon={<Delete />}
                color="error"
              >
                Delete Account
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PreferencesPage;
