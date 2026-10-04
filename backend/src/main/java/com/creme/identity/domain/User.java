package com.creme.identity.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {
	@Id
	private UUID id;

	@Column(nullable = false, unique = true, length = 320)
	private String email;

	@Column(name = "password_hash", nullable = false, columnDefinition = "TEXT")
	private String passwordHash;

	@Column(name = "display_name", nullable = false)
	private String displayName;

	@Column(nullable = false, length = 30)
	private String role;

	@Column(nullable = false)
	private boolean active;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	protected User() {
	}

	public User(String email, String passwordHash, String displayName) {
		this.email = email;
		this.passwordHash = passwordHash;
		this.displayName = displayName;
		this.role = "CUSTOMER";
		this.active = true;
	}

	@PrePersist
	void initialize() {
		if (id == null) id = UUID.randomUUID();
		if (createdAt == null) createdAt = Instant.now();
	}

	public UUID getId() { return id; }
	public String getEmail() { return email; }
	public String getDisplayName() { return displayName; }
	public String getRole() { return role; }
	public boolean isActive() { return active; }
}
