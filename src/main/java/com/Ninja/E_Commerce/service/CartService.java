package com.Ninja.E_Commerce.service;

import com.Ninja.E_Commerce.Entity.AppUser;
import com.Ninja.E_Commerce.Entity.Cart;
import com.Ninja.E_Commerce.Entity.CartItem;
import com.Ninja.E_Commerce.Entity.Product;
import com.Ninja.E_Commerce.Repo.CartRepository;
import com.Ninja.E_Commerce.Repo.UserRepository;
import com.Ninja.E_Commerce.Repo.psqlrepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final psqlrepo productRepository;

    public CartService(CartRepository cartRepository, UserRepository userRepository, psqlrepo productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public Cart getCartForUser(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    public Cart addItem(String username, Long productId, int qty) {
        if (qty <= 0) qty = 1;
        Cart cart = getCartForUser(username);

        // If item already in cart, increment
        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst();
        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + qty);
            return cartRepository.save(cart);
        }

        // Load product snapshot
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        CartItem item = CartItem.builder()
                .cart(cart)
                .productId(product.getId())
                .title(product.getTitle())
                .price(product.getPrice())
                .quantity(qty)
                .thumbnail(product.getThumbnail())
                .build();
        cart.getItems().add(item);
        return cartRepository.save(cart);
    }

    public Cart updateItemQuantity(String username, Long itemId, int qty) {
        if (qty <= 0) return removeItem(username, itemId);
        Cart cart = getCartForUser(username);
        cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + itemId))
                .setQuantity(qty);
        return cartRepository.save(cart);
    }

    public Cart removeItem(String username, Long itemId) {
        Cart cart = getCartForUser(username);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return cartRepository.save(cart);
    }

    public Cart clearCart(String username) {
        Cart cart = getCartForUser(username);
        cart.getItems().clear();
        return cartRepository.save(cart);
    }
}
