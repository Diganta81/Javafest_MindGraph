import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const PreferencesPage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Preferences
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography>
          User preferences interface coming soon...
        </Typography>
      </Paper>
    </Container>
  );
};

export default PreferencesPage;
