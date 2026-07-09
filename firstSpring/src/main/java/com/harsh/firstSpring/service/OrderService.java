package com.harsh.firstSpring.service;

import com.harsh.firstSpring.entity.*;
import com.harsh.firstSpring.mapping.OrderMapper;
import com.harsh.firstSpring.model.*;
import com.harsh.firstSpring.model.order.*;
import com.harsh.firstSpring.model.order.ResUserOrderDTO;
import com.harsh.firstSpring.model.user.UserPrincipal;
import com.harsh.firstSpring.repository.CartRepo;
import com.harsh.firstSpring.repository.OrderRepo;
import com.harsh.firstSpring.repository.ProductRepo;
import com.harsh.firstSpring.util.OrderStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;
    private final OrderMapper mapper;
    private final CartRepo cartRepo;

    OrderService(OrderRepo orderRepo, ProductRepo productRepo, OrderMapper mapper, CartRepo cartRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.mapper = mapper;
        this.cartRepo = cartRepo;
    }

    @Transactional
    public ResOrderDTO placeOrderDirect(UserPrincipal user, ReqOrderDTO request) {
        Order order = new Order();
        order.setUser(user.getUser());

        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemDTO dto : request.getItems()) {
            mapItemDirect(order, dto, orderItems);
        }

        mapper.mapOrder(order, orderItems);

        orderRepo.save(order);

        return mapper.toDto(order);
    }

    @Transactional
    public ResOrderDTO placeOrderFromCart(UserPrincipal user) {
        Cart cart = cartRepo.findByUser(user.getUser());

        if (cart == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user.getUser());

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getItems()) {
            mapItemCart(order, cartItem, orderItems);
        }

        mapper.mapOrder(order, orderItems);

        orderRepo.save(order);
        cart.getItems().clear();

        return mapper.toDto(order);
    }

    private void mapItemDirect(Order order, OrderItemDTO dto, List<OrderItem> orderItems) {
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Cannot find the product"));

        if (product.getStock() == 0 || product.getStock() < dto.getQuantity())
            throw new RuntimeException(product.getName() + " is out of stock!");

        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProduct(product);
        product.setStock(product.getStock() - dto.getQuantity());
        item.setQuantity(dto.getQuantity());
        item.setPriceAtPurchase(product.getPrice());

        orderItems.add(item);
    }

    private void mapItemCart(Order order, CartItem cartItem, List<OrderItem> orderItems) {
        Product product = cartItem.getProduct();

        if (product.getStock() == 0 || product.getStock() < cartItem.getQuantity())
            throw new RuntimeException(product.getName() + " is out of stock!");

        OrderItem item = new OrderItem();

        item.setOrder(order);
        item.setProduct(product);
        product.setStock(product.getStock() - cartItem.getQuantity());
        item.setQuantity(cartItem.getQuantity());
        item.setPriceAtPurchase(product.getPrice());

        orderItems.add(item);
    }

    public PageResponse<ResOrderDTO> getOrders(UserPrincipal reqUser, int page, int size) {
        User user = reqUser.getUser();
        PageRequest pageable = PageRequest.of(page, size);
        Page<Order> order = orderRepo.findAllByUser(user, pageable);

        return mapper.toPageDto(order);
    }

    @Transactional
    public String removeOrder(UserPrincipal userPrincipal, Integer orderId) {
        User user = userPrincipal.getUser();
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.getItems().forEach(item -> {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
        });

        if (!order.getUser().equals(user))
            return "Illegal deletion";

        orderRepo.delete(order);
        return "Order removed";
    }

    public PageResponse<ResOrderDTO> getOrdersAdmin(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Order> order = orderRepo.findAll(pageable);

        return mapper.toPageDto(order);
    }

    @Transactional
    public String completeOrder(int orderId) {
        orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Cannot find the order"))
                .setStatus(OrderStatus.DELIVERED);

        return "Order delivered successfully";
    }

    @Transactional
    public String cancelOrder(int orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Cannot find the order"));

        order.setStatus(OrderStatus.CANCELED);
        order.getItems().forEach(item -> {
            Product product = item.getProduct();

            product.setStock(product.getStock() + item.getQuantity());
        });

        return "Order canceled";
    }

    @Transactional
    public ResOrderDTO getUserLastOrder(UserPrincipal userPrincipal) {
        Integer userId = userPrincipal.getUser().getId();
        Order order = orderRepo.findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        ResUserOrderDTO userDto = new ResUserOrderDTO();
        userDto.setUsername(order.getUser().getUsername());

        ResOrderDTO dto = new ResOrderDTO();

        mapper.mapResponseOrderDto(order, dto);

        return dto;
    }

    @Transactional
    public PageResponse<ResOrderDTO> getAdminLastOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> order = orderRepo.findAllByOrderByCreatedAtDesc(pageable);

        return mapper.toPageDto(order);
    }

    public OrderStats orderStats() {
        OrderStats stats = new OrderStats();

        stats.setOrders(orderRepo.count());
        stats.setOrdersPending(orderRepo.countByStatus(OrderStatus.PENDING));
        stats.setOrdersDelivered(orderRepo.countByStatus(OrderStatus.DELIVERED));
        stats.setOrdersCanceled(orderRepo.countByStatus(OrderStatus.CANCELED));

        return stats;
    }

}
