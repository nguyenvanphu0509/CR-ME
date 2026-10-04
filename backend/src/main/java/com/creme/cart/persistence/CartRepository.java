package com.creme.cart.persistence;

import com.creme.cart.domain.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {
	Optional<Cart> findByGuestTokenAndStatus(String guestToken, String status);
}
