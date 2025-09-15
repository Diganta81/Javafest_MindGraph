import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const TasksPage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography>
          Task management interface coming soon...
        </Typography>
      </Paper>
    </Container>
  );
};

export default TasksPage;
