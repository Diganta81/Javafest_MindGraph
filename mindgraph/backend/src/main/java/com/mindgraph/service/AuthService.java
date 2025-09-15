package com.mindgraph.service;

import com.mindgraph.dto.JwtResponseDTO;
import com.mindgraph.dto.LoginRequestDTO;
import com.mindgraph.dto.UserRegistrationDTO;
import com.mindgraph.entity.User;
import com.mindgraph.entity.UserPreference;
import com.mindgraph.repository.UserRepository;
import com.mindgraph.repository.UserPreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPreferenceRepository userPreferenceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    public JwtResponseDTO authenticateUser(LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = (User) authentication.getPrincipal();
        return new JwtResponseDTO(jwt, user.getUsername(), user.getEmail(), 
                                 user.getFirstName(), user.getLastName());
    }

    public User registerUser(UserRegistrationDTO registrationRequest) {
        if (userRepository.existsByUsername(registrationRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Create new user
        User user = new User(registrationRequest.getUsername(),
                           registrationRequest.getEmail(),
                           passwordEncoder.encode(registrationRequest.getPassword()));

        user.setFirstName(registrationRequest.getFirstName());
        user.setLastName(registrationRequest.getLastName());

        User savedUser = userRepository.save(user);

        // Create default preferences for new user
        UserPreference preferences = new UserPreference(savedUser);
        userPreferenceRepository.save(preferences);

        return savedUser;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        throw new RuntimeException("User not authenticated");
    }
}
