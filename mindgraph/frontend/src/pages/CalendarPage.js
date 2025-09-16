import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider
} from '@mui/material';
import {
  Add,
  ChevronLeft,
  ChevronRight,
  Today,
  Event,
  Schedule,
  Person,
  LocationOn
} from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';
import { useData } from '../utils/DataContext';

const CalendarPage = () => {
  const { 
    events, 
    addEvent, 
    getEventsForDate 
  } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    type: 'meeting',
    location: '',
    attendees: ''
  });

  const eventTypes = ['meeting', 'deadline', 'call', 'training', 'social', 'personal'];

  // Get days in current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Navigate months
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // Handle event creation
  const handleCreateEvent = () => {
    addEvent({
      ...newEvent,
      attendees: (newEvent.attendees || '').split(',').map(a => a.trim()).filter(a => a)
    });
    setNewEvent({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      type: 'meeting',
      location: '',
      attendees: ''
    });
    setOpenDialog(false);
  };

  // Get event type color
  const getEventTypeColor = (type) => {
    const colors = {
      meeting: 'primary',
      deadline: 'error',
      call: 'info',
      training: 'warning',
      social: 'success',
      personal: 'secondary'
    };
    return colors[type] || 'default';
  };

  // Get event type icon
  const getEventTypeIcon = (type) => {
    const icons = {
      meeting: <Person />,
      deadline: <Schedule />,
      call: <Event />,
      training: <Schedule />,
      social: <Event />,
      personal: <Person />
    };
    return icons[type] || <Event />;
  };

  const days = getDaysInMonth(currentDate) || [];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedDateEvents = getEventsForDate(selectedDate) || [];

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4">
            Calendar
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            New Event
          </Button>
        </Box>

        {/* Calendar Controls */}
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={() => navigateMonth(-1)}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h5" sx={{ minWidth: 200, textAlign: 'center' }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
            <IconButton onClick={() => navigateMonth(1)}>
              <ChevronRight />
            </IconButton>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Today />}
            onClick={goToToday}
          >
            Today
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Calendar Grid */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            {/* Day Headers */}
            <Grid container>
              {dayNames.map(day => (
                <Grid item xs key={day} sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {day}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            
            {/* Calendar Days */}
            <Grid container>
              {days.map((day, index) => (
                <Grid 
                  item 
                  xs 
                  key={index}
                  sx={{ 
                    minHeight: 120,
                    border: '1px solid #e0e0e0',
                    cursor: day ? 'pointer' : 'default',
                    bgcolor: day && day.toDateString() === selectedDate.toDateString() ? 'primary.light' : 'transparent',
                    '&:hover': {
                      bgcolor: day ? 'grey.100' : 'transparent'
                    }
                  }}
                  onClick={() => day && handleDateClick(day)}
                >
                  {day && (
                    <Box sx={{ p: 1, height: '100%' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: day.toDateString() === new Date().toDateString() ? 'bold' : 'normal',
                          color: day.toDateString() === new Date().toDateString() ? 'primary.main' : 'inherit'
                        }}
                      >
                        {day.getDate()}
                      </Typography>
                      
                      {/* Events for this day */}
                      <Box sx={{ mt: 1 }}>
                        {(getEventsForDate(day) || []).slice(0, 2).map(event => (
                          <Chip
                            key={event.id}
                            label={event.title}
                            size="small"
                            color={getEventTypeColor(event.type)}
                            sx={{ 
                              mb: 0.5, 
                              display: 'block',
                              height: 'auto',
                              '& .MuiChip-label': {
                                fontSize: '0.7rem',
                                whiteSpace: 'normal',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical'
                              }
                            }}
                          />
                        ))}
                        {(getEventsForDate(day) || []).length > 2 && (
                          <Typography variant="caption" color="textSecondary">
                            +{(getEventsForDate(day) || []).length - 2} more
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Selected Date Events */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Events for {selectedDate.toLocaleDateString()}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {selectedDateEvents.length === 0 ? (
              <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                No events scheduled for this date
              </Typography>
            ) : (
              <List>
                {selectedDateEvents.map(event => (
                  <ListItem 
                    key={event.id}
                    sx={{ 
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    <Avatar sx={{ mr: 2, bgcolor: `${getEventTypeColor(event.type)}.main` }}>
                      {getEventTypeIcon(event.type)}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1" fontWeight="medium">
                            {event.title}
                          </Typography>
                          <Chip 
                            label={event.type} 
                            size="small" 
                            color={getEventTypeColor(event.type)}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {event.description}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            <Schedule sx={{ fontSize: 14, mr: 0.5 }} />
                            {event.startTime} - {event.endTime}
                          </Typography>
                          {event.location && (
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                              <LocationOn sx={{ fontSize: 14, mr: 0.5 }} />
                              {event.location}
                            </Typography>
                          )}
                          {(event.attendees || []).length > 0 && (
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                              <Person sx={{ fontSize: 14, mr: 0.5 }} />
                              {(event.attendees || []).join(', ')}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Create Event Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label="Start Time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label="End Time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  label="Event Type"
                >
                  {eventTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Attendees (comma separated)"
                value={newEvent.attendees}
                onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })}
                placeholder="John, Sarah, Mike"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateEvent} variant="contained">
            Create Event
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CalendarPage;
