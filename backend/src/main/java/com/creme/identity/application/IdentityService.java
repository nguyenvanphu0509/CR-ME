package com.creme.identity.application;

import com.creme.identity.api.RegisterRequest;
import com.creme.identity.api.UserResponse;
import com.creme.identity.domain.User;
import com.creme.identity.persistence.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IdentityService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public IdentityService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional
	public UserResponse register(RegisterRequest request) {
		if (userRepository.existsByEmailIgnoreCase(request.email())) {
			throw new IllegalArgumentException("Email is already registered");
		}
		User user = userRepository.save(new User(
				request.email().trim().toLowerCase(),
				passwordEncoder.encode(request.password()),
				request.displayName().trim()));
		return new UserResponse(user.getId(), user.getEmail(), user.getDisplayName(), user.getRole());
	}
}
