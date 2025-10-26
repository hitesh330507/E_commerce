package com.Ninja.E_Commerce.Controller;

import com.Ninja.E_Commerce.Entity.Cart;
import com.Ninja.E_Commerce.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

record AddItemRequest(Long productId, Integer qty) {}
record UpdateQtyRequest(Integer qty) {}

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(Authentication auth) {
        String username = auth.getName();
        return ResponseEntity.ok(cartService.getCartForUser(username));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> add(Authentication auth, @RequestBody AddItemRequest req) {
        String username = auth.getName();
        int qty = req.qty() == null ? 1 : req.qty();
        return ResponseEntity.ok(cartService.addItem(username, req.productId(), qty));
    }

    @PatchMapping("/item/{itemId}")
    public ResponseEntity<Cart> update(Authentication auth, @PathVariable Long itemId, @RequestBody UpdateQtyRequest req) {
        String username = auth.getName();
        return ResponseEntity.ok(cartService.updateItemQuantity(username, itemId, req.qty() == null ? 1 : req.qty()));
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<Cart> remove(Authentication auth, @PathVariable Long itemId) {
        String username = auth.getName();
        return ResponseEntity.ok(cartService.removeItem(username, itemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Cart> clear(Authentication auth) {
        String username = auth.getName();
        return ResponseEntity.ok(cartService.clearCart(username));
    }
}
