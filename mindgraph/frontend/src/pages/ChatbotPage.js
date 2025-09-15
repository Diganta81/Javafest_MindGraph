import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const ChatbotPage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        AI Assistant
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography>
          AI chatbot interface coming soon...
        </Typography>
      </Paper>
    </Container>
  );
};

export default ChatbotPage;
