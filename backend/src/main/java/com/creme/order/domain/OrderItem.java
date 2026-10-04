package com.creme.order.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "order_items")
public class OrderItem {
	@Id
	private UUID id;

	@Column(name = "order_id", nullable = false)
	private UUID orderId;

	@Column(name = "product_id")
	private String productId;

	@Column(name = "item_name", nullable = false)
	private String itemName;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(name = "custom_selection", columnDefinition = "jsonb")
	private Map<String, Object> customSelection;

	@Column(nullable = false)
	private int quantity;

	@Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
	private BigDecimal unitPrice;

	@Column(name = "line_total", nullable = false, precision = 10, scale = 2)
	private BigDecimal lineTotal;

	protected OrderItem() {
	}

	public OrderItem(UUID orderId, String productId, String itemName, Map<String, Object> customSelection,
			int quantity, BigDecimal unitPrice) {
		this.orderId = orderId;
		this.productId = productId;
		this.itemName = itemName;
		this.customSelection = customSelection;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
	}

	@PrePersist
	void initialize() { if (id == null) id = UUID.randomUUID(); }
}
