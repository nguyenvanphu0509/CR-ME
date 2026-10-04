package com.creme.catalog.flavor.api;

import java.util.List;

public record FlavorResponse(
		String id,
		String name,
		String tagline,
		String description,
		String category,
		boolean available,
		String badge,
		List<String> ingredients,
		List<String> allergens,
		List<String> textureNotes,
		String pairing) {
}
