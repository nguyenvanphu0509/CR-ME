package com.creme.catalog.store.application;

import com.creme.catalog.store.api.StoreResponse;
import com.creme.catalog.store.persistence.StoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StoreService {
	private final StoreRepository storeRepository;

	public StoreService(StoreRepository storeRepository) {
		this.storeRepository = storeRepository;
	}

	@Transactional(readOnly = true)
	public List<StoreResponse> getActiveStores() {
		return storeRepository.findByActiveTrue().stream()
				.map(store -> new StoreResponse(
						store.getId(), store.getName(), store.getAddress(), store.getPhone(),
						store.getLatitude(), store.getLongitude(), store.getOpeningHours(), store.isActive()))
				.toList();
	}
}
