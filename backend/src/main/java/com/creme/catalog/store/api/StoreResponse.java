package com.creme.catalog.store.api;

import java.math.BigDecimal;
import java.util.Map;

public record StoreResponse(
		String id,
		String name,
		String address,
		String phone,
		BigDecimal latitude,
		BigDecimal longitude,
		Map<String, String> openingHours,
		boolean active) {
}
