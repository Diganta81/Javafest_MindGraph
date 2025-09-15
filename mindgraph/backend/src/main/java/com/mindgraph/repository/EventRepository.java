package com.mindgraph.repository;

import com.mindgraph.entity.Event;
import com.mindgraph.entity.EventType;
import com.mindgraph.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findByUser(User user);
    
    List<Event> findByUserAndType(User user, EventType type);
    
    @Query("SELECT e FROM Event e WHERE e.user = :user AND e.startTime BETWEEN :startDate AND :endDate")
    List<Event> findByUserAndTimeBetween(@Param("user") User user, 
                                       @Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT e FROM Event e WHERE e.user = :user AND " +
           "((e.startTime BETWEEN :startTime AND :endTime) OR " +
           "(e.endTime BETWEEN :startTime AND :endTime) OR " +
           "(e.startTime <= :startTime AND e.endTime >= :endTime))")
    List<Event> findConflictingEvents(@Param("user") User user, 
                                     @Param("startTime") LocalDateTime startTime, 
                                     @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT e FROM Event e WHERE e.user = :user AND e.startTime >= :currentTime ORDER BY e.startTime ASC")
    List<Event> findUpcomingEvents(@Param("user") User user, @Param("currentTime") LocalDateTime currentTime);
    
    @Query("SELECT e FROM Event e WHERE e.user = :user AND e.isRecurring = true")
    List<Event> findRecurringEvents(@Param("user") User user);
    
    @Query("SELECT e FROM Event e WHERE e.user = :user AND " +
           "(LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Event> searchEventsByKeyword(@Param("user") User user, @Param("keyword") String keyword);
}
