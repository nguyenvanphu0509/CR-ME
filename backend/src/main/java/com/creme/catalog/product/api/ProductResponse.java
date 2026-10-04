package com.creme.catalog.product.api;

import java.math.BigDecimal;

public record ProductResponse(
		String id,
		String name,
		String description,
		String category,
		BigDecimal price,
		boolean available) {
}
