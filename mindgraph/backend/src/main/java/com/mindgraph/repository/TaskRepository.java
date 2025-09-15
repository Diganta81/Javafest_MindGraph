package com.mindgraph.repository;

import com.mindgraph.entity.Task;
import com.mindgraph.entity.TaskStatus;
import com.mindgraph.entity.TaskPriority;
import com.mindgraph.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByUser(User user);
    
    List<Task> findByUserAndStatus(User user, TaskStatus status);
    
    List<Task> findByUserAndPriority(User user, TaskPriority priority);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.deadline BETWEEN :startDate AND :endDate")
    List<Task> findByUserAndDeadlineBetween(@Param("user") User user, 
                                          @Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.scheduledStartTime BETWEEN :startDate AND :endDate")
    List<Task> findByUserAndScheduledTimeBetween(@Param("user") User user, 
                                                @Param("startDate") LocalDateTime startDate, 
                                                @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.status = :status AND t.deadline < :currentTime")
    List<Task> findOverdueTasks(@Param("user") User user, 
                               @Param("status") TaskStatus status, 
                               @Param("currentTime") LocalDateTime currentTime);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.status IN :statuses ORDER BY t.priority DESC, t.deadline ASC")
    List<Task> findTasksByStatusOrderedByPriorityAndDeadline(@Param("user") User user, 
                                                           @Param("statuses") List<TaskStatus> statuses);
    
    @Query("SELECT t FROM Task t WHERE t.parentTask IS NULL AND t.user = :user")
    List<Task> findRootTasksByUser(@Param("user") User user);
    
    @Query("SELECT t FROM Task t WHERE t.parentTask = :parentTask")
    List<Task> findSubtasksByParentTask(@Param("parentTask") Task parentTask);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.user = :user AND t.status = :status")
    Long countTasksByUserAndStatus(@Param("user") User user, @Param("status") TaskStatus status);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND " +
           "(LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Task> searchTasksByKeyword(@Param("user") User user, @Param("keyword") String keyword);
}
