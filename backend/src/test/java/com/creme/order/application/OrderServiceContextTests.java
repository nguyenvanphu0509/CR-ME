package com.creme.order.application;

import com.creme.cart.application.CartService;
import com.creme.cart.persistence.CartItemRepository;
import com.creme.catalog.product.persistence.ProductRepository;
import com.creme.catalog.store.persistence.StoreRepository;
import com.creme.customization.api.QuoteRequest;
import com.creme.customization.application.CustomizationService;
import com.creme.order.persistence.OrderItemRepository;
import com.creme.order.persistence.OrderRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.jackson.autoconfigure.JacksonAutoConfiguration;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class OrderServiceContextTests {

	@Test
	void orderServiceUsesBootAutoConfiguredJacksonMapper() {
		new ApplicationContextRunner()
				.withConfiguration(AutoConfigurations.of(JacksonAutoConfiguration.class))
				.withBean(CartService.class, () -> mock(CartService.class))
				.withBean(CartItemRepository.class, () -> mock(CartItemRepository.class))
				.withBean(ProductRepository.class, () -> mock(ProductRepository.class))
				.withBean(StoreRepository.class, () -> mock(StoreRepository.class))
				.withBean(CustomizationService.class, () -> mock(CustomizationService.class))
				.withBean(OrderRepository.class, () -> mock(OrderRepository.class))
				.withBean(OrderItemRepository.class, () -> mock(OrderItemRepository.class))
				.withBean(OrderService.class)
				.run(context -> {
					assertThat(context).hasNotFailed().hasSingleBean(OrderService.class);
					ObjectMapper mapper = context.getBean(ObjectMapper.class);
					QuoteRequest request = mapper.convertValue(Map.of(
							"baseFlavorId", "vanilla-gold",
							"extraFlavorIds", List.of(),
							"toppingIds", List.of("honeycomb"),
							"sizeId", "small"), QuoteRequest.class);
					assertThat(request).isEqualTo(new QuoteRequest(
							"vanilla-gold", List.of(), List.of("honeycomb"), "small"));
				});
	}
}
