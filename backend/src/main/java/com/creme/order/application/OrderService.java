package com.creme.order.application;

import com.creme.cart.application.CartService;
import com.creme.cart.domain.Cart;
import com.creme.cart.domain.CartItem;
import com.creme.cart.persistence.CartItemRepository;
import com.creme.catalog.product.domain.Product;
import com.creme.catalog.product.persistence.ProductRepository;
import com.creme.catalog.store.persistence.StoreRepository;
import com.creme.customization.api.QuoteRequest;
import com.creme.customization.api.QuoteResponse;
import com.creme.customization.application.CustomizationService;
import com.creme.order.api.OrderResponse;
import com.creme.order.api.PlaceOrderRequest;
import com.creme.order.domain.Order;
import com.creme.order.domain.OrderItem;
import com.creme.order.persistence.OrderItemRepository;
import com.creme.order.persistence.OrderRepository;
import tools.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class OrderService {
	private final CartService cartService;
	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;
	private final StoreRepository storeRepository;
	private final CustomizationService customizationService;
	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final ObjectMapper objectMapper;

	public OrderService(CartService cartService, CartItemRepository cartItemRepository,
			ProductRepository productRepository, StoreRepository storeRepository,
			CustomizationService customizationService, OrderRepository orderRepository,
			OrderItemRepository orderItemRepository, ObjectMapper objectMapper) {
		this.cartService = cartService;
		this.cartItemRepository = cartItemRepository;
		this.productRepository = productRepository;
		this.storeRepository = storeRepository;
		this.customizationService = customizationService;
		this.orderRepository = orderRepository;
		this.orderItemRepository = orderItemRepository;
		this.objectMapper = objectMapper;
	}

	@Transactional
	public OrderResponse placeGuestOrder(String guestToken, PlaceOrderRequest request) {
		if (storeRepository.findById(request.storeId()).filter(store -> store.isActive()).isEmpty()) {
			throw new IllegalArgumentException("Store is unavailable: " + request.storeId());
		}

		Cart cart = cartService.findOrCreateGuestCart(guestToken);
		List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
		if (cartItems.isEmpty()) {
			throw new IllegalArgumentException("Cannot place an empty order");
		}

		List<OrderItemDraft> drafts = cartItems.stream().map(this::buildOrderItem).toList();
		BigDecimal subtotal = drafts.stream()
				.map(OrderItemDraft::lineTotal)
				.reduce(BigDecimal.ZERO, BigDecimal::add);
		String orderCode = "CRM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
		Order order = orderRepository.save(new Order(orderCode, request.storeId(), request.customerName(),
				request.customerPhone(), subtotal, subtotal));
		drafts.forEach(draft -> orderItemRepository.save(new OrderItem(order.getId(), draft.productId(),
				draft.itemName(), draft.customSelection(), draft.quantity(), draft.unitPrice())));
		return new OrderResponse(order.getId(), order.getOrderCode(), order.getStatus(), order.getSubtotal(), order.getTotal());
	}

	private OrderItemDraft buildOrderItem(CartItem item) {
		if (item.getProductId() != null) {
			Product product = productRepository.findById(item.getProductId())
					.filter(Product::isAvailable)
					.orElseThrow(() -> new IllegalArgumentException("Product is unavailable: " + item.getProductId()));
			return new OrderItemDraft(product.getId(), product.getName(), null, item.getQuantity(), product.getPrice());
		}
		Map<String, Object> selection = item.getCustomSelection();
		QuoteRequest quoteRequest = objectMapper.convertValue(selection, QuoteRequest.class);
		QuoteResponse quote = customizationService.quote(quoteRequest);
		return new OrderItemDraft(null, "Custom Ice Cream", selection, item.getQuantity(), quote.total());
	}

	private record OrderItemDraft(String productId, String itemName, Map<String, Object> customSelection,
			int quantity, BigDecimal unitPrice) {
		private BigDecimal lineTotal() {
			return unitPrice.multiply(BigDecimal.valueOf(quantity));
		}
	}
}
