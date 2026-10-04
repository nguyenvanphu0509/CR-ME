package com.creme.customization.api;

import com.creme.customization.application.CustomizationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/custom-ice-creams")
public class CustomizationController {
	private final CustomizationService customizationService;

	public CustomizationController(CustomizationService customizationService) {
		this.customizationService = customizationService;
	}

	@PostMapping("/quote")
	public ResponseEntity<QuoteResponse> quote(@Valid @RequestBody QuoteRequest request) {
		return ResponseEntity.ok(customizationService.quote(request));
	}
}
