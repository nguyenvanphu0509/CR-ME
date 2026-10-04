package com.creme.customization.application;

import com.creme.catalog.flavor.api.FlavorResponse;
import com.creme.catalog.flavor.application.FlavorService;
import com.creme.catalog.topping.api.ToppingResponse;
import com.creme.catalog.topping.application.ToppingService;
import com.creme.customization.api.QuoteRequest;
import com.creme.customization.api.QuoteResponse;
import com.creme.customization.domain.CustomizationSize;
import com.creme.customization.persistence.CustomizationSizeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CustomizationService {
	private final FlavorService flavorService;
	private final ToppingService toppingService;
	private final CustomizationSizeRepository sizeRepository;

	public CustomizationService(FlavorService flavorService, ToppingService toppingService,
			CustomizationSizeRepository sizeRepository) {
		this.flavorService = flavorService;
		this.toppingService = toppingService;
		this.sizeRepository = sizeRepository;
	}

	@Transactional(readOnly = true)
	public QuoteResponse quote(QuoteRequest request) {
		CustomizationSize size = sizeRepository.findById(request.sizeId())
				.filter(CustomizationSize::isAvailable)
				.orElseThrow(() -> new IllegalArgumentException("Size is unavailable: " + request.sizeId()));

		if (new HashSet<>(request.extraFlavorIds()).size() != request.extraFlavorIds().size()) {
			throw new IllegalArgumentException("Extra flavors must be unique");
		}
		if (new HashSet<>(request.toppingIds()).size() != request.toppingIds().size()) {
			throw new IllegalArgumentException("Toppings must be unique");
		}
		if (request.extraFlavorIds().size() > size.getMaxExtraFlavors()) {
			throw new IllegalArgumentException("Too many extra flavors for this size");
		}
		if (request.toppingIds().size() > size.getMaxToppings()) {
			throw new IllegalArgumentException("Too many toppings for this size");
		}

		FlavorResponse baseFlavor = flavorService.getAvailableFlavor(request.baseFlavorId());
		request.extraFlavorIds().forEach(flavorService::getAvailableFlavor);
		List<ToppingResponse> toppings = request.toppingIds().stream()
				.map(toppingService::getAvailableTopping)
				.toList();

		BigDecimal toppingsPrice = toppings.stream()
				.map(ToppingResponse::price)
				.reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal basePrice = size.getPrice();

		return new QuoteResponse(
				baseFlavor.id(),
				List.copyOf(request.extraFlavorIds()),
				List.copyOf(request.toppingIds()),
				size.getId(),
				size.getName(),
				basePrice,
				toppingsPrice,
				basePrice.add(toppingsPrice));
	}
}
