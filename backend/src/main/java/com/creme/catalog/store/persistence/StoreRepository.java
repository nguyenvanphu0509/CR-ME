package com.creme.catalog.store.persistence;

import com.creme.catalog.store.domain.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreRepository extends JpaRepository<Store, String> {
	List<Store> findByActiveTrue();
}
