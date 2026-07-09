package com.harsh.firstSpring.mapping;

import com.harsh.firstSpring.entity.Order;
import com.harsh.firstSpring.entity.OrderItem;
import com.harsh.firstSpring.entity.Product;
import com.harsh.firstSpring.model.PageResponse;
import com.harsh.firstSpring.model.order.*;
import com.harsh.firstSpring.util.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class OrderMapper {
    public PageResponse<ResOrderDTO> toPageDto(Page<Order> orders) {
        PageResponse<ResOrderDTO> dto = new PageResponse<>();
        List<ResOrderDTO> orderList = new ArrayList<>();

        for (Order order : orders) {
            ResOrderDTO resOrderDTO = new ResOrderDTO();
            mapResponseOrderDto(order, resOrderDTO);
            orderList.add(resOrderDTO);
        }

        dto.setContent(orderList);
        dto.setPage(orders.getNumber());
        dto.setSize(orders.getSize());
        dto.setTotalElements(orders.getTotalElements());
        dto.setTotalPages(orders.getTotalPages());

        return dto;
    }

    public ResOrderDTO toDto(Order order) {
        ResOrderDTO dto = new ResOrderDTO();
        mapResponseOrderDto(order, dto);
        return dto;
    }


    public void mapOrder(Order order, List<OrderItem> orderItems) {
        order.setStatus(OrderStatus.PENDING);
        order.setItems(orderItems);
        order.setTotalPrice(orderItems.stream()
                .map(item -> item.getPriceAtPurchase()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
        );
    }

    public void mapResponseOrderDto(Order order, ResOrderDTO dto) {
        List<ResOrderItemDTO> resOrderItemList = new ArrayList<>();
        ResUserOrderDTO userDTO = new ResUserOrderDTO();

        userDTO.setUsername(order.getUser().getUsername());

        dto.setId(order.getId());
        dto.setUser(userDTO);
        dto.setTotalPrice(order.getTotalPrice());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setStatus(order.getStatus());

        for (OrderItem items : order.getItems()) {
            addItems(items, resOrderItemList);
        }

        dto.setOrderItems(resOrderItemList);
    }

    private void addItems(OrderItem item, List<ResOrderItemDTO> resOrderItemList) {
        ResOrderItemDTO orderItems = new ResOrderItemDTO();
        Product product = item.getProduct();

        orderItems.setId(item.getId());
        orderItems.setPriceAtPurchased(item.getPriceAtPurchase());
        orderItems.setProduct(product.getName());
        orderItems.setQuantity(item.getQuantity());

        resOrderItemList.add(orderItems);
    }
}
