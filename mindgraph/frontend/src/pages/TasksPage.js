import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  CheckCircle,
  RadioButtonUnchecked,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';
import { useData } from '../utils/DataContext';

const TasksPage = () => {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTaskStatus 
  } = useData();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: 'work'
  });

  const priorities = ['low', 'medium', 'high'];
  const categories = ['work', 'personal', 'maintenance', 'learning'];

  // Filter tasks based on active tab and filters
  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Filter by tab
    if (activeTab === 1) filtered = filtered.filter(task => task.status === 'pending');
    else if (activeTab === 2) filtered = filtered.filter(task => task.status === 'in-progress');
    else if (activeTab === 3) filtered = filtered.filter(task => task.status === 'completed');

    // Additional filters
    if (filterBy !== 'all') {
      filtered = filtered.filter(task => task.category === filterBy);
    }

    // Sort tasks
    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

    return filtered;
  };

  const handleCreateTask = () => {
    addTask({
      ...newTask,
      status: 'pending'
    });
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', category: 'work' });
    setOpenDialog(false);
  };

  const handleEditTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setEditingTask(task);
    setNewTask(task);
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleUpdateTask = () => {
    updateTask(editingTask.id, newTask);
    setEditingTask(null);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', category: 'work' });
    setOpenDialog(false);
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    setAnchorEl(null);
  };

  const handleToggleStatus = (taskId) => {
    toggleTaskStatus(taskId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle color="success" />;
      case 'in-progress': return <Schedule color="warning" />;
      case 'pending': return <RadioButtonUnchecked color="action" />;
      default: return <RadioButtonUnchecked />;
    }
  };

  const filteredTasks = getFilteredTasks();
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4">
            Task Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            New Task
          </Button>
        </Box>

        {/* Task Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h4">{taskStats.total}</Typography>
                <Typography variant="body2">Total Tasks</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'grey.500', color: 'white' }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h4">{taskStats.pending}</Typography>
                <Typography variant="body2">Pending</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h4">{taskStats.inProgress}</Typography>
                <Typography variant="body2">In Progress</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h4">{taskStats.completed}</Typography>
                <Typography variant="body2">Completed</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="All Tasks" />
              <Tab label="Pending" />
              <Tab label="In Progress" />
              <Tab label="Completed" />
            </Tabs>
          </Box>
          <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="created">Created Date</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>
      </Box>

      {/* Tasks List */}
      <Paper>
        <List>
          {filteredTasks.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="No tasks found" 
                secondary="Create a new task to get started"
              />
            </ListItem>
          ) : (
            filteredTasks.map((task) => (
              <ListItem
                key={task.id}
                sx={{
                  borderBottom: '1px solid #e0e0e0',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <IconButton
                  edge="start"
                  onClick={() => handleToggleStatus(task.id)}
                  sx={{ mr: 2 }}
                >
                  {getStatusIcon(task.status)}
                </IconButton>
                
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                          fontWeight: 500
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Chip 
                        label={task.status} 
                        color={getStatusColor(task.status)} 
                        size="small" 
                      />
                      <Chip 
                        label={task.priority} 
                        color={getPriorityColor(task.priority)} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label={task.category} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                        {task.description}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Due: {task.dueDate} • Created: {task.createdAt}
                      </Typography>
                    </Box>
                  }
                />
                
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      setSelectedTaskId(task.id);
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleEditTask(selectedTaskId)}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteTask(selectedTaskId)}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Create/Edit Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  label="Priority"
                >
                  {priorities.map(priority => (
                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={editingTask ? handleUpdateTask : handleCreateTask}
            variant="contained"
          >
            {editingTask ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TasksPage;
