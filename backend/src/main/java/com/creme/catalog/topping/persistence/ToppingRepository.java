package com.creme.catalog.topping.persistence;

import com.creme.catalog.topping.domain.Topping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ToppingRepository extends JpaRepository<Topping, String> {
	List<Topping> findByAvailableTrue();
}
