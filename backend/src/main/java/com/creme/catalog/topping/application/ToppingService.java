package com.creme.catalog.topping.application;

import com.creme.catalog.topping.api.ToppingResponse;
import com.creme.catalog.topping.persistence.ToppingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ToppingService {
	private final ToppingRepository toppingRepository;

	public ToppingService(ToppingRepository toppingRepository) {
		this.toppingRepository = toppingRepository;
	}

	@Transactional(readOnly = true)
	public List<ToppingResponse> getAvailableToppings() {
		return toppingRepository.findByAvailableTrue().stream()
				.map(topping -> new ToppingResponse(
						topping.getId(), topping.getName(), topping.getCategory(),
						topping.getDescription(), topping.getPrice(), topping.isAvailable()))
				.toList();
	}

	@Transactional(readOnly = true)
	public ToppingResponse getAvailableTopping(String id) {
		return toppingRepository.findById(id)
				.filter(topping -> topping.isAvailable())
				.map(topping -> new ToppingResponse(
						topping.getId(), topping.getName(), topping.getCategory(), topping.getDescription(),
						topping.getPrice(), topping.isAvailable()))
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topping not found: " + id));
	}
}
