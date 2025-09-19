import React, { useState, useEffect } from 'react';
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
  IconButton,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  Add,
  ChevronLeft,
  ChevronRight,
  ViewWeek,
  ViewDay,
  CalendarViewMonth
} from '@mui/icons-material';
import { useData } from '../utils/DataContext';

const CalendarPage = () => {
  const { 
    addEvent, 
    getEventsForDate,
    events
  } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'

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

  // Force re-render when component mounts to ensure events are loaded for today
  useEffect(() => {
    // This effect ensures that selectedDate is properly set and events are loaded
    const today = new Date();
    setSelectedDate(today);
  }, [events]); // Depend on events so it re-runs when events are loaded

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

  // Handle opening dialog with selected date
  const handleOpenDialog = () => {
    setNewEvent({
      ...newEvent,
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setOpenDialog(true);
  };

  // Get event type color - Google Calendar style colors
  const getEventColor = (type) => {
    const colors = {
      meeting: '#1a73e8',
      deadline: '#d93025',
      call: '#0d652d',
      training: '#f9ab00',
      social: '#9aa0a6',
      personal: '#673ab7'
    };
    return colors[type] || '#1a73e8';
  };

  const days = getDaysInMonth(currentDate) || [];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedDateEvents = selectedDate ? (getEventsForDate(selectedDate) || []) : [];

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Google Calendar-style Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          borderBottom: '1px solid #e0e0e0',
          bgcolor: 'white',
          px: 3,
          py: 2
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Left side - Logo and Navigation */}
          <Box display="flex" alignItems="center" gap={3}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 400, 
                color: '#5f6368',
                fontSize: '22px'
              }}
            >
              Calendar
            </Typography>
            
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                onClick={() => navigateMonth(-1)}
                sx={{ 
                  '&:hover': { bgcolor: '#f1f3f4' },
                  color: '#5f6368'
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton 
                onClick={() => navigateMonth(1)}
                sx={{ 
                  '&:hover': { bgcolor: '#f1f3f4' },
                  color: '#5f6368'
                }}
              >
                <ChevronRight />
              </IconButton>
              <Button
                onClick={goToToday}
                sx={{ 
                  textTransform: 'none',
                  color: '#5f6368',
                  '&:hover': { bgcolor: '#f1f3f4' },
                  borderRadius: '4px',
                  px: 2
                }}
              >
                Today
              </Button>
            </Box>

            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 400,
                color: '#3c4043',
                fontSize: '22px'
              }}
            >
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
          </Box>

          {/* Right side - View controls and Add button */}
          <Box display="flex" alignItems="center" gap={2}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newView) => newView && setViewMode(newView)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: '4px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#f1f3f4' },
                  '&.Mui-selected': { 
                    bgcolor: '#e8f0fe',
                    color: '#1a73e8'
                  }
                }
              }}
            >
              <ToggleButton value="day">
                <ViewDay sx={{ mr: 1, fontSize: 18 }} />
                Day
              </ToggleButton>
              <ToggleButton value="week">
                <ViewWeek sx={{ mr: 1, fontSize: 18 }} />
                Week
              </ToggleButton>
              <ToggleButton value="month">
                <CalendarViewMonth sx={{ mr: 1, fontSize: 18 }} />
                Month
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              variant="contained"
              onClick={handleOpenDialog}
              sx={{
                bgcolor: '#1a73e8',
                textTransform: 'none',
                borderRadius: '24px',
                px: 3,
                py: 1,
                '&:hover': { bgcolor: '#1557b0' }
              }}
              startIcon={<Add />}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Calendar Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            bgcolor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #dadce0'
          }}
        >
          {/* Day Headers - Google Calendar Style */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              borderBottom: '1px solid #dadce0',
              bgcolor: '#f8f9fa'
            }}
          >
            {dayNames.map(day => (
              <Box 
                key={day}
                sx={{ 
                  py: 2,
                  textAlign: 'center',
                  borderRight: '1px solid #dadce0',
                  '&:last-child': { borderRight: 'none' }
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    color: '#5f6368',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px'
                  }}
                >
                  {day}
                </Typography>
              </Box>
            ))}
          </Box>
          
          {/* Calendar Grid - Google Calendar Style */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              minHeight: '600px'
            }}
          >
            {days.map((day, index) => {
              const dayEvents = day ? getEventsForDate(day) || [] : [];
              const isToday = day && day.toDateString() === new Date().toDateString();
              const isSelected = day && day.toDateString() === selectedDate.toDateString();
              
              return (
                <Box 
                  key={index}
                  sx={{ 
                    minHeight: '120px',
                    borderRight: '1px solid #dadce0',
                    borderBottom: '1px solid #dadce0',
                    cursor: day ? 'pointer' : 'default',
                    bgcolor: day ? (isSelected ? '#e8f0fe' : 'white') : '#f8f9fa',
                    '&:hover': {
                      bgcolor: day ? (isSelected ? '#e8f0fe' : '#f8f9fa') : '#f8f9fa'
                    },
                    '&:last-child': { borderRight: 'none' },
                    position: 'relative',
                    p: 1
                  }}
                  onClick={() => day && handleDateClick(day)}
                >
                  {day && (
                    <>
                      {/* Date Number */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          bgcolor: isToday ? '#1a73e8' : 'transparent',
                          color: isToday ? 'white' : '#3c4043',
                          fontWeight: isToday ? 500 : 400,
                          fontSize: '14px',
                          mb: 1
                        }}
                      >
                        {day.getDate()}
                      </Box>
                      
                      {/* Events */}
                      <Box sx={{ maxHeight: '80px', overflow: 'hidden' }}>
                        {dayEvents.slice(0, 3).map((event, eventIndex) => {
                          // Ensure event has time properties, provide defaults if missing
                          const startTime = event.startTime || event.time || '09:00';
                          const endTime = event.endTime || (event.time ? 
                            `${parseInt(event.time.split(':')[0]) + 1}:${event.time.split(':')[1]}` : '10:00');
                          
                          return (
                            <Box
                              key={event.id}
                              sx={{
                                bgcolor: getEventColor(event.type),
                                color: 'white',
                                borderRadius: '3px',
                                px: 1,
                                py: 0.5,
                                mb: 0.5,
                                fontSize: '11px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                '&:hover': {
                                  opacity: 0.8
                                },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              title={`${event.title} (${startTime} - ${endTime})`}
                            >
                              {startTime} {event.title}
                            </Box>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#5f6368',
                              fontSize: '11px',
                              fontWeight: 500
                            }}
                          >
                            +{dayEvents.length - 3} more
                          </Typography>
                        )}
                      </Box>
                    </>
                  )}
                </Box>
              );
            })}
          </Box>
        </Paper>

        {/* Event Details Sidebar - Google Calendar Style */}
        {selectedDate && (
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {/* Selected Day Events - Full Width */}
            <Grid item xs={12}>
              <Paper 
                elevation={1}
                sx={{ 
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #dadce0'
                }}
              >
                <Box 
                  sx={{ 
                    bgcolor: '#f8f9fa',
                    px: 3,
                    py: 2,
                    borderBottom: '1px solid #dadce0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#3c4043'
                    }}
                  >
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#5f6368',
                      fontSize: '14px'
                    }}
                  >
                    {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
                
                {/* Hour-based time slots like Google Calendar */}
                <Box sx={{ display: 'flex', minHeight: '400px' }}>
                  {/* Time column */}
                  <Box 
                    sx={{ 
                      width: '60px',
                      bgcolor: '#f8f9fa',
                      borderRight: '1px solid #dadce0'
                    }}
                  >
                    {Array.from({ length: 24 }, (_, hour) => (
                      <Box
                        key={hour}
                        sx={{
                          height: '60px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                          pt: 1,
                          borderBottom: '1px solid #f1f3f4',
                          fontSize: '12px',
                          color: '#5f6368'
                        }}
                      >
                        {hour === 0 ? '12 AM' : 
                         hour < 12 ? `${hour} AM` : 
                         hour === 12 ? '12 PM' : 
                         `${hour - 12} PM`}
                      </Box>
                    ))}
                  </Box>
                  
                  {/* Events column */}
                  <Box sx={{ flex: 1, position: 'relative' }}>
                    {Array.from({ length: 24 }, (_, hour) => (
                      <Box
                        key={hour}
                        sx={{
                          height: '60px',
                          borderBottom: '1px solid #f1f3f4',
                          position: 'relative'
                        }}
                      />
                    ))}
                    
                    {/* Render events positioned by time */}
                    {selectedDateEvents.map((event, index) => {
                      // Ensure event has time properties, provide defaults if missing
                      const startTime = event.startTime || event.time || '09:00';
                      const endTime = event.endTime || (event.time ? 
                        `${parseInt(event.time.split(':')[0]) + 1}:${event.time.split(':')[1]}` : '10:00');
                      
                      const startHour = parseInt(startTime.split(':')[0]);
                      const startMinute = parseInt(startTime.split(':')[1]);
                      const endHour = parseInt(endTime.split(':')[0]);
                      const endMinute = parseInt(endTime.split(':')[1]);
                      
                      const topPosition = (startHour * 60) + startMinute;
                      const duration = ((endHour * 60) + endMinute) - topPosition;
                      
                      return (
                        <Box
                          key={event.id}
                          sx={{
                            position: 'absolute',
                            top: `${topPosition}px`,
                            left: '8px',
                            right: '8px',
                            height: `${Math.max(duration, 30)}px`,
                            bgcolor: getEventColor(event.type),
                            color: 'white',
                            borderRadius: '4px',
                            p: 1,
                            fontSize: '12px',
                            cursor: 'pointer',
                            zIndex: 10 + index,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            '&:hover': {
                              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                            }
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600,
                              fontSize: '12px',
                              lineHeight: 1.2,
                              mb: 0.5
                            }}
                          >
                            {event.title}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontSize: '11px',
                              opacity: 0.9,
                              lineHeight: 1.1
                            }}
                          >
                            {startTime} - {endTime}
                          </Typography>
                          {event.location && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontSize: '10px',
                                opacity: 0.8,
                                display: 'block',
                                lineHeight: 1.1
                              }}
                            >
                              📍 {event.location}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                    
                    {/* Show message when no events */}
                    {selectedDateEvents.length === 0 && (
                      <Box 
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          color: '#5f6368',
                          fontSize: '14px'
                        }}
                      >
                        No events scheduled for this day
                      </Box>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

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
    </Box>
  );
};

export default CalendarPage;
