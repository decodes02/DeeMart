package com.decodes.eCom.service;

import com.decodes.eCom.dto.ProductRequest;
import com.decodes.eCom.dto.ProductResponse;
import com.decodes.eCom.model.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        boolean hasImage = product.getImageData() != null && product.getImageData().length > 0;
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory(),
                product.getReleaseDate(),
                product.isAvailable(),
                product.getQuantity(),
                product.getImageName(),
                product.getImageType(),
                hasImage ? "/api/products/" + product.getId() + "/image" : null,
                hasImage
        );
    }

    public void applyRequest(Product product, ProductRequest request) {
        product.setName(request.name().trim());
        product.setBrand(request.brand().trim());
        product.setDescription(request.description().trim());
        product.setPrice(request.price());
        product.setCategory(request.category().trim());
        product.setReleaseDate(request.releaseDate());
        product.setAvailable(request.available());
        product.setQuantity(request.quantity());
    }
}