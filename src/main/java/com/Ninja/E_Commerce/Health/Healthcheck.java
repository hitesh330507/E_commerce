package com.Ninja.E_Commerce.Health;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Healthcheck {
    @GetMapping()
    public String Healthchecker() {
        return "Working Fine";
    }
    
}
