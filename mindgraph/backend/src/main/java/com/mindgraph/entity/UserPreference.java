package com.mindgraph.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "user_preferences")
public class UserPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Work schedule preferences
    @Column(name = "preferred_work_start_time")
    private LocalTime preferredWorkStartTime;

    @Column(name = "preferred_work_end_time")
    private LocalTime preferredWorkEndTime;

    // Energy level preferences
    @Min(1) @Max(5)
    @Column(name = "morning_energy_level")
    private Integer morningEnergyLevel = 3;

    @Min(1) @Max(5)
    @Column(name = "afternoon_energy_level")
    private Integer afternoonEnergyLevel = 3;

    @Min(1) @Max(5)
    @Column(name = "evening_energy_level")
    private Integer eveningEnergyLevel = 3;

    // Task preferences
    @Min(15) @Max(480)
    @Column(name = "preferred_break_duration_minutes")
    private Integer preferredBreakDurationMinutes = 15;

    @Min(30) @Max(300)
    @Column(name = "max_continuous_work_minutes")
    private Integer maxContinuousWorkMinutes = 120;

    @Min(5) @Max(60)
    @Column(name = "buffer_time_minutes")
    private Integer bufferTimeMinutes = 15;

    // Notification preferences
    @Column(name = "enable_notifications")
    private Boolean enableNotifications = true;

    @Column(name = "default_reminder_minutes")
    private Integer defaultReminderMinutes = 15;

    @Column(name = "enable_smart_scheduling")
    private Boolean enableSmartScheduling = true;

    // AI learning preferences
    @Column(name = "allow_ai_learning")
    private Boolean allowAiLearning = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public UserPreference() {}

    public UserPreference(User user) {
        this.user = user;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalTime getPreferredWorkStartTime() { return preferredWorkStartTime; }
    public void setPreferredWorkStartTime(LocalTime preferredWorkStartTime) { 
        this.preferredWorkStartTime = preferredWorkStartTime; 
    }

    public LocalTime getPreferredWorkEndTime() { return preferredWorkEndTime; }
    public void setPreferredWorkEndTime(LocalTime preferredWorkEndTime) { 
        this.preferredWorkEndTime = preferredWorkEndTime; 
    }

    public Integer getMorningEnergyLevel() { return morningEnergyLevel; }
    public void setMorningEnergyLevel(Integer morningEnergyLevel) { 
        this.morningEnergyLevel = morningEnergyLevel; 
    }

    public Integer getAfternoonEnergyLevel() { return afternoonEnergyLevel; }
    public void setAfternoonEnergyLevel(Integer afternoonEnergyLevel) { 
        this.afternoonEnergyLevel = afternoonEnergyLevel; 
    }

    public Integer getEveningEnergyLevel() { return eveningEnergyLevel; }
    public void setEveningEnergyLevel(Integer eveningEnergyLevel) { 
        this.eveningEnergyLevel = eveningEnergyLevel; 
    }

    public Integer getPreferredBreakDurationMinutes() { return preferredBreakDurationMinutes; }
    public void setPreferredBreakDurationMinutes(Integer preferredBreakDurationMinutes) { 
        this.preferredBreakDurationMinutes = preferredBreakDurationMinutes; 
    }

    public Integer getMaxContinuousWorkMinutes() { return maxContinuousWorkMinutes; }
    public void setMaxContinuousWorkMinutes(Integer maxContinuousWorkMinutes) { 
        this.maxContinuousWorkMinutes = maxContinuousWorkMinutes; 
    }

    public Integer getBufferTimeMinutes() { return bufferTimeMinutes; }
    public void setBufferTimeMinutes(Integer bufferTimeMinutes) { 
        this.bufferTimeMinutes = bufferTimeMinutes; 
    }

    public Boolean getEnableNotifications() { return enableNotifications; }
    public void setEnableNotifications(Boolean enableNotifications) { 
        this.enableNotifications = enableNotifications; 
    }

    public Integer getDefaultReminderMinutes() { return defaultReminderMinutes; }
    public void setDefaultReminderMinutes(Integer defaultReminderMinutes) { 
        this.defaultReminderMinutes = defaultReminderMinutes; 
    }

    public Boolean getEnableSmartScheduling() { return enableSmartScheduling; }
    public void setEnableSmartScheduling(Boolean enableSmartScheduling) { 
        this.enableSmartScheduling = enableSmartScheduling; 
    }

    public Boolean getAllowAiLearning() { return allowAiLearning; }
    public void setAllowAiLearning(Boolean allowAiLearning) { 
        this.allowAiLearning = allowAiLearning; 
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
