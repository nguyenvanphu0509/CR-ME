package com.creme.catalog.flavor.application;

import com.creme.catalog.flavor.api.FlavorResponse;
import com.creme.catalog.flavor.persistence.FlavorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FlavorService {

	private final FlavorRepository flavorRepository;

	public FlavorService(FlavorRepository flavorRepository) {
		this.flavorRepository = flavorRepository;
	}

/*
`@Service` registers the class with Spring so that Spring creates it and injects it into the controller.
1. The repository reads all rows from the `flavors` table.
2. `filter` skips flavors that are temporarily unavailable.
3. `map` converts entities into DTOs.
4. `toList` builds the result list.

`@Transactional(readOnly = true)` declares this a read-only transaction. It suits a list endpoint and makes it clear the service doesn't modify the database.

The controller doesn't read the repository directly. If we later need rules like sorting, searching, pagination or status checks, we put them in the service.

*/
	@Transactional(readOnly = true)
	public List<FlavorResponse> getAvailableFlavors() {
		return flavorRepository.findByAvailableTrue().stream()
				.map(flavor -> new FlavorResponse(
						flavor.getId(),
						flavor.getName(),
						flavor.getTagline(),
						flavor.getDescription(),
						flavor.getCategory(),
						flavor.isAvailable(),
						flavor.getBadge(),
						flavor.getIngredients(),
						flavor.getAllergens(),
						flavor.getTextureNotes(),
						flavor.getPairing()
				))
				.toList();
	}

	@Transactional(readOnly = true)
	public FlavorResponse getAvailableFlavor(String id) {
		return flavorRepository.findById(id)
				.filter(flavor -> flavor.isAvailable())
				.map(flavor -> new FlavorResponse(
						flavor.getId(), flavor.getName(), flavor.getTagline(), flavor.getDescription(),
						flavor.getCategory(), flavor.isAvailable(), flavor.getBadge(), flavor.getIngredients(),
						flavor.getAllergens(), flavor.getTextureNotes(), flavor.getPairing()))
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flavor not found: " + id));
	}
}
