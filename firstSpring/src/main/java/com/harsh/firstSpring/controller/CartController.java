package com.harsh.firstSpring.controller;

import com.harsh.firstSpring.model.cart.CartDto;
import com.harsh.firstSpring.model.cart.CartItemDto;
import com.harsh.firstSpring.model.cart.ResCartItemDto;
import com.harsh.firstSpring.model.user.UserPrincipal;
import com.harsh.firstSpring.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/cart")
    public String addToCart(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody CartDto<CartItemDto> cartDto) {
        return cartService.addToCart(userPrincipal, cartDto);
    }

    @GetMapping("/cart")
    public CartDto<ResCartItemDto> viewCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return cartService.viewCart(userPrincipal);
    }

    @PutMapping("/cart/{productId}")
    public String incrementQuantity(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Integer productId,
            @RequestParam int quantity
    ) {
        return cartService.incrementQuantity(userPrincipal, productId, quantity);
    }

    @DeleteMapping("/cart")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        cartService.clearCart(userPrincipal);
        return ResponseEntity.noContent().build();
    }
}
