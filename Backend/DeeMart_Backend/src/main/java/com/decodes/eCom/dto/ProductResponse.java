package com.decodes.eCom.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProductResponse(
        Long id,
        String name,
        String brand,
        String description,
        BigDecimal price,
        String category,
        LocalDate releaseDate,
        boolean available,
        int quantity,
        String imageName,
        String imageType,
        String imageUrl,
        boolean hasImage
) {
}