package com.creme.cart.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "carts")
public class Cart {
	@Id
	private UUID id;

	@Column(name = "user_id")
	private UUID userId;

	@Column(name = "guest_token", unique = true)
	private String guestToken;

	@Column(nullable = false, length = 30)
	private String status;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	protected Cart() {
	}

	public static Cart forGuest(String guestToken) {
		Cart cart = new Cart();
		cart.guestToken = guestToken;
		cart.status = "ACTIVE";
		return cart;
	}

	@PrePersist
	void initialize() {
		if (id == null) id = UUID.randomUUID();
		if (createdAt == null) createdAt = Instant.now();
		updatedAt = Instant.now();
	}

	@PreUpdate
	void touch() { updatedAt = Instant.now(); }

	public UUID getId() { return id; }
	public String getStatus() { return status; }
}
