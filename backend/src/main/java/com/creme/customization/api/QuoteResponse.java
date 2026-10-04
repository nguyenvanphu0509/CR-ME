package com.creme.customization.api;

import java.math.BigDecimal;
import java.util.List;

public record QuoteResponse(
		String baseFlavorId,
		List<String> extraFlavorIds,
		List<String> toppingIds,
		String sizeId,
		String sizeName,
		BigDecimal basePrice,
		BigDecimal toppingsPrice,
		BigDecimal total) {
}
