package com.creme.catalog.product.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {
	@Id
	@Column(length = 100, nullable = false)
	private String id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String description;

	@Column(nullable = false, length = 50)
	private String category;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal price;

	@Column(nullable = false)
	private boolean available;

	protected Product() {
	}

	public String getId() { return id; }
	public String getName() { return name; }
	public String getDescription() { return description; }
	public String getCategory() { return category; }
	public BigDecimal getPrice() { return price; }
	public boolean isAvailable() { return available; }
}
