package com.mindgraph.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindgraph.dto.*;
import com.mindgraph.entity.*;
import com.mindgraph.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IntelligentChatbotService {
    
    private static final Logger logger = LoggerFactory.getLogger(IntelligentChatbotService.class);
    
    @Autowired
    private GeminiService geminiService;
    
    @Autowired
    private ConversationContextService contextService;
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private TaskService taskService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ChatResponseDTO processMessage(String userMessage, String sessionId, User user) {
        try {
            System.out.println("=== INTELLIGENT CHATBOT DEBUG ===");
            System.out.println("Processing message: " + userMessage);
            System.out.println("Session ID: " + sessionId);
            System.out.println("User: " + user.getUsername());
            
            // Get or create conversation context
            ConversationContextDTO context = contextService.getOrCreateContext(sessionId);
            
            // Analyze intent if no active context or new conversation
            if (context.getCurrentIntent() == null) {
                IntentAnalysisDTO intent = analyzeIntent(userMessage);
                context.setCurrentIntent(intent.getIntent());
                context.setCurrentStep("initial");
                System.out.println("Detected intent: " + intent.getIntent());
            }
            
            String response;
            
            // Route to appropriate handler based on intent
            switch (context.getCurrentIntent().toLowerCase()) {
                case "create_task":
                    response = handleTaskCreation(userMessage, context, user);
                    break;
                case "view_tasks":
                    response = handleViewTasks(userMessage, context, user);
                    break;
                case "edit_task":
                    response = handleEditTask(userMessage, context, user);
                    break;
                case "delete_task":
                    response = handleDeleteTask(userMessage, context, user);
                    break;
                default:
                    response = handleGeneralQuery(userMessage, context, user);
                    break;
            }
            
            // Update conversation history
            contextService.addMessageToHistory(sessionId, userMessage, response);
            
            System.out.println("Generated response: " + response);
            System.out.println("==================================");
            
            return new ChatResponseDTO(response);
            
        } catch (Exception e) {
            logger.error("Error processing intelligent chatbot message", e);
            return new ChatResponseDTO("I'm sorry, I encountered an error while processing your request. Please try again.");
        }
    }

    private IntentAnalysisDTO analyzeIntent(String userMessage) {
        String intentPrompt = createIntentAnalysisPrompt(userMessage);
        String geminiResponse = geminiService.generateResponse(intentPrompt);
        
        try {
            return parseIntentResponse(geminiResponse);
        } catch (Exception e) {
            logger.error("Error parsing intent analysis", e);
            return new IntentAnalysisDTO("general", 0.5, "answer");
        }
    }

    private String createIntentAnalysisPrompt(String userMessage) {
        return "You are an AI assistant for a task management system. Analyze the user's intent and respond with ONLY a JSON object.\n\n" +
                "Look for these intentions:\n" +
                "- create_task: User wants to schedule/create a task (keywords: schedule, create, add, plan, book, appointment, meeting, task, do, work on)\n" +
                "- view_tasks: User wants to see tasks (keywords: show, list, what, tasks, schedule, calendar)\n" +
                "- edit_task: User wants to modify a task (keywords: change, edit, modify, update, reschedule)\n" +
                "- delete_task: User wants to remove a task (keywords: delete, remove, cancel)\n" +
                "- general: Everything else (greetings, questions, general chat)\n\n" +
                "User message: \"" + userMessage + "\"\n\n" +
                "Respond with ONLY this JSON format:\n" +
                "{\n" +
                "  \"intent\": \"create_task\",\n" +
                "  \"confidence\": 0.95,\n" +
                "  \"action\": \"create\",\n" +
                "  \"entity\": \"task\",\n" +
                "  \"explanation\": \"User wants to create a new task\"\n" +
                "}";
    }

    private IntentAnalysisDTO parseIntentResponse(String response) {
        try {
            // Clean the response to extract JSON
            String jsonStr = extractJsonFromResponse(response);
            JsonNode jsonNode = objectMapper.readTree(jsonStr);
            
            IntentAnalysisDTO intent = new IntentAnalysisDTO();
            intent.setIntent(jsonNode.get("intent").asText());
            intent.setConfidence(jsonNode.get("confidence").asDouble());
            intent.setAction(jsonNode.get("action").asText());
            intent.setEntity(jsonNode.get("entity").asText());
            intent.setExplanation(jsonNode.get("explanation").asText());
            
            return intent;
        } catch (Exception e) {
            logger.error("Error parsing intent response: " + response, e);
            return new IntentAnalysisDTO("general", 0.5, "answer");
        }
    }

    private String handleTaskCreation(String userMessage, ConversationContextDTO context, User user) {
        try {
            // Extract task information from current message and context
            TaskExtractionDTO taskData = extractTaskData(userMessage, context);
            
            System.out.println("=== TASK EXTRACTION DEBUG ===");
            System.out.println("Extracted data: " + taskData.toString());
            System.out.println("Has minimum info: " + taskData.hasMinimumRequiredInfo());
            System.out.println("==============================");
            
            if (taskData.hasMinimumRequiredInfo()) {
                // Create the task immediately
                try {
                    Task createdTask = createTaskFromExtraction(taskData, user);
                    contextService.markContextComplete(context.getSessionId());
                    
                    return String.format("✅ Perfect! I've created your task:\n\n" +
                            "**%s**\n" +
                            "📅 %s\n" +
                            "⏰ %s to %s\n" +
                            "📋 Status: %s\n" +
                            "🆔 Task ID: %d\n\n" +
                            "Your task has been added to your schedule!",
                            createdTask.getTitle(),
                            createdTask.getScheduledStartTime().toLocalDate(),
                            createdTask.getScheduledStartTime().toLocalTime(),
                            createdTask.getScheduledEndTime().toLocalTime(),
                            createdTask.getStatus(),
                            createdTask.getId()
                    );
                } catch (Exception e) {
                    logger.error("Failed to create task in database", e);
                    contextService.markContextComplete(context.getSessionId());
                    return "❌ I'm sorry, there was an error saving your task to the database. " +
                           "Error: " + e.getMessage() + 
                           "\n\nPlease try again or contact support if the problem persists.";
                }
            } else {
                // Ask for missing information - but be smart about it
                return generateFollowUpQuestion(taskData, context);
            }
        } catch (Exception e) {
            logger.error("Error handling task creation", e);
            contextService.markContextComplete(context.getSessionId());
            return "I'm having trouble creating the task. Could you try again with: task title, start time, and duration/end time?";
        }
    }

    private TaskExtractionDTO extractTaskData(String userMessage, ConversationContextDTO context) {
        String extractionPrompt = createTaskExtractionPrompt(userMessage, context);
        String geminiResponse = geminiService.generateResponse(extractionPrompt);
        
        try {
            return parseTaskExtractionResponse(geminiResponse);
        } catch (Exception e) {
            logger.error("Error extracting task data", e);
            TaskExtractionDTO taskData = new TaskExtractionDTO();
            taskData.validateAndSetMissingFields();
            return taskData;
        }
    }

    private String createTaskExtractionPrompt(String userMessage, ConversationContextDTO context) {
        return "You are a task scheduling assistant. Extract ONLY these essential details from the user's message:\n\n" +
                "MANDATORY FIELDS (required to create task):\n" +
                "1. Title/task name\n" +
                "2. Start time (when to begin)\n" +
                "3. End time OR duration\n\n" +
                "CONVERSATION HISTORY:\n" + context.getFullConversationHistory() + "\n\n" +
                "CURRENT MESSAGE: \"" + userMessage + "\"\n\n" +
                "Instructions:\n" +
                "- Be smart about date/time interpretation (e.g., 'tomorrow' = next day, 'next Monday' = upcoming Monday)\n" +
                "- If user says 'for 2 hours' extract as duration\n" +
                "- If user says 'from 2pm to 4pm' extract start and end times\n" +
                "- Use current date as base: September 19, 2025\n" +
                "- Default to reasonable times if user is vague (e.g., 'morning' = 9:00 AM)\n\n" +
                "Respond with ONLY a JSON object:\n" +
                "{\n" +
                "  \"title\": \"extracted title or null\",\n" +
                "  \"startTime\": \"2025-09-20T09:00:00 or null\",\n" +
                "  \"endTime\": \"2025-09-20T11:00:00 or null\",\n" +
                "  \"durationMinutes\": 120 or null,\n" +
                "  \"description\": \"any additional context or null\",\n" +
                "  \"extractedInfo\": \"summary of what was found\",\n" +
                "  \"isComplete\": true/false\n" +
                "}";
    }

    private TaskExtractionDTO parseTaskExtractionResponse(String response) {
        try {
            String jsonStr = extractJsonFromResponse(response);
            JsonNode jsonNode = objectMapper.readTree(jsonStr);
            
            TaskExtractionDTO taskData = new TaskExtractionDTO();
            
            // Extract mandatory fields
            taskData.setTitle(getTextValue(jsonNode, "title"));
            taskData.setDescription(getTextValue(jsonNode, "description"));
            taskData.setExtractedInfo(getTextValue(jsonNode, "extractedInfo"));
            
            // Parse start time
            String startTimeStr = getTextValue(jsonNode, "startTime");
            if (startTimeStr != null) {
                try {
                    taskData.setStartTime(LocalDateTime.parse(startTimeStr));
                } catch (Exception e) {
                    logger.warn("Could not parse start time: " + startTimeStr);
                }
            }
            
            // Parse end time
            String endTimeStr = getTextValue(jsonNode, "endTime");
            if (endTimeStr != null) {
                try {
                    taskData.setEndTime(LocalDateTime.parse(endTimeStr));
                } catch (Exception e) {
                    logger.warn("Could not parse end time: " + endTimeStr);
                }
            }
            
            // Parse duration
            if (jsonNode.has("durationMinutes") && !jsonNode.get("durationMinutes").isNull()) {
                taskData.setDurationMinutes(jsonNode.get("durationMinutes").asInt());
            }
            
            // Set optional fields with defaults
            taskData.setType(getTextValue(jsonNode, "type"));
            taskData.setPriority(getTextValue(jsonNode, "priority"));
            
            // Validate and determine completeness
            taskData.validateAndSetMissingFields();
            
            return taskData;
        } catch (Exception e) {
            logger.error("Error parsing task extraction response: " + response, e);
            TaskExtractionDTO taskData = new TaskExtractionDTO();
            taskData.validateAndSetMissingFields();
            return taskData;
        }
    }

    private Task createTaskFromExtraction(TaskExtractionDTO taskData, User user) {
        try {
            System.out.println("=== CREATING TASK FROM EXTRACTION ===");
            System.out.println("User: " + user.getUsername() + " (ID: " + user.getId() + ")");
            System.out.println("Task title: " + taskData.getTitle());
            System.out.println("Start time: " + taskData.getStartTime());
            System.out.println("End time: " + taskData.getCalculatedEndTime());
            
            Task task = new Task();
            task.setTitle(taskData.getTitle());
            task.setDescription(taskData.getDescription());
            task.setUser(user);
            
            // Set scheduling information
            task.setScheduledStartTime(taskData.getStartTime());
            task.setScheduledEndTime(taskData.getCalculatedEndTime());
            
            // Calculate duration if both start and end times are available
            if (taskData.getStartTime() != null && taskData.getCalculatedEndTime() != null) {
                long minutes = java.time.Duration.between(
                    taskData.getStartTime(), 
                    taskData.getCalculatedEndTime()
                ).toMinutes();
                task.setEstimatedDurationMinutes((int) minutes);
            } else if (taskData.getDurationMinutes() != null) {
                task.setEstimatedDurationMinutes(taskData.getDurationMinutes());
            }
            
            // Set enums with defaults
            task.setType(parseTaskType(taskData.getType()));
            task.setPriority(parseTaskPriority(taskData.getPriority()));
            task.setDifficulty(DifficultyLevel.MEDIUM); // Default
            task.setStatus(TaskStatus.PENDING);
            
            System.out.println("Calling taskService.createTask...");
            Task savedTask = taskService.createTask(task);
            System.out.println("Task creation completed successfully!");
            System.out.println("=====================================");
            
            return savedTask;
            
        } catch (Exception e) {
            System.out.println("ERROR in createTaskFromExtraction: " + e.getMessage());
            System.out.println("=====================================");
            logger.error("Error creating task from extraction", e);
            throw new RuntimeException("Failed to create task: " + e.getMessage(), e);
        }
    }

    private String generateFollowUpQuestion(TaskExtractionDTO taskData, ConversationContextDTO context) {
        if (!taskData.hasMinimumRequiredInfo()) {
            String missingFields = taskData.getMissingFieldsAsString();
            
            String questionPrompt = "The user wants to create a task but is missing: " + missingFields + "\n\n" +
                    "What we have so far:\n" +
                    "- Title: " + (taskData.getTitle() != null ? taskData.getTitle() : "missing") + "\n" +
                    "- Start time: " + (taskData.getStartTime() != null ? taskData.getStartTime() : "missing") + "\n" +
                    "- End time/duration: " + (taskData.getCalculatedEndTime() != null ? "provided" : "missing") + "\n\n" +
                    "Generate a SHORT, friendly question to get the missing information. Be specific and direct.\n" +
                    "Examples:\n" +
                    "- 'What should I call this task?'\n" +
                    "- 'When would you like to start this?'\n" +
                    "- 'How long will this take, or when should it end?'\n\n" +
                    "Ask for only ONE missing piece at a time.";
            
            return geminiService.generateResponse(questionPrompt);
        }
        
        return "I have all the information I need. Let me create this task for you!";
    }

    private String handleViewTasks(String userMessage, ConversationContextDTO context, User user) {
        List<Task> userTasks = taskRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        
        if (userTasks.isEmpty()) {
            contextService.markContextComplete(context.getSessionId());
            return "You don't have any tasks yet. Would you like to create a new task?";
        }
        
        StringBuilder response = new StringBuilder("Here are your tasks:\n\n");
        for (int i = 0; i < Math.min(userTasks.size(), 10); i++) {
            Task task = userTasks.get(i);
            response.append(String.format("%d. **%s** (%s)\n   %s\n   Priority: %s | Status: %s\n\n", 
                i + 1, task.getTitle(), task.getType(), 
                task.getDescription() != null ? task.getDescription() : "No description",
                task.getPriority(), task.getStatus()));
        }
        
        if (userTasks.size() > 10) {
            response.append("... and ").append(userTasks.size() - 10).append(" more tasks.");
        }
        
        contextService.markContextComplete(context.getSessionId());
        return response.toString();
    }

    private String handleEditTask(String userMessage, ConversationContextDTO context, User user) {
        contextService.markContextComplete(context.getSessionId());
        return "Task editing functionality is being developed. For now, you can create a new task or view your existing tasks.";
    }

    private String handleDeleteTask(String userMessage, ConversationContextDTO context, User user) {
        contextService.markContextComplete(context.getSessionId());
        return "Task deletion functionality is being developed. For now, you can create a new task or view your existing tasks.";
    }

    private String handleGeneralQuery(String userMessage, ConversationContextDTO context, User user) {
        String generalPrompt = "You are a helpful AI assistant for MindGraph, a task management system. " +
                "Answer the user's question in a friendly and helpful way. If they seem to want to manage tasks, " +
                "guide them towards creating, viewing, or editing tasks.\n\n" +
                "User message: " + userMessage;
        
        contextService.markContextComplete(context.getSessionId());
        return geminiService.generateResponse(generalPrompt);
    }

    // Helper methods
    private String extractJsonFromResponse(String response) {
        // Find JSON in the response
        int start = response.indexOf('{');
        int end = response.lastIndexOf('}');
        if (start != -1 && end != -1 && end > start) {
            return response.substring(start, end + 1);
        }
        throw new IllegalArgumentException("No valid JSON found in response");
    }

    private String getTextValue(JsonNode node, String field) {
        JsonNode fieldNode = node.get(field);
        return (fieldNode != null && !fieldNode.isNull()) ? fieldNode.asText() : null;
    }

    private TaskType parseTaskType(String type) {
        if (type == null) return TaskType.OTHER;
        try {
            return TaskType.valueOf(type.toUpperCase());
        } catch (Exception e) {
            return TaskType.OTHER;
        }
    }

    private TaskPriority parseTaskPriority(String priority) {
        if (priority == null) return TaskPriority.MEDIUM;
        try {
            return TaskPriority.valueOf(priority.toUpperCase());
        } catch (Exception e) {
            return TaskPriority.MEDIUM;
        }
    }
}