package com.Ninja.E_Commerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.Ninja.E_Commerce.Entity.Product;
import com.Ninja.E_Commerce.Repo.psqlrepo;

@RestController
public class db_check {

    @Autowired
    private psqlrepo repo;

    public List<Product> getproductsbyid(Long id)
    {
        return repo.findAllById(List.of(id));
    }

}
