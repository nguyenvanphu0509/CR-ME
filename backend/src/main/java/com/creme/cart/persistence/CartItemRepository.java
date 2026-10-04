package com.creme.cart.persistence;

import com.creme.cart.domain.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
	List<CartItem> findByCartId(UUID cartId);
}
