package com.mindgraph.service;

import com.mindgraph.entity.Task;
import com.mindgraph.entity.TaskStatus;
import com.mindgraph.entity.User;
import com.mindgraph.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    
    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);
    
    @Autowired
    private TaskRepository taskRepository;

    public Task createTask(Task task) {
        try {
            System.out.println("=== TASK CREATION DEBUG ===");
            System.out.println("Creating task: " + task.getTitle());
            System.out.println("User ID: " + (task.getUser() != null ? task.getUser().getId() : "NULL"));
            System.out.println("User username: " + (task.getUser() != null ? task.getUser().getUsername() : "NULL"));
            System.out.println("Start time: " + task.getScheduledStartTime());
            System.out.println("End time: " + task.getScheduledEndTime());
            System.out.println("Status: " + task.getStatus());
            System.out.println("Type: " + task.getType());
            
            // Ensure required fields are set
            if (task.getCreatedAt() == null) {
                task.setCreatedAt(LocalDateTime.now());
            }
            task.setUpdatedAt(LocalDateTime.now());
            
            // Validate required fields
            if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
                throw new IllegalArgumentException("Task title is required");
            }
            if (task.getUser() == null) {
                throw new IllegalArgumentException("Task must be associated with a user");
            }
            if (task.getUser().getId() == null) {
                throw new IllegalArgumentException("User must have a valid ID");
            }
            
            logger.info("Saving task to database: {}", task.getTitle());
            Task savedTask = taskRepository.save(task);
            
            System.out.println("Task saved successfully with ID: " + savedTask.getId());
            System.out.println("===========================");
            
            logger.info("Task created successfully: {} (ID: {})", savedTask.getTitle(), savedTask.getId());
            return savedTask;
            
        } catch (Exception e) {
            System.out.println("ERROR creating task: " + e.getMessage());
            System.out.println("===========================");
            logger.error("Error creating task", e);
            throw new RuntimeException("Failed to create task: " + e.getMessage(), e);
        }
    }

    public Task updateTask(Task task) {
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> getTasksByUser(User user) {
        return taskRepository.findByUser(user);
    }

    public List<Task> getTasksByUserAndStatus(User user, TaskStatus status) {
        return taskRepository.findByUserAndStatus(user, status);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Task markTaskComplete(Long id) {
        Optional<Task> taskOpt = taskRepository.findById(id);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setStatus(TaskStatus.COMPLETED);
            task.setCompletedAt(LocalDateTime.now());
            task.setUpdatedAt(LocalDateTime.now());
            return taskRepository.save(task);
        }
        throw new RuntimeException("Task not found with id: " + id);
    }

    public List<Task> searchTasksByKeyword(User user, String keyword) {
        return taskRepository.searchTasksByKeyword(user, keyword);
    }

    public Long countTasksByUserAndStatus(User user, TaskStatus status) {
        return taskRepository.countTasksByUserAndStatus(user, status);
    }
}