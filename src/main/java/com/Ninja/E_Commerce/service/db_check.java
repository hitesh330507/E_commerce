package com.Ninja.E_Commerce.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Ninja.E_Commerce.Entity.Product;
import com.Ninja.E_Commerce.Repo.psqlrepo;

@Service
public class db_check {

    @Autowired
    private psqlrepo repo;

    public List<Product> getallproducts()
    {
        return repo.findAll();
    }
    public List<Product> getproductsbyid(Long id)
    {
        return repo.findAllById(List.of(id));
    }

}
