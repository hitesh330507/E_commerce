package com.Ninja.E_Commerce.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Ninja.E_Commerce.Entity.Product;

public interface psqlrepo extends JpaRepository<Product, Long>{
    // Find by title
    List<Product> findByTitle(String title);

    // Search with "contains" (like SQL ILIKE)
    List<Product> findByTitleContainingIgnoreCase(String keyword);

    // Find by category
    List<Product> findByCategory(String category);
}
   


