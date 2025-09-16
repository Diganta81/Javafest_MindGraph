import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  LinearProgress,
  Chip,
  Button,
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  TrendingUp,
  Add,
  Refresh,
  Person
} from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';
import { useData } from '../utils/DataContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const { getStats, tasks, events } = useData();

  // Get current date information
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  // Get real stats from data context
  const stats = getStats();

  // Get recent tasks (last 5 tasks by creation date)
  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  // Get today's events
  const today = new Date().toISOString().split('T')[0];
  
  // Get upcoming events (next 3 days)
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
      return eventDate >= today && eventDate <= threeDaysFromNow;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  // Simulate data refresh
  const handleRefresh = () => {
    // In a real app, this would trigger API calls to refresh data
    console.log('Refreshing dashboard data...');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'pending':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
                {greeting}, {user?.firstName || user?.username || 'User'}!
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Here's what's happening with your tasks today
              </Typography>
            </Box>
          </Box>
          <Box>
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ ml: 1 }}
              onClick={() => {/* Navigate to create task */}}
            >
              New Task
            </Button>
          </Box>
        </Box>
        <Divider />
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>
                    Total Tasks
                  </Typography>
                  <Typography variant="h4" color="inherit">
                    {stats.totalTasks}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>
                    Completed
                  </Typography>
                  <Typography variant="h4" color="inherit">
                    {stats.completedTasks}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>
                    Pending
                  </Typography>
                  <Typography variant="h4" color="inherit">
                    {stats.pendingTasks}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>
                    Completion Rate
                  </Typography>
                  <Typography variant="h4" color="inherit">
                    {stats.completionRate}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Tasks */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">
                  Recent Tasks
                </Typography>
                <Button size="small" onClick={() => {/* Navigate to tasks page */}}>
                  View All
                </Button>
              </Box>
              <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                {recentTasks.map((task) => (
                  <Box 
                    key={task.id} 
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 2,
                      '&:hover': { 
                        backgroundColor: '#f5f5f5',
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                          {task.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Due: {task.dueDate}
                        </Typography>
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="flex-end">
                        <Chip
                          label={task.status}
                          color={getStatusColor(task.status)}
                          size="small"
                          sx={{ mb: 0.5 }}
                        />
                        <Chip
                          label={task.priority}
                          color={getPriorityColor(task.priority)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">
                  Upcoming Events
                </Typography>
                <Button size="small" onClick={() => {/* Navigate to calendar page */}}>
                  View Calendar
                </Button>
              </Box>
              <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                {upcomingEvents.map((event) => (
                  <Box 
                    key={event.id} 
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 2,
                      '&:hover': { 
                        backgroundColor: '#f5f5f5',
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {event.date} at {event.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Progress Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2">Task Completion</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {stats.completionRate}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats.completionRate} 
                      sx={{ 
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    You've completed {stats.completedTasks} out of {stats.totalTasks} tasks this week. 
                    {stats.completionRate >= 75 ? ' Excellent progress! 🎉' : ' Keep up the great work! 💪'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box textAlign="center">
                    <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                      {stats.upcomingDeadlines}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Upcoming Deadlines
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={() => {/* Navigate to tasks with filter */}}
                    >
                      View Details
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
