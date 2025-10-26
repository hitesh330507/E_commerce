package com.Ninja.E_Commerce.Repo;

import com.Ninja.E_Commerce.Entity.AppUser;
import com.Ninja.E_Commerce.Entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(AppUser user);
}
