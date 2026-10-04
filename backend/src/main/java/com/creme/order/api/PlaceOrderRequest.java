package com.creme.order.api;

import jakarta.validation.constraints.NotBlank;

public record PlaceOrderRequest(
		@NotBlank String storeId,
		@NotBlank String customerName,
		@NotBlank String customerPhone) {
}
