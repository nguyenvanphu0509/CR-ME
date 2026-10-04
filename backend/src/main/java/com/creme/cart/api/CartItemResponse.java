package com.creme.cart.api;

import java.util.Map;
import java.util.UUID;

public record CartItemResponse(
		UUID id,
		String productId,
		Map<String, Object> customSelection,
		int quantity) {
}
