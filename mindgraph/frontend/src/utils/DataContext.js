import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Tasks state with localStorage persistence
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('mindgraph_tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: 1,
        title: 'Complete project proposal',
        description: 'Finalize the Q4 project proposal for client review',
        priority: 'high',
        status: 'in-progress',
        dueDate: '2025-09-16',
        category: 'work',
        createdAt: new Date('2025-09-14').toISOString()
      },
      {
        id: 2,
        title: 'Team meeting preparation',
        description: 'Prepare agenda and materials for weekly team sync',
        priority: 'medium',
        status: 'pending',
        dueDate: '2025-09-17',
        category: 'work',
        createdAt: new Date('2025-09-15').toISOString()
      },
      {
        id: 3,
        title: 'Update portfolio website',
        description: 'Add recent projects and update resume section',
        priority: 'low',
        status: 'pending',
        dueDate: '2025-09-20',
        category: 'personal',
        createdAt: new Date('2025-09-15').toISOString()
      }
    ];
  });

  // Events state with localStorage persistence
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('mindgraph_events');
    let parsedEvents = savedEvents ? JSON.parse(savedEvents) : [
      {
        id: 1,
        title: 'Project Deadline',
        date: '2025-09-16',
        startTime: '17:00',
        endTime: '18:00',
        type: 'deadline',
        description: 'Final submission for Q4 proposal',
        priority: 'high',
        location: '',
        attendees: [],
        taskId: 1
      },
      {
        id: 2,
        title: 'Team Meeting',
        date: '2025-09-17',
        startTime: '10:00',
        endTime: '11:00',
        type: 'meeting',
        description: 'Weekly team sync and progress review',
        priority: 'medium',
        location: 'Conference Room A',
        attendees: ['John', 'Sarah', 'Mike'],
        taskId: 2
      },
      {
        id: 3,
        title: 'Client Presentation',
        date: '2025-09-18',
        startTime: '14:00',
        endTime: '15:30',
        type: 'meeting',
        description: 'Present Q4 proposal to client stakeholders',
        priority: 'high',
        location: 'Client Office',
        attendees: ['Client Team']
      }
    ];

    // Migrate old event structure to new structure
    if (parsedEvents && Array.isArray(parsedEvents)) {
      parsedEvents = parsedEvents.map(event => {
        if (event.time && !event.startTime) {
          // Migrate old 'time' property to 'startTime' and 'endTime'
          const startTime = event.time;
          const [hour, minute] = startTime.split(':');
          const endHour = parseInt(hour) + 1;
          const endTime = `${endHour.toString().padStart(2, '0')}:${minute}`;
          
          return {
            ...event,
            startTime: startTime,
            endTime: endTime,
            location: event.location || '',
            attendees: event.attendees || []
          };
        }
        return {
          ...event,
          location: event.location || '',
          attendees: event.attendees || []
        };
      });
    }

    return parsedEvents;
  });

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('mindgraph_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('mindgraph_events', JSON.stringify(events));
  }, [events]);

  // Task management functions
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(), // Simple ID generation
      ...taskData,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);

    // Auto-create calendar event if task has due date
    if (taskData.dueDate) {
      const newEvent = {
        id: Date.now() + 1,
        title: `Task: ${taskData.title}`,
        date: taskData.dueDate,
        startTime: '09:00', // Default start time
        endTime: '10:00', // Default end time
        type: 'deadline',
        description: taskData.description,
        priority: taskData.priority,
        location: '',
        attendees: [],
        taskId: newTask.id
      };
      setEvents(prev => [...prev, newEvent]);
    }

    return newTask;
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));

    // Update related calendar event if due date changed
    if (updates.dueDate || updates.title || updates.description) {
      setEvents(prev => prev.map(event => 
        event.taskId === taskId ? {
          ...event,
          title: updates.title ? `Task: ${updates.title}` : event.title,
          date: updates.dueDate || event.date,
          description: updates.description || event.description,
          priority: updates.priority || event.priority
        } : event
      ));
    }
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    // Remove related calendar event
    setEvents(prev => prev.filter(event => event.taskId !== taskId));
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' 
          ? 'pending' 
          : task.status === 'pending' 
            ? 'in-progress'
            : 'completed';
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  // Event management functions
  const addEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      ...eventData
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (eventId, updates) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  // Statistics calculations
  const getStats = () => {
    const safeTasks = tasks || [];
    const safeEvents = events || [];
    
    const totalTasks = safeTasks.length;
    const completedTasks = safeTasks.filter(t => t.status === 'completed').length;
    const pendingTasks = safeTasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = safeTasks.filter(t => t.status === 'in-progress').length;
    const highPriorityTasks = safeTasks.filter(t => t.priority === 'high').length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayEvents = safeEvents.filter(e => e.date === today).length;
    
    // Calculate upcoming deadlines (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingDeadlines = safeTasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= new Date() && dueDate <= nextWeek;
    }).length;
    
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      highPriorityTasks,
      todayEvents,
      upcomingDeadlines,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    if (!events || !Array.isArray(events)) return [];
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  // Get tasks due soon (next 7 days)
  const getTasksDueSoon = () => {
    const safeTasks = tasks || [];
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return safeTasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    });
  };

  // Clear all data (for testing/reset purposes)
  const clearAllData = () => {
    localStorage.removeItem('mindgraph_tasks');
    localStorage.removeItem('mindgraph_events');
    window.location.reload(); // Reload to reset state
  };

  const value = {
    // Data
    tasks,
    events,
    
    // Task functions
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    
    // Event functions
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    
    // Utility functions
    getStats,
    getTasksDueSoon,
    clearAllData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};