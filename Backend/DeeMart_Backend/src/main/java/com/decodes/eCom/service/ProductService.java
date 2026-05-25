package com.decodes.eCom.service;

import com.decodes.eCom.dto.ProductRequest;
import com.decodes.eCom.dto.ProductResponse;
import com.decodes.eCom.exception.InvalidImageException;
import com.decodes.eCom.exception.ProductNotFoundException;
import com.decodes.eCom.model.Product;
import com.decodes.eCom.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Transactional
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(Long id) {
        return productMapper.toResponse(getProductEntity(id));
    }

    @Transactional(readOnly = true)
    public Product getProductEntity(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public Product getProductImageEntity(Long id) {
        Product product = getProductEntity(id);
        if (product.getImageData() == null || product.getImageData().length == 0 || product.getImageType() == null) {
            throw new InvalidImageException("Image is not available for product id " + id);
        }
        return product;
    }

    public ProductResponse createProduct(ProductRequest request, MultipartFile image) {
        Product product = new Product();
        productMapper.applyRequest(product, request);
        applyImage(product, image, false);
        Product savedProduct = productRepository.save(product);
        log.info("Created product {} ({})", savedProduct.getId(), savedProduct.getName());
        return productMapper.toResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request, MultipartFile image) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException(id));
        productMapper.applyRequest(product, request);
        applyImage(product, image, true);
        Product savedProduct = productRepository.save(product);
        log.info("Updated product {} ({})", savedProduct.getId(), savedProduct.getName());
        return productMapper.toResponse(savedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException(id));
        productRepository.delete(product);
        log.info("Deleted product {} ({})", product.getId(), product.getName());
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String keyword) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim();
        if (normalizedKeyword.isBlank()) {
            return getProducts();
        }

        return productRepository
                .findByNameContainingIgnoreCaseOrBrandContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                        normalizedKeyword,
                        normalizedKeyword,
                        normalizedKeyword,
                        normalizedKeyword)
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    private void applyImage(Product product, MultipartFile image, boolean optional) {
        if (image == null || image.isEmpty()) {
            if (optional) {
                return;
            }
            product.setImageName(null);
            product.setImageType(null);
            product.setImageData(null);
            return;
        }

        String contentType = image.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new InvalidImageException("Only image uploads are supported");
        }

        try {
            product.setImageName(image.getOriginalFilename());
            product.setImageType(contentType);
            product.setImageData(image.getBytes());
        } catch (IOException exception) {
            throw new InvalidImageException("Unable to read uploaded image");
        }
    }
}