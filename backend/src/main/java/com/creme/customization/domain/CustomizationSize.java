package com.creme.customization.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "customization_sizes")
public class CustomizationSize {
	@Id
	@Column(length = 50, nullable = false)
	private String id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal price;

	@Column(name = "max_extra_flavors", nullable = false)
	private int maxExtraFlavors;

	@Column(name = "max_toppings", nullable = false)
	private int maxToppings;

	@Column(nullable = false)
	private boolean available;

	protected CustomizationSize() {
	}

	public String getId() { return id; }
	public String getName() { return name; }
	public BigDecimal getPrice() { return price; }
	public int getMaxExtraFlavors() { return maxExtraFlavors; }
	public int getMaxToppings() { return maxToppings; }
	public boolean isAvailable() { return available; }
}
