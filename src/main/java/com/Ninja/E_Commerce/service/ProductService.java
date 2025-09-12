// package com.Ninja.E_Commerce.service;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;

// import com.Ninja.E_Commerce.Entity.Dimensions;
// import com.Ninja.E_Commerce.Entity.Meta;
// import com.Ninja.E_Commerce.Entity.Product;
// import com.Ninja.E_Commerce.Entity.Review;
// import com.Ninja.E_Commerce.Repo.psqlrepo;

// import jakarta.annotation.PostConstruct;
// import java.time.LocalDateTime;
// import java.time.OffsetDateTime;
// import java.time.ZoneOffset;
// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;


// @Service
// public class ProductService {

//     @Autowired
//     private psqlrepo repo;

//     private final RestTemplate restTemplate = new RestTemplate();

//     @SuppressWarnings("unchecked")
//     @PostConstruct
//     public void initDB() {
//         System.out.println("Checking and Initializing Database...");
//         if (repo.count() == 0) {
//             String url = "https://dummyjson.com/products?limit=100";
//             Map<String, Object> response = restTemplate.getForObject(url, Map.class);

//             List<Map<String, Object>> productsList = (List<Map<String, Object>>) response.get("products");

//             for (Map<String, Object> p : productsList) {

//                 // --- Dimensions ---
//                 Map<String, Object> dimMap = (Map<String, Object>) p.get("dimensions");
//                 Dimensions dimensions = Dimensions.builder()
//                         .width(Double.valueOf(dimMap.get("width").toString()))
//                         .height(Double.valueOf(dimMap.get("height").toString()))
//                         .depth(Double.valueOf(dimMap.get("depth").toString()))
//                         .build();

//                 // --- Meta ---

//                 // --- inside your loop ---
//                 Map<String, Object> metaMap = (Map<String, Object>) p.get("meta");

//                 LocalDateTime createdAt = null;
//                 LocalDateTime updatedAt = null;

//                 if (metaMap != null) {
//                     // Parse ISO 8601 with Z
//                     if (metaMap.get("createdAt") != null) {
//                         OffsetDateTime odtCreated = OffsetDateTime.parse((String) metaMap.get("createdAt"));
//                         createdAt = odtCreated.withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime();
//                     }
//                     if (metaMap.get("updatedAt") != null) {
//                         OffsetDateTime odtUpdated = OffsetDateTime.parse((String) metaMap.get("updatedAt"));
//                         updatedAt = odtUpdated.withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime();
//                     }
//                 }

//                 Meta meta = Meta.builder()
//                         .createdAt(createdAt)
//                         .updatedAt(updatedAt)
//                         .barcode((String) metaMap.get("barcode"))
//                         .qrCode((String) metaMap.get("qrCode"))
//                         .build();

//                 // --- Reviews ---

//                 // --- inside your loop ---
//                 List<Map<String, Object>> revList = (List<Map<String, Object>>) p.get("reviews");
//                 List<Review> reviews = revList.stream().map(r -> {
//                     LocalDateTime reviewDate = null;
//                     if (r.get("date") != null) {
//                         OffsetDateTime odt = OffsetDateTime.parse((String) r.get("date"));
//                         reviewDate = odt.withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime();
//                     }

//                     return Review.builder()
//                             .rating((Integer) r.get("rating"))
//                             .comment((String) r.get("comment"))
//                             .date(reviewDate)
//                             .reviewerName((String) r.get("reviewerName"))
//                             .reviewerEmail((String) r.get("reviewerEmail"))
//                             .build();
//                 }).collect(Collectors.toList());

//                 // --- Product ---
//                 Product product = Product.builder()
//                         .title((String) p.get("title"))
//                         .description((String) p.get("description"))
//                         .category((String) p.get("category"))
//                         .price(Double.valueOf(p.get("price").toString()))
//                         .discountPercentage(Double.valueOf(p.get("discountPercentage").toString()))
//                         .rating(Double.valueOf(p.get("rating").toString()))
//                         .stock((Integer) p.get("stock"))
//                         .brand((String) p.get("brand"))
//                         .sku((String) p.get("sku"))
//                         .weight(Double.valueOf(p.get("weight").toString()))
//                         .warrantyInformation((String) p.get("warrantyInformation"))
//                         .shippingInformation((String) p.get("shippingInformation"))
//                         .availabilityStatus((String) p.get("availabilityStatus"))
//                         .returnPolicy((String) p.get("returnPolicy"))
//                         .minimumOrderQuantity((Integer) p.get("minimumOrderQuantity"))
//                         .thumbnail((String) p.get("thumbnail"))
//                         .tags((List<String>) p.get("tags"))
//                         .images((List<String>) p.get("images"))
//                         .dimensions(dimensions)
//                         .meta(meta)
//                         .reviews(reviews)
//                         .build();

//                 repo.save(product);
//             }
//         }
//     }
// }
