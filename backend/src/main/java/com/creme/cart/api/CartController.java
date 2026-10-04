package com.creme.cart.api;

import com.creme.cart.application.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class CartController {
	private final CartService cartService;

	public CartController(CartService cartService) {
		this.cartService = cartService;
	}

	@GetMapping
	public CartResponse getCart(@RequestHeader("X-Guest-Token") String guestToken) {
		return cartService.getGuestCart(guestToken);
	}

	@PostMapping("/items")
	public ResponseEntity<CartResponse> addItem(
			@RequestHeader("X-Guest-Token") String guestToken,
			@Valid @RequestBody AddCartItemRequest request) {
		return ResponseEntity.ok(cartService.addItem(guestToken, request));
	}

	@DeleteMapping("/items/{itemId}")
	public ResponseEntity<Void> removeItem(
			@RequestHeader("X-Guest-Token") String guestToken,
			@PathVariable UUID itemId) {
		cartService.removeItem(guestToken, itemId);
		return ResponseEntity.noContent().build();
	}
}
