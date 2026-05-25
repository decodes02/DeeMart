package com.decodes.eCom.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProductRequest(
        @NotBlank(message = "Product name is required")
        @Size(max = 120, message = "Product name must be 120 characters or less")
        String name,

        @NotBlank(message = "Brand is required")
        @Size(max = 80, message = "Brand must be 80 characters or less")
        String brand,

        @NotBlank(message = "Description is required")
        @Size(max = 2000, message = "Description must be 2000 characters or less")
        String description,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than zero")
        BigDecimal price,

        @NotBlank(message = "Category is required")
        @Size(max = 80, message = "Category must be 80 characters or less")
        String category,

        @NotNull(message = "Release date is required")
        LocalDate releaseDate,

        boolean available,

        @Min(value = 0, message = "Quantity cannot be negative")
        int quantity
) {
}