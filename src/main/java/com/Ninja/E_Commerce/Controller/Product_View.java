package com.Ninja.E_Commerce.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.Ninja.E_Commerce.Entity.Product;
import com.Ninja.E_Commerce.service.db_check;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping()
@CrossOrigin(origins = "http://localhost:5173")
public class Product_View {
    
    @Autowired
    private db_check db;

    @GetMapping("/home")
    public List<Product> getbyid() {
        return db.getallproducts();
    }

    @GetMapping("/product/{id}")
    public List<Product>getbyid(@PathVariable Long id)
    {
        return db.getproductsbyid(id);
    }

    @GetMapping("/search/{name}")
    public List<Product>getbyname(@PathVariable String name)
    {
        List<Product> productList=db.getproductbyproductname(name);

        if(productList.isEmpty())
          return db.getproductByCategory(name);

        return productList;     
    }

   
}
