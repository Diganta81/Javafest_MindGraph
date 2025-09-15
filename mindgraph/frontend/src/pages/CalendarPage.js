import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const CalendarPage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Calendar
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography>
          Calendar view coming soon...
        </Typography>
      </Paper>
    </Container>
  );
};

export default CalendarPage;
