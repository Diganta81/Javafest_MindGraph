import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  Card,
  CardContent,
  Chip,
  IconButton,
  Grid,
  Divider,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Clear,
  MoreVert,
  Lightbulb,
  Schedule,
  Assignment,
  TrendingUp,
  AutoAwesome,
  Help
} from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';
import { chatbotService } from '../services/api';

const ChatbotPage = () => {
  const { user } = useAuth();
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello ${user?.firstName || 'there'}! I'm your AI productivity assistant. I can help you with task management, scheduling, productivity tips, and answering questions about your workflow. How can I assist you today?`,
      timestamp: new Date(),
      suggestions: [
        'Show my task summary',
        'Schedule a task',
        'Productivity tips',
        'Analyze my progress'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { icon: <Assignment />, label: 'Task Summary', action: 'task summary' },
    { icon: <Schedule />, label: 'Schedule Help', action: 'schedule' },
    { icon: <TrendingUp />, label: 'Analyze Progress', action: 'analyze' },
    { icon: <Lightbulb />, label: 'Productivity Tips', action: 'productivity' },
    { icon: <Help />, label: 'Help', action: 'help' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call the backend API with session ID
      const response = await chatbotService.sendMessage(currentMessage, sessionId);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        timestamp: new Date(response.data.timestamp),
        suggestions: generateSuggestions(currentMessage.toLowerCase())
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      
      // Fallback to demo response if API fails
      const fallbackMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I'm having trouble connecting to my AI brain right now. Please try again in a moment, or check if you're logged in properly.",
        timestamp: new Date(),
        suggestions: ['Try again', 'Check connection', 'Contact support']
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateSuggestions = (input) => {
    if (input.includes('task')) {
      return ['Create a new task', 'Show overdue tasks', 'Priority analysis'];
    } else if (input.includes('schedule')) {
      return ['Block focus time', 'Meeting optimization', 'Calendar overview'];
    } else if (input.includes('productivity')) {
      return ['Weekly report', 'Time tracking tips', 'Goal setting'];
    } else {
      return ['Task summary', 'Schedule help', 'Productivity tips'];
    }
  };

  const handleQuickAction = async (action) => {
    const message = {
      id: Date.now(),
      type: 'user',
      content: action,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setIsTyping(true);

    try {
      // Call the backend API for quick actions too with session ID
      const response = await chatbotService.sendMessage(action, sessionId);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        timestamp: new Date(response.data.timestamp),
        suggestions: ['Task summary', 'Schedule help', 'More tips']
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending quick action to chatbot:', error);
      
      // Fallback message for quick actions
      const fallbackMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I couldn't process that quick action right now. Please try typing your request instead.",
        timestamp: new Date(),
        suggestions: ['Try again', 'Type manually', 'Contact support']
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    handleSendMessage();
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'bot',
      content: `Chat cleared! I'm here to help you with task management, scheduling, and productivity tips. What would you like to know?`,
      timestamp: new Date(),
      suggestions: ['Task summary', 'Schedule help', 'Productivity tips', 'Help']
    }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <SmartToy />
            </Avatar>
            <Box>
              <Typography variant="h4">
                AI Assistant
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your personal productivity companion
              </Typography>
            </Box>
          </Box>
          <Box>
            <IconButton onClick={clearChat} color="primary">
              <Clear />
            </IconButton>
            <IconButton 
              onClick={(e) => setAnchorEl(e.currentTarget)}
              color="primary"
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Actions Sidebar */}
        {showQuickActions && (
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={1}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} key={index}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={action.icon}
                      onClick={() => handleQuickAction(action.action)}
                      sx={{ justifyContent: 'flex-start', mb: 1 }}
                    >
                      {action.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                💡 Pro Tips
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Ask me specific questions like:
              </Typography>
              <Typography variant="caption" display="block" color="textSecondary">
                • "What tasks are due tomorrow?"
              </Typography>
              <Typography variant="caption" display="block" color="textSecondary">
                • "When should I schedule focused work?"
              </Typography>
              <Typography variant="caption" display="block" color="textSecondary">
                • "Show my productivity trends"
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* Chat Interface */}
        <Grid item xs={12} md={showQuickActions ? 9 : 12}>
          <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {/* Messages Area */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <List>
                {messages.map((message) => (
                  <ListItem key={message.id} sx={{ alignItems: 'flex-start', mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      {message.type === 'bot' && (
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, mt: 0.5 }}>
                          <SmartToy />
                        </Avatar>
                      )}
                      
                      <Box sx={{ maxWidth: '70%' }}>
                        <Card
                          sx={{
                            bgcolor: message.type === 'user' ? 'primary.main' : 'grey.100',
                            color: message.type === 'user' ? 'white' : 'text.primary'
                          }}
                        >
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Typography 
                              variant="body1" 
                              sx={{ whiteSpace: 'pre-wrap' }}
                            >
                              {message.content}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                display: 'block', 
                                mt: 1, 
                                opacity: 0.7 
                              }}
                            >
                              {message.timestamp.toLocaleTimeString()}
                            </Typography>
                          </CardContent>
                        </Card>
                        
                        {/* Suggestions */}
                        {message.suggestions && message.type === 'bot' && (
                          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {message.suggestions.map((suggestion, index) => (
                              <Chip
                                key={index}
                                label={suggestion}
                                size="small"
                                clickable
                                onClick={() => handleSuggestionClick(suggestion)}
                                sx={{ mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                      
                      {message.type === 'user' && (
                        <Avatar sx={{ bgcolor: 'secondary.main', ml: 2, mt: 0.5 }}>
                          <Person />
                        </Avatar>
                      )}
                    </Box>
                  </ListItem>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <ListItem sx={{ alignItems: 'flex-start' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <SmartToy />
                    </Avatar>
                    <Card sx={{ bgcolor: 'grey.100' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="body1">
                          <AutoAwesome sx={{ animation: 'pulse 1s infinite' }} /> Thinking...
                        </Typography>
                      </CardContent>
                    </Card>
                  </ListItem>
                )}
                
                <div ref={messagesEndRef} />
              </List>
            </Box>

            {/* Input Area */}
            <Divider />
            <Box sx={{ p: 2 }}>
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Ask me about tasks, scheduling, productivity tips..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  <Send />
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setShowQuickActions(!showQuickActions)}>
          {showQuickActions ? 'Hide' : 'Show'} Quick Actions
        </MenuItem>
        <MenuItem onClick={clearChat}>
          Clear Chat History
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          Export Conversation
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default ChatbotPage;
