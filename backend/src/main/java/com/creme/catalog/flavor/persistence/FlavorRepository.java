package com.creme.catalog.flavor.persistence;

import com.creme.catalog.flavor.domain.Flavor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlavorRepository extends JpaRepository<Flavor, String> {
	List<Flavor> findByAvailableTrue();
}
