package com.creme.cart.api;

import jakarta.validation.constraints.Min;

import java.util.Map;

public record AddCartItemRequest(
		String productId,
		Map<String, Object> customSelection,
		@Min(1) int quantity) {
}
