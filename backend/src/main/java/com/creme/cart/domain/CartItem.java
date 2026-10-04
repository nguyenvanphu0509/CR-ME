package com.creme.cart.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "cart_items")
public class CartItem {
	@Id
	private UUID id;

	@Column(name = "cart_id", nullable = false)
	private UUID cartId;

	@Column(name = "product_id")
	private String productId;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(name = "custom_selection", columnDefinition = "jsonb")
	private Map<String, Object> customSelection;

	@Column(nullable = false)
	private int quantity;

	protected CartItem() {
	}

	public static CartItem product(UUID cartId, String productId, int quantity) {
		CartItem item = new CartItem();
		item.cartId = cartId;
		item.productId = productId;
		item.quantity = quantity;
		return item;
	}

	public static CartItem custom(UUID cartId, Map<String, Object> selection, int quantity) {
		CartItem item = new CartItem();
		item.cartId = cartId;
		item.customSelection = selection;
		item.quantity = quantity;
		return item;
	}

	@jakarta.persistence.PrePersist
	void initialize() { if (id == null) id = UUID.randomUUID(); }

	public UUID getId() { return id; }
	public String getProductId() { return productId; }
	public Map<String, Object> getCustomSelection() { return customSelection; }
	public int getQuantity() { return quantity; }
}
