package com.creme.catalog.topping.api;

import java.math.BigDecimal;

public record ToppingResponse(
		String id,
		String name,
		String category,
		String description,
		BigDecimal price,
		boolean available) {
}
