package com.Ninja.E_Commerce.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "app_user")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 80)
    private String username;

    @Column(nullable = false)
    private String password;

    // Comma-separated roles, e.g. "ROLE_USER,ROLE_ADMIN"
    @Column(nullable = false)
    private String roles;
}
