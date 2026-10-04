package com.creme.order.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order {
	@Id
	private UUID id;

	@Column(name = "order_code", nullable = false, unique = true, length = 50)
	private String orderCode;

	@Column(name = "user_id")
	private UUID userId;

	@Column(name = "store_id", nullable = false, length = 100)
	private String storeId;

	@Column(name = "customer_name", nullable = false)
	private String customerName;

	@Column(name = "customer_phone", nullable = false, length = 50)
	private String customerPhone;

	@Column(nullable = false, length = 30)
	private String status;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal subtotal;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal total;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	protected Order() {
	}

	public Order(String orderCode, String storeId, String customerName, String customerPhone,
			BigDecimal subtotal, BigDecimal total) {
		this.orderCode = orderCode;
		this.storeId = storeId;
		this.customerName = customerName;
		this.customerPhone = customerPhone;
		this.status = "PENDING";
		this.subtotal = subtotal;
		this.total = total;
	}

	@PrePersist
	void initialize() {
		if (id == null) id = UUID.randomUUID();
		if (createdAt == null) createdAt = Instant.now();
	}

	public UUID getId() { return id; }
	public String getOrderCode() { return orderCode; }
	public String getStatus() { return status; }
	public BigDecimal getSubtotal() { return subtotal; }
	public BigDecimal getTotal() { return total; }
}
