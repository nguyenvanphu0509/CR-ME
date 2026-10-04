package com.creme.customization.persistence;

import com.creme.customization.domain.CustomizationSize;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomizationSizeRepository extends JpaRepository<CustomizationSize, String> {
}
