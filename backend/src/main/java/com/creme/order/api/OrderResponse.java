package com.creme.order.api;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderResponse(
		UUID id,
		String orderCode,
		String status,
		BigDecimal subtotal,
		BigDecimal total) {
}
