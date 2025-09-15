package com.mindgraph.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TaskType type;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.PENDING;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TaskPriority priority = TaskPriority.MEDIUM;

    @NotNull
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty = DifficultyLevel.MEDIUM;

    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes;

    @Column(name = "actual_duration_minutes")
    private Integer actualDurationMinutes;

    @Column(name = "deadline")
    private LocalDateTime deadline;

    @Column(name = "scheduled_start_time")
    private LocalDateTime scheduledStartTime;

    @Column(name = "scheduled_end_time")
    private LocalDateTime scheduledEndTime;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_task_id")
    private Task parentTask;

    @OneToMany(mappedBy = "parentTask", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Task> subtasks = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "task_resources", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "resource_url")
    private List<String> resources = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "task_tags", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (status == TaskStatus.COMPLETED && completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }

    // Constructors
    public Task() {}

    public Task(String title, TaskType type, User user) {
        this.title = title;
        this.type = type;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public TaskType getType() { return type; }
    public void setType(TaskType type) { this.type = type; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }

    public DifficultyLevel getDifficulty() { return difficulty; }
    public void setDifficulty(DifficultyLevel difficulty) { this.difficulty = difficulty; }

    public Integer getEstimatedDurationMinutes() { return estimatedDurationMinutes; }
    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) { 
        this.estimatedDurationMinutes = estimatedDurationMinutes; 
    }

    public Integer getActualDurationMinutes() { return actualDurationMinutes; }
    public void setActualDurationMinutes(Integer actualDurationMinutes) { 
        this.actualDurationMinutes = actualDurationMinutes; 
    }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public LocalDateTime getScheduledStartTime() { return scheduledStartTime; }
    public void setScheduledStartTime(LocalDateTime scheduledStartTime) { 
        this.scheduledStartTime = scheduledStartTime; 
    }

    public LocalDateTime getScheduledEndTime() { return scheduledEndTime; }
    public void setScheduledEndTime(LocalDateTime scheduledEndTime) { 
        this.scheduledEndTime = scheduledEndTime; 
    }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Task getParentTask() { return parentTask; }
    public void setParentTask(Task parentTask) { this.parentTask = parentTask; }

    public List<Task> getSubtasks() { return subtasks; }
    public void setSubtasks(List<Task> subtasks) { this.subtasks = subtasks; }

    public List<String> getResources() { return resources; }
    public void setResources(List<String> resources) { this.resources = resources; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
