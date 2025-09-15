import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  TrendingUp
} from '@mui/icons-material';

const DashboardPage = () => {
  // Mock data - replace with real data from API
  const stats = {
    totalTasks: 24,
    completedTasks: 18,
    pendingTasks: 6,
    upcomingDeadlines: 3
  };

  const recentTasks = [
    { id: 1, title: 'Complete project proposal', status: 'completed', priority: 'high' },
    { id: 2, title: 'Review team feedback', status: 'pending', priority: 'medium' },
    { id: 3, title: 'Prepare presentation slides', status: 'in-progress', priority: 'high' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Team Meeting', time: '10:00 AM', date: 'Today' },
    { id: 2, title: 'Project Deadline', time: '5:00 PM', date: 'Tomorrow' },
    { id: 3, title: 'Client Call', time: '2:00 PM', date: 'Friday' },
  ];

  const completionRate = Math.round((stats.completedTasks / stats.totalTasks) * 100);

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
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="dashboard-card">
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Tasks
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalTasks}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="dashboard-card">
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h4">
                    {stats.completedTasks}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="dashboard-card">
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h4">
                    {stats.pendingTasks}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="dashboard-card">
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Completion Rate
                  </Typography>
                  <Typography variant="h4">
                    {completionRate}%
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
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Tasks
              </Typography>
              {recentTasks.map((task) => (
                <Box key={task.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {task.title}
                    </Typography>
                    <Box>
                      <Chip
                        label={task.status}
                        color={getStatusColor(task.status)}
                        size="small"
                        sx={{ mr: 1 }}
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
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Events
              </Typography>
              {upcomingEvents.map((event) => (
                <Box key={event.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {event.date} at {event.time}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Overview */}
        <Grid item xs={12}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Progress Overview
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">Task Completion</Typography>
                  <Typography variant="body2">{completionRate}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={completionRate} />
              </Box>
              <Typography variant="body2" color="textSecondary">
                You've completed {stats.completedTasks} out of {stats.totalTasks} tasks this week. Keep up the great work!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
