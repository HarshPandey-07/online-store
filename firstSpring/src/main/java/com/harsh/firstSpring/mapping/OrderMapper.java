package com.harsh.firstSpring.mapping;

import com.harsh.firstSpring.entity.Order;
import com.harsh.firstSpring.entity.OrderItem;
import com.harsh.firstSpring.entity.Product;
import com.harsh.firstSpring.model.PageResponse;
import com.harsh.firstSpring.model.order.OrderProductDTO;
import com.harsh.firstSpring.model.order.ResOrderDTO;
import com.harsh.firstSpring.model.order.ResOrderItemDTO;
import com.harsh.firstSpring.model.order.ResUserOrderDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class OrderMapper {

    public PageResponse<ResOrderDTO> toPageDto(Page<Order> order, List<ResOrderDTO> orderList) {
        PageResponse<ResOrderDTO> dto = new PageResponse<>();

        for(Order entity : order) {
            ResOrderDTO resOrderDTO = new ResOrderDTO();
            List<ResOrderItemDTO> resOrderItemList = new ArrayList<>();
            ResUserOrderDTO userDTO = new ResUserOrderDTO();

            userDTO.setUsername(entity.getUser().getUsername());

            resOrderDTO.setId(entity.getId());
            resOrderDTO.setUser(userDTO);
            resOrderDTO.setTotalPrice(entity.getTotalPrice());
            resOrderDTO.setCreatedAt(entity.getCreatedAt());
            resOrderDTO.setStatus(entity.getStatus());

            for(OrderItem items : entity.getItems()) {
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
            resOrderDTO.setOrderItems(resOrderItemList);
            orderList.add(resOrderDTO);
        }

        dto.setContent(orderList);
        dto.setPage(order.getNumber());
        dto.setSize(order.getSize());
        dto.setTotalElements(order.getTotalElements());
        dto.setTotalPages(order.getTotalPages());

        return dto;
    }
}
