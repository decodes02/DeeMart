package com.decodes.eCom.config;

import com.decodes.eCom.model.Product;
import com.decodes.eCom.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.MimeTypeUtils;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Configuration
public class DemoDataSeeder {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    @Bean
    CommandLineRunner seedProducts(
            ProductRepository productRepository,
            @Value("${app.seed.enabled:true}") boolean seedEnabled,
            @Value("${app.seed.image-directory:../../Images}") String imageDirectory) {
        return args -> {
            if (!seedEnabled) {
                return;
            }

            Path imagesPath = Path.of(imageDirectory).toAbsolutePath().normalize();
            List<Product> products = demoProducts();
            Map<String, Product> existingProducts = productRepository.findAll().stream()
                    .collect(Collectors.toMap(
                            product -> normalizeName(product.getName()),
                            Function.identity(),
                            (first, second) -> first));

            List<Product> productsToSave = products.stream()
                    .map(product -> mergeWithExistingProduct(product, existingProducts.get(normalizeName(product.getName()))))
                    .toList();

            for (Product product : productsToSave) {
                attachSeedImage(product, imagesPath);
            }

            productRepository.saveAll(productsToSave);
            log.info("Seeded or refreshed {} DeeMart demo products", productsToSave.size());
        };
    }

    private List<Product> demoProducts() {
        return List.of(
                    product("iPhone 16 Pro", "Apple", "A flagship phone with a titanium design, pro camera system, and all-day battery life.", "Smartphones", "1199.00", 18, true, "iphone_16_pro.jpg", 8),
                    product("Samsung Galaxy S25", "Samsung", "Premium Android performance with a vivid display, AI-powered camera features, and fast charging.", "Smartphones", "999.00", 24, true, "samsung_galaxy_s25.jpg", 12),
                    product("MacBook Pro 14", "Apple", "Portable workstation with a crisp Liquid Retina display and enough power for creative workflows.", "Laptops", "1999.00", 9, true, "macbook_pro_14.jpg", 18),
                    product("Legion Gaming Laptop", "Lenovo", "High refresh-rate gaming laptop with dedicated graphics, tuned cooling, and RGB keyboard.", "Laptops", "1499.00", 7, true, "legion_gaming_laptop.jpg", 21),
                    product("Galaxy Watch Ultra", "Samsung", "Durable smart watch for fitness tracking, notifications, and long battery life.", "Wearables", "449.00", 16, true, "galaxy_watch_ultra.jpg", 24),
                    product("Alpha Mirrorless Camera", "Sony", "Compact mirrorless camera with fast autofocus and crisp 4K video for creators.", "Cameras", "1299.00", 6, true, "alpha_mirrorless_camera.jpg", 29),
                    product("Explorer Backpack", "Nomad", "Weather-resistant daily backpack with laptop storage and travel-friendly organization.", "Accessories", "89.00", 42, true, "explorer_backpack.jpg", 32),
                    product("Velocity Running Shoes", "Stride", "Lightweight shoes with responsive foam cushioning for everyday training.", "Footwear", "129.00", 31, true, "velocity_running_shoes.jpg", 37),
                    product("QuietBeat Headphones", "Sony", "Wireless noise-cancelling headphones with rich sound and comfortable ear cushions.", "Audio", "299.00", 14, true, "quietbeat_headphones.jpg", 41),
                    product("Orbit Mechanical Keyboard", "KeyLab", "Hot-swappable mechanical keyboard with compact layout and bright per-key lighting.", "Accessories", "159.00", 20, true, "orbit_mechanical_keyboard.jpg", 44),
                    product("Pixel Tablet Pro", "Google", "Slim tablet for streaming, notes, and lightweight productivity with a bright edge-to-edge display.", "Tablets", "599.00", 19, true, "pixel_tablet_pro.jpg", 47),
                    product("StudioView 27 Monitor", "Dell", "Color-accurate 27-inch display with USB-C connectivity for desk setups and creative work.", "Monitors", "379.00", 12, true, "studio_monitor_27.jpg", 50),
                    product("BrewMaster Coffee Brewer", "Aroma", "Programmable countertop coffee brewer with thermal carafe and consistent extraction.", "Home Appliances", "149.00", 22, true, "home_coffee_brewer.jpg", 53),
                    product("Pulse Bluetooth Speaker", "JBL", "Portable speaker with room-filling sound, durable casing, and long battery life.", "Audio", "129.00", 27, true, "portable_bluetooth_speaker.jpg", 56),
                    product("AirBuds Pro", "OnePlus", "Compact wireless earbuds with active noise cancellation and quick pairing.", "Audio", "179.00", 33, true, "airbuds_pro.jpg", 59),
                    product("LG InstaView Refrigerator", "LG", "Smart refrigerator with flexible storage, efficient cooling, and a modern glass panel design.", "Home Appliances", "2299.00", 4, true, "LG_Fridge.jpeg", 64),
                    product("Sony Bravia OLED TV", "Sony", "Premium 4K OLED television with cinematic contrast and smart streaming features.", "Televisions", "1799.00", 8, true, "Sony_Bravia.jpg", 68)
        );
    }

    private Product product(
            String name,
            String brand,
            String description,
            String category,
            String price,
            int quantity,
            boolean available,
            String imageName,
            int daysSinceRelease) {
        return Product.builder()
                .name(name)
                .brand(brand)
                .description(description)
                .category(category)
                .price(new BigDecimal(price))
                .quantity(quantity)
                .available(available)
                .releaseDate(LocalDate.now().minusDays(daysSinceRelease))
                .imageName(imageName)
                .build();
    }

    private Product mergeWithExistingProduct(Product seedProduct, Product existingProduct) {
        if (existingProduct == null) {
            return seedProduct;
        }

        existingProduct.setBrand(seedProduct.getBrand());
        existingProduct.setDescription(seedProduct.getDescription());
        existingProduct.setPrice(seedProduct.getPrice());
        existingProduct.setCategory(seedProduct.getCategory());
        existingProduct.setAvailable(seedProduct.isAvailable());
        existingProduct.setQuantity(Math.max(existingProduct.getQuantity(), seedProduct.getQuantity()));
        existingProduct.setImageName(seedProduct.getImageName());
        return existingProduct;
    }

    private String normalizeName(String name) {
        return name == null ? "" : name.trim().toLowerCase(Locale.ROOT);
    }

    private void attachSeedImage(Product product, Path imagesPath) {
        if (product.getImageName() == null) {
            return;
        }

        try {
            Path image = imagesPath.resolve(product.getImageName()).normalize();
            if (!Files.exists(image)) {
                log.warn("Seed image {} was not found", image);
                product.setImageName(null);
                return;
            }

            product.setImageData(Files.readAllBytes(image));
            String detectedType = Files.probeContentType(image);
            product.setImageType(detectedType == null ? MimeTypeUtils.IMAGE_JPEG_VALUE : detectedType);
        } catch (Exception exception) {
            log.warn("Unable to attach seed image for {}", product.getName(), exception);
            product.setImageName(null);
            product.setImageType(null);
            product.setImageData(null);
        }
    }
}
