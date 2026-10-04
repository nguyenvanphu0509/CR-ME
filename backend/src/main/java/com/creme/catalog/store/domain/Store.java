package com.creme.catalog.store.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.Map;

@Entity
@Table(name = "stores")
public class Store {
	@Id
	@Column(length = 100, nullable = false)
	private String id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String address;

	@Column(length = 50)
	private String phone;

	@Column(precision = 9, scale = 6)
	private BigDecimal latitude;

	@Column(precision = 9, scale = 6)
	private BigDecimal longitude;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(name = "opening_hours", nullable = false, columnDefinition = "jsonb")
	private Map<String, String> openingHours;

	@Column(nullable = false)
	private boolean active;

	protected Store() {
	}

	public String getId() { return id; }
	public String getName() { return name; }
	public String getAddress() { return address; }
	public String getPhone() { return phone; }
	public BigDecimal getLatitude() { return latitude; }
	public BigDecimal getLongitude() { return longitude; }
	public Map<String, String> getOpeningHours() { return openingHours; }
	public boolean isActive() { return active; }
}
