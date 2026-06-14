package com.harsh.firstSpring.service;

import com.harsh.firstSpring.entity.Order;
import com.harsh.firstSpring.entity.OrderItem;
import com.harsh.firstSpring.entity.Product;
import com.harsh.firstSpring.entity.User;
import com.harsh.firstSpring.mapping.OrderMapper;
import com.harsh.firstSpring.model.*;
import com.harsh.firstSpring.model.order.*;
import com.harsh.firstSpring.model.order.ResUserOrderDTO;
import com.harsh.firstSpring.model.user.UserPrincipal;
import com.harsh.firstSpring.repository.OrderRepo;
import com.harsh.firstSpring.repository.ProductRepo;
import com.harsh.firstSpring.util.OrderStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;
    private final OrderMapper mapper;

    OrderService(OrderRepo orderRepo, ProductRepo productRepo, OrderMapper mapper) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.mapper = mapper;
    }

    @Transactional
    public String createOrder(UserPrincipal user, ReqOrderDTO request) {
        Order order = new Order();
        order.setUser(user.getUser());

        List<OrderItem> orderItems = new ArrayList<>();

        for(OrderItemDTO dto : request.getItems()) {
            Product product = productRepo.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Cannot find the product"));

            if(product.getStock() == 0 || product.getStock() < dto.getQuantity())
                return "Out of stock!";

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            product.setStock(product.getStock() - dto.getQuantity());
            item.setQuantity(dto.getQuantity());
            item.setPriceAtPurchase(product.getPrice());

            orderItems.add(item);
        }

        order.setStatus(OrderStatus.PENDING);
        order.setItems(orderItems);
        order.setTotalPrice(orderItems.stream()
                .map(item -> item.getPriceAtPurchase()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
        );

        orderRepo.save(order);
        return "Order placed!";
    }

    public PageResponse<ResOrderDTO> getOrders(UserPrincipal reqUser, int page, int size) {
        User user = reqUser.getUser();
        PageRequest pageable = PageRequest.of(page, size);
        Page<Order> order = orderRepo.findAllByUser(user, pageable);
        List<ResOrderDTO> orderList = new ArrayList<>();
        PageResponse<ResOrderDTO> pageDTO = new PageResponse<>();
        
        return mapper.toPageDto(order, orderList);
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

        if(!order.getUser().equals(user))
            return "Illegal deletion";

        orderRepo.delete(order);
        return "Order removed";
    }

    public PageResponse<ResOrderDTO> getOrdersAdmin(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Order> order = orderRepo.findAll(pageable);
        List<ResOrderDTO> orderList = new ArrayList<>();

        return mapper.toPageDto(order, orderList);
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
                .orElseThrow(()->new RuntimeException("Order not found"));

        ResUserOrderDTO userDto = new ResUserOrderDTO();
        userDto.setUsername(order.getUser().getUsername());

        ResOrderDTO dto = new ResOrderDTO();

        dto.setId(order.getId());
        dto.setUser(userDto);
        dto.setTotalPrice(order.getTotalPrice());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setStatus(order.getStatus());

        List<ResOrderItemDTO> itemDTOList = new ArrayList<>();

        for(OrderItem item : order.getItems()) {
            ResOrderItemDTO orderItemDTO = new ResOrderItemDTO();

            orderItemDTO.setId(item.getId());

            OrderProductDTO productDTO = new OrderProductDTO();

            productDTO.setName(item.getProduct().getName());
            orderItemDTO.setProduct(productDTO);

            orderItemDTO.setQuantity(item.getQuantity());
            orderItemDTO.setPriceAtPurchased(item.getPriceAtPurchase());

            itemDTOList.add(orderItemDTO);
        }

        dto.setOrderItems(itemDTOList);

        return dto;
    }

    @Transactional
    public PageResponse<ResOrderDTO> getAdminLastOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> order = orderRepo.findAllByOrderByCreatedAtDesc(pageable);
        List<ResOrderDTO> orderList = new ArrayList<>();
        
        return mapper.toPageDto(order, orderList);
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
