package com.harsh.firstSpring.controller;

import com.harsh.firstSpring.model.PageResponse;
import com.harsh.firstSpring.model.order.OrderStats;
import com.harsh.firstSpring.model.order.ReqOrderDTO;
import com.harsh.firstSpring.model.order.ResOrderDTO;
import com.harsh.firstSpring.model.user.UserPrincipal;
import com.harsh.firstSpring.service.OrderService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/admin/order")
    public PageResponse<ResOrderDTO>  getOrderAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return orderService.getOrdersAdmin(page, size);
    }

    @PostMapping("/user/order")
    public String setOrder(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody ReqOrderDTO orderDTO) {
        return orderService.createOrder(userPrincipal, orderDTO);
    }

    @GetMapping("/user/order")
    public PageResponse<ResOrderDTO> getOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return orderService.getOrders(userPrincipal, page, size);
    }

    @DeleteMapping("/user/order/{id}")
    public String removeOrder(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable Integer id) {
        return orderService.removeOrder(userPrincipal, id);
    }

    @PostMapping("/admin/order/{id}")
    public String completeOrder(@PathVariable Integer id) {
        return orderService.completeOrder(id);
    }

    @DeleteMapping("/admin/order/{id}")
    public String cancelOrder(@PathVariable Integer id) {
        return orderService.cancelOrder(id);
    }

    @GetMapping("/user/last-order")
    public ResOrderDTO getLastOrder(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return orderService.getUserLastOrder(userPrincipal);
    }

    @GetMapping("/admin/order/stats")
    public OrderStats orderStats() {
        return orderService.orderStats();
    }

    @GetMapping("/admin/last-order")
    public PageResponse<ResOrderDTO> getAdminLastOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return orderService.getAdminLastOrders(page, size);
    }
}