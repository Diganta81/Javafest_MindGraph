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

const ChatbotPage = () => {
  const { user } = useAuth();
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

  // Predefined responses for demo purposes
  const botResponses = {
    'task summary': `Here's your task summary:
    
📊 **Current Status:**
- Total tasks: 24
- Completed: 18 (75%)
- In progress: 4
- Pending: 2

🎯 **Priority breakdown:**
- High priority: 3 tasks
- Medium priority: 8 tasks  
- Low priority: 13 tasks

⏰ **Upcoming deadlines:**
- Project proposal (Today)
- Team review (Tomorrow)
- Client presentation (Friday)`,

    'schedule': `I can help you schedule tasks! Here are some options:

🗓️ **Smart scheduling suggestions:**
- Best time for focused work: 9-11 AM
- Optimal meeting slots: 2-4 PM  
- Break recommendations: Every 25 minutes

📋 **Quick actions:**
- Create a new task
- Block time for deep work
- Schedule team meetings
- Set recurring reminders`,

    'productivity': `Here are some personalized productivity tips for you:

⚡ **Energy optimization:**
- Your peak performance: 9-11 AM
- Consider batching similar tasks
- Take breaks every 25-30 minutes

🎯 **Focus strategies:**
- Use the Pomodoro technique
- Eliminate distractions during deep work
- Prioritize high-impact tasks in the morning

📈 **Progress tracking:**
- You're 75% completion rate is excellent!
- Consider breaking down large tasks
- Celebrate small wins along the way`,

    'analyze': `📊 **Your productivity analysis:**

**This week's highlights:**
- Completed 18 out of 24 tasks (75% completion rate)
- Average task completion time: 2.3 hours
- Most productive day: Tuesday
- Peak performance time: 9-11 AM

**Improvement suggestions:**
- You tend to schedule too many tasks on Mondays
- Consider time-blocking for better focus
- Your afternoon productivity could be improved with shorter breaks

**Trends:**
- 📈 15% improvement from last week
- 🎯 Consistently meeting deadlines
- ⏰ Good at estimating task duration`,

    'help': `🤖 **I can help you with:**

**Task Management:**
- Create, edit, and organize tasks
- Set priorities and deadlines
- Track progress and completion

**Scheduling:**
- Optimize your calendar
- Suggest best times for different activities
- Block focus time

**Analytics:**
- Analyze your productivity patterns
- Generate progress reports
- Identify improvement areas

**Tips & Insights:**
- Personalized productivity advice
- Time management strategies
- Workflow optimization

Just ask me anything like "create a task", "when should I schedule meetings?", or "show my progress"!`
  };

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

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage.toLowerCase());
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        suggestions: generateSuggestions(inputMessage.toLowerCase())
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (input) => {
    // Simple keyword matching for demo
    if (input.includes('task') && input.includes('summary')) {
      return botResponses['task summary'];
    } else if (input.includes('schedule') || input.includes('calendar')) {
      return botResponses['schedule'];
    } else if (input.includes('productivity') || input.includes('tips')) {
      return botResponses['productivity'];
    } else if (input.includes('analyze') || input.includes('progress') || input.includes('report')) {
      return botResponses['analyze'];
    } else if (input.includes('help')) {
      return botResponses['help'];
    } else if (input.includes('create') && input.includes('task')) {
      return `I'll help you create a new task! 

📝 **Quick task creation:**
- What's the task title?
- When is it due?
- What's the priority level?
- Any specific category?

You can also go to the Tasks page to create detailed tasks with full customization options.`;
    } else if (input.includes('meeting') || input.includes('appointment')) {
      return `🗓️ **Meeting scheduling assistance:**

**Best meeting times based on your schedule:**
- Tuesday 2-4 PM (High availability)
- Wednesday 10 AM-12 PM (Good focus time)
- Thursday 3-5 PM (Team availability)

**Tips for productive meetings:**
- Keep them under 30 minutes when possible
- Send agenda beforehand
- Block 5 minutes between meetings for transitions

Would you like me to help you schedule a specific meeting?`;
    } else {
      return `I understand you're asking about "${input}". While I'm still learning, I can help you with:

🎯 **Main areas I excel at:**
- Task management and organization
- Schedule optimization  
- Productivity analysis
- Time management tips
- Progress tracking

Try asking me about your tasks, schedule, or productivity patterns. You can also use the quick action buttons below for common requests!`;
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

  const handleQuickAction = (action) => {
    const message = {
      id: Date.now(),
      type: 'user',
      content: action,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setIsTyping(true);

    setTimeout(() => {
      const response = botResponses[action] || botResponses['help'];
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date(),
        suggestions: ['Task summary', 'Schedule help', 'More tips']
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
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
