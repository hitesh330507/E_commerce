package com.Ninja.E_Commerce.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.Ninja.E_Commerce.Entity.Product;
import com.Ninja.E_Commerce.service.db_check;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
public class Product_View {
    
    @Autowired
    private db_check db;

    @GetMapping("/{id}")
    public List<Product> getbyid(@PathVariable Long id) {
        return db.getproductsbyid(id);
    }
    
}
