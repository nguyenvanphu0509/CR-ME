package com.creme.customization.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record QuoteRequest(
		@NotBlank String baseFlavorId,
		@NotNull @Size(max = 2) List<@NotBlank String> extraFlavorIds,
		@NotNull @Size(max = 3) List<@NotBlank String> toppingIds,
		@NotBlank String sizeId) {
}
