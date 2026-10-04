package com.creme.catalog.product.persistence;

import com.creme.catalog.product.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {
	List<Product> findByAvailableTrue();
}
