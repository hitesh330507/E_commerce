package com.Ninja.E_Commerce.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category;
    private Double price;
    private Double discountPercentage;
    private Double rating;
    private Integer stock;
    private String brand;
    private String sku;
    private Double weight;
    private String warrantyInformation;
    private String shippingInformation;
    private String availabilityStatus;
    private String returnPolicy;
    private Integer minimumOrderQuantity;
    private String thumbnail;

    @ElementCollection
    private List<String> tags;

    @ElementCollection
    private List<String> images;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dimensions_id")
    private Dimensions dimensions;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "meta_id")
    private Meta meta;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "product_id")
    private List<Review> reviews;
}
