package com.creme.catalog.product.application;

import com.creme.catalog.product.api.ProductResponse;
import com.creme.catalog.product.persistence.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {
	private final ProductRepository productRepository;

	public ProductService(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}

	@Transactional(readOnly = true)
	public List<ProductResponse> getAvailableProducts() {
		return productRepository.findByAvailableTrue().stream()
				.map(product -> new ProductResponse(
						product.getId(), product.getName(), product.getDescription(),
						product.getCategory(), product.getPrice(), product.isAvailable()))
				.toList();
	}
}
