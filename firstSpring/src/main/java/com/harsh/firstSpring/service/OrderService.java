package com.harsh.firstSpring.service;

import com.harsh.firstSpring.entity.Order;
import com.harsh.firstSpring.entity.OrderItem;
import com.harsh.firstSpring.entity.Product;
import com.harsh.firstSpring.entity.User;
import com.harsh.firstSpring.model.*;
import com.harsh.firstSpring.model.order.*;
import com.harsh.firstSpring.model.user.ResUserOrderDTO;
import com.harsh.firstSpring.model.user.UserPrincipal;
import com.harsh.firstSpring.repository.OrderRepo;
import com.harsh.firstSpring.repository.ProductRepo;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;

    OrderService(OrderRepo orderRepo, ProductRepo productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
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

        order.setStatus("PLACED");
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
        Page<Order> entity = orderRepo.findAllByUser(user, pageable);
        List<ResOrderDTO> orders = new ArrayList<>();
        PageResponse<ResOrderDTO> pageDTO = new PageResponse<>();

        for(Order order: entity) {
            ResOrderDTO dto = new ResOrderDTO();
            ResUserOrderDTO userDTO = new ResUserOrderDTO();
            List<ResOrderItemDTO> resOrderItemList = new ArrayList<>();

            userDTO.setUsername(user.getUsername());
            dto.setId(order.getId());
            dto.setUser(userDTO);
            dto.setCreatedAt(order.getCreatedAt());
            dto.setStatus(order.getStatus());
            dto.setTotalPrice(order.getTotalPrice());

            for(OrderItem items: order.getItems()) {
                ResOrderItemDTO orderItems = new ResOrderItemDTO();
                Product product = items.getProduct();

                OrderProductDTO productDto = new OrderProductDTO();
                productDto.setName(product.getName());

                orderItems.setId(items.getId());
                orderItems.setPriceAtPurchased(items.getPriceAtPurchase());
                orderItems.setProduct(productDto);
                orderItems.setQuantity(items.getQuantity());

                resOrderItemList.add(orderItems);
            }

            dto.setOrderItems(resOrderItemList);
            orders.add(dto);
        }

        pageDTO.setContent(orders);
        pageDTO.setPage(entity.getNumber());
        pageDTO.setSize(entity.getSize());
        pageDTO.setTotalElements(entity.getTotalElements());
        pageDTO.setTotalPages(entity.getTotalPages());
        return pageDTO;
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
        Page<Order> entity = orderRepo.findAll(pageable);
        List<ResOrderDTO> orders = new ArrayList<>();
        PageResponse<ResOrderDTO> pageDTO = new PageResponse<>();

        for(Order order: entity) {
            ResOrderDTO dto = new ResOrderDTO();
            ResUserOrderDTO userDTO = new ResUserOrderDTO();
            List<ResOrderItemDTO> resOrderItemList = new ArrayList<>();

            userDTO.setUsername(order.getUser().getUsername());
            dto.setId(order.getId());
            dto.setUser(userDTO);
            dto.setCreatedAt(order.getCreatedAt());
            dto.setStatus(order.getStatus());
            dto.setTotalPrice(order.getTotalPrice());

            for(OrderItem items: order.getItems()) {
                ResOrderItemDTO orderItems = new ResOrderItemDTO();
                Product product = items.getProduct();

                OrderProductDTO productDto = new OrderProductDTO();
                productDto.setName(product.getName());

                orderItems.setId(items.getId());
                orderItems.setPriceAtPurchased(items.getPriceAtPurchase());
                orderItems.setProduct(productDto);
                orderItems.setQuantity(items.getQuantity());

                resOrderItemList.add(orderItems);
            }

            dto.setOrderItems(resOrderItemList);
            orders.add(dto);
        }
        pageDTO.setContent(orders);
        pageDTO.setPage(entity.getNumber());
        pageDTO.setSize(entity.getSize());
        pageDTO.setTotalElements(entity.getTotalElements());
        pageDTO.setTotalPages(entity.getTotalPages());

        return pageDTO;
    }

    @Transactional
    public String completeOrder(int orderId) {
        orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Cannot find the order"))
                .setStatus("DELIVERED");

        return "Order delivered successfully";
    }

    @Transactional
    public String cancelOrder(int orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Cannot find the order"));

        order.setStatus("CANCELED");
        order.getItems().forEach(item -> {
            Product product = item.getProduct();

            product.setStock(product.getStock() + item.getQuantity());
        });

        return "Order canceled";
    }
}
