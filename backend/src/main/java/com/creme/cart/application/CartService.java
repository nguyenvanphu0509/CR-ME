package com.creme.cart.application;

import com.creme.cart.api.AddCartItemRequest;
import com.creme.cart.api.CartItemResponse;
import com.creme.cart.api.CartResponse;
import com.creme.cart.domain.Cart;
import com.creme.cart.domain.CartItem;
import com.creme.cart.persistence.CartItemRepository;
import com.creme.cart.persistence.CartRepository;
import com.creme.catalog.product.persistence.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class CartService {
	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;

	public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
			ProductRepository productRepository) {
		this.cartRepository = cartRepository;
		this.cartItemRepository = cartItemRepository;
		this.productRepository = productRepository;
	}

	@Transactional(readOnly = true)
	public CartResponse getGuestCart(String guestToken) {
		Cart cart = findOrCreateGuestCart(guestToken);
		return toResponse(cart);
	}

	@Transactional
	public CartResponse addItem(String guestToken, AddCartItemRequest request) {
		if ((request.productId() == null) == (request.customSelection() == null)) {
			throw new IllegalArgumentException("Provide either productId or customSelection");
		}
		if (request.productId() != null && productRepository.findById(request.productId())
				.filter(product -> product.isAvailable()).isEmpty()) {
			throw new IllegalArgumentException("Product is unavailable: " + request.productId());
		}
		Cart cart = findOrCreateGuestCart(guestToken);
		CartItem item = request.productId() != null
				? CartItem.product(cart.getId(), request.productId(), request.quantity())
				: CartItem.custom(cart.getId(), request.customSelection(), request.quantity());
		cartItemRepository.save(item);
		return toResponse(cart);
	}

	@Transactional
	public void removeItem(String guestToken, UUID itemId) {
		Cart cart = findOrCreateGuestCart(guestToken);
		CartItem item = cartItemRepository.findById(itemId)
				.orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
		if (!cartItemRepository.findByCartId(cart.getId()).stream().anyMatch(existing -> existing.getId().equals(item.getId()))) {
			throw new IllegalArgumentException("Cart item does not belong to this cart");
		}
		cartItemRepository.delete(item);
	}

	@Transactional
	public Cart findOrCreateGuestCart(String guestToken) {
		if (guestToken == null || guestToken.isBlank()) {
			throw new IllegalArgumentException("X-Guest-Token is required");
		}
		return cartRepository.findByGuestTokenAndStatus(guestToken, "ACTIVE")
				.orElseGet(() -> cartRepository.save(Cart.forGuest(guestToken)));
	}

	private CartResponse toResponse(Cart cart) {
		List<CartItemResponse> items = cartItemRepository.findByCartId(cart.getId()).stream()
				.map(item -> new CartItemResponse(item.getId(), item.getProductId(), item.getCustomSelection(), item.getQuantity()))
				.toList();
		return new CartResponse(cart.getId(), cart.getStatus(), items);
	}
}
