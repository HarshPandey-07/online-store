package com.harsh.firstSpring.service;

import com.harsh.firstSpring.entity.Cart;
import com.harsh.firstSpring.entity.CartItem;
import com.harsh.firstSpring.entity.Product;
import com.harsh.firstSpring.entity.User;
import com.harsh.firstSpring.model.cart.CartDto;
import com.harsh.firstSpring.model.cart.CartItemDto;
import com.harsh.firstSpring.model.cart.ResCartItemDto;
import com.harsh.firstSpring.model.user.UserPrincipal;
import com.harsh.firstSpring.repository.CartRepo;
import com.harsh.firstSpring.repository.ProductRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    private final CartRepo cartRepo;
    private final ProductRepo productRepo;

    public CartService(CartRepo cartRepo, ProductRepo productRepo) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
    }

    @Transactional
    public String addToCart(UserPrincipal userPrincipal, CartDto<CartItemDto> request) {
        User user = userPrincipal.getUser();
        Cart cart = getOrCreateCart(user);

        for (CartItemDto dto : request.getItems()) {
            addItem(cart, dto);
        }

        cartRepo.save(cart);
        return "Items added to cart";
    }

    private Cart getOrCreateCart(User user) {
        Cart cart = cartRepo.findByUser(user);

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart.setItems(new ArrayList<>());
        }

        return cart;
    }

    private void addItem(Cart cart, CartItemDto dto) {
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() < dto.getQuantity())
            throw new RuntimeException("Can't order more than stock");
        if (dto.getQuantity() <= 0)
            throw new RuntimeException("Quantity must be greater than zero");

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(
                    existingItem.get().getQuantity() + dto.getQuantity()
            );
        } else {
            CartItem item = new CartItem();

            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(dto.getQuantity());

            cart.getItems().add(item);
        }
    }

    public CartDto<ResCartItemDto> viewCart(UserPrincipal userPrincipal) {
        Cart cart = cartRepo.findByUser(userPrincipal.getUser());

        if (cart == null || cart.getItems().isEmpty())
            return null;

        CartDto<ResCartItemDto> dto = new CartDto<>();
        List<ResCartItemDto> itemDtoList = new ArrayList<>();

        for (CartItem items : cart.getItems()) {
            ResCartItemDto itemDto = new ResCartItemDto();

            itemDto.setProductName(items.getProduct().getName());
            itemDto.setPrice(items.getProduct().getPrice());
            itemDto.setQuantity(items.getQuantity());

            itemDtoList.add(itemDto);
        }

        dto.setItems(itemDtoList);

        return dto;
    }

    @Transactional
    public String incrementQuantity(UserPrincipal user, Integer productId, int quantity) {
        if(quantity <= 0)
            throw new RuntimeException("Quantity must be greater than 0");

        Cart cart = cartRepo.findByUser(user.getUser());

        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not in the cart"));

        cartItem.setQuantity(cartItem.getQuantity() + quantity);
        return "Quantity updated";
    }

    @Transactional
    public void clearCart(UserPrincipal user) {
        Cart cart = cartRepo.findByUser(user.getUser());

        if (cart == null)
            return;

        cart.getItems().clear();
    }
}
