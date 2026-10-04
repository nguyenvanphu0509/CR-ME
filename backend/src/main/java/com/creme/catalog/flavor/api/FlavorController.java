package com.creme.catalog.flavor.api;

import com.creme.catalog.flavor.application.FlavorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
/*
- `@RestController`: the returned value is converted to JSON by Spring.
- `@RequestMapping("/api/flavors")`: the endpoint prefix.
- `@GetMapping`: this method handles HTTP GET at the prefix.
- Combined, they form `GET /api/flavors`.
*/
@RestController
@RequestMapping("/api/flavors")
public class FlavorController {

	private final FlavorService flavorService;

	public FlavorController(FlavorService flavorService) {
		this.flavorService = flavorService;
	}

	@GetMapping
	public List<FlavorResponse> getFlavors() {
		return flavorService.getAvailableFlavors();
	}
}
