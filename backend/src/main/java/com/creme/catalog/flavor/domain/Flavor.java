package com.creme.catalog.flavor.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

/*
- `@Entity`: bao cho JPA biet class nay la object duoc luu trong database.
- `@Table(name = "flavors")`: class `Flavor` anh xa vao bang `flavors`.
- `@Id`: danh dau khoa chinh. O day `id` la chuoi, vi du `vanilla-gold`.
- `@Column(...)`: cau hinh cot, do dai va viec cot co duoc phep rong hay khong.
 */

@Entity
@Table(name = "flavors")
public class Flavor {

	@Id
	@Column(length = 100, nullable = false)
	private String id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String description;

	@Column(nullable = false, length = 50)
	private String category;

	@Column(nullable = false)
	private boolean available;

	@Column(nullable = false)
	private String badge;

	@Column(name = "tagline", nullable = false, columnDefinition = "TEXT")
	private String tagline;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(nullable = false, columnDefinition = "jsonb")
	private List<String> ingredients;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(nullable = false, columnDefinition = "jsonb")
	private List<String> allergens;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(name = "texture_notes", nullable = false, columnDefinition = "jsonb")
	private List<String> textureNotes;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String pairing;

	protected Flavor() {
	}

	public Flavor(String id, String name, String tagline, String description, String category,
			boolean available, String badge, List<String> ingredients, List<String> allergens,
			List<String> textureNotes, String pairing) {
		this.id = id;
		this.name = name;
		this.tagline = tagline;
		this.description = description;
		this.category = category;
		this.available = available;
		this.badge = badge;
		this.ingredients = ingredients;
		this.allergens = allergens;
		this.textureNotes = textureNotes;
		this.pairing = pairing;
	}

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getTagline() {
		return tagline;
	}

	public String getDescription() {
		return description;
	}

	public String getCategory() {
		return category;
	}

	public boolean isAvailable() {
		return available;
	}

	public String getBadge() {
		return badge;
	}

	public List<String> getIngredients() {
		return ingredients;
	}

	public List<String> getAllergens() {
		return allergens;
	}

	public List<String> getTextureNotes() {
		return textureNotes;
	}

	public String getPairing() {
		return pairing;
	}
}
