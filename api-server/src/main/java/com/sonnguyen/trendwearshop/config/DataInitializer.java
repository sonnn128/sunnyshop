package com.sonnguyen.trendwearshop.config;

import com.sonnguyen.trendwearshop.model.*;
import com.sonnguyen.trendwearshop.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting data initialization...");
        
        // Create roles
        createRoles();
        
        // Create admin user
        createAdminUser();

        // Create sample customers and orders
        createSampleCustomersAndOrders();
        
        log.info("Data initialization completed!");
    }

    private void createRoles() {
        // Create USER role
        if (!roleRepository.existsById("USER")) {
            Role userRole = new Role();
            userRole.setId("USER");
            roleRepository.save(userRole);
            log.info("Created USER role");
        }

        // Create ADMIN role
        if (!roleRepository.existsById("ADMIN")) {
            Role adminRole = new Role();
            adminRole.setId("ADMIN");
            roleRepository.save(adminRole);
            log.info("Created ADMIN role");
        }
    }

    private void createAdminUser() {
        String adminUsername = "admin";
        String adminEmail = "admin@trendwearshop.com";
        
        if (!userRepository.existsByUsername(adminUsername)) {
            // Get ADMIN role
            Role adminRole = roleRepository.findById("ADMIN")
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

            // Create admin user
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setFullName("System Administrator");
            admin.setPassword(passwordEncoder.encode("admin123"));

            // Set roles
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
            log.info("Created admin user: {}", adminUsername);
        } else {
            log.info("Admin user already exists");
        }
    }

    private void createSampleCustomersAndOrders() {
        Role userRole = roleRepository.findById("USER").orElse(null);
        if (userRole == null) return;

        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) return;

        // Customer 1: Nguyễn Văn An
        createCustomerWithOrders(
                "nguyenvana",
                "vana.nguyen@gmail.com",
                "Nguyễn Văn An",
                "0912345678",
                "123 Cầu Giấy, Quận Cầu Giấy, Hà Nội",
                Gender.MALE,
                userRole,
                products,
                List.of(
                        new OrderSeedConfig("COMPLETED", "COD", 3, List.of(new ItemSeed(1, 1, "L", "Đen"), new ItemSeed(7, 1, "XL", "Đen"))),
                        new OrderSeedConfig("COMPLETED", "VNPAY", 15, List.of(new ItemSeed(10, 1, "M", "Xanh navy"), new ItemSeed(4, 1, "L", "Trắng"))),
                        new OrderSeedConfig("PROCESSING", "COD", 1, List.of(new ItemSeed(22, 1, "L", "Xám")))
                )
        );

        // Customer 2: Trần Thị Bích
        createCustomerWithOrders(
                "tranthib",
                "bich.tran@gmail.com",
                "Trần Thị Bích",
                "0987654321",
                "456 Lê Duẩn, Quận Hải Châu, Đà Nẵng",
                Gender.FEMALE,
                userRole,
                products,
                List.of(
                        new OrderSeedConfig("COMPLETED", "MOMO", 7, List.of(new ItemSeed(6, 1, "M", "Trắng"), new ItemSeed(14, 1, "M", "Đen"), new ItemSeed(19, 1, "F", "Nâu"))),
                        new OrderSeedConfig("SHIPPED", "COD", 2, List.of(new ItemSeed(27, 1, "M", "Be")))
                )
        );

        // Customer 3: Lê Hoàng Cường
        createCustomerWithOrders(
                "lehoangc",
                "cuong.le@gmail.com",
                "Lê Hoàng Cường",
                "0901234567",
                "789 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
                Gender.MALE,
                userRole,
                products,
                List.of(
                        new OrderSeedConfig("COMPLETED", "VNPAY", 10, List.of(new ItemSeed(31, 1, "41", "Trắng"), new ItemSeed(15, 1, "L", "Đen")))
                )
        );

        // Customer 4: Phạm Thị Dung
        createCustomerWithOrders(
                "phamthid",
                "dung.pham@gmail.com",
                "Phạm Thị Dung",
                "0934567890",
                "12 Trần Phú, Quận Ngô Quyền, Hải Phòng",
                Gender.FEMALE,
                userRole,
                products,
                List.of(
                        new OrderSeedConfig("COMPLETED", "COD", 5, List.of(new ItemSeed(16, 1, "M", "Đen")))
                )
        );

        // Customer 5: Đặng Quang Minh
        createCustomerWithOrders(
                "dangquang",
                "minh.dang@gmail.com",
                "Đặng Quang Minh",
                "0977889900",
                "88 Kim Mã, Quận Ba Đình, Hà Nội",
                Gender.MALE,
                userRole,
                products,
                List.of(
                        new OrderSeedConfig("PENDING", "COD", 0, List.of(new ItemSeed(21, 1, "L", "Xanh navy")))
                )
        );
    }

    private void createCustomerWithOrders(
            String username,
            String email,
            String fullName,
            String phone,
            String address,
            Gender gender,
            Role userRole,
            List<Product> products,
            List<OrderSeedConfig> orderConfigs) {

        User user = userRepository.findByUsername(username);
        if (user == null) {
            user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setFullName(fullName);
            user.setPhone(phone);
            user.setAddress(address);
            user.setGender(gender);
            user.setPassword(passwordEncoder.encode("123456"));
            user.setRoles(new HashSet<>(Set.of(userRole)));
            user = userRepository.save(user);
            log.info("Created sample customer: {}", username);
        }

        // Check if orders already created for this customer
        List<Order> existingOrders = orderRepository.findByUserId(user.getId());
        if (existingOrders.isEmpty()) {
            for (OrderSeedConfig cfg : orderConfigs) {
                Order order = new Order();
                order.setUser(user);
                order.setReceiverName(user.getFullName());
                order.setReceiverAddress(user.getAddress());
                order.setReceiverPhone(user.getPhone());
                order.setStatus(cfg.status);
                order.setPaymentMethod(cfg.paymentMethod);
                order.setOrderDate(Instant.now().minus(cfg.daysAgo, ChronoUnit.DAYS));
                order.setTotalPrice(0.0);
                Order savedOrder = orderRepository.save(order);

                double total = 0.0;
                for (ItemSeed item : cfg.items) {
                    Product prod = products.stream()
                            .filter(p -> p.getId().equals((long) item.productId))
                            .findFirst()
                            .orElse(products.get(0));

                    OrderDetail od = new OrderDetail();
                    od.setOrder(savedOrder);
                    od.setProduct(prod);
                    od.setQuantity(item.quantity);
                    od.setPrice(prod.getPrice());
                    od.setSize(item.size);
                    od.setColor(item.color);
                    orderDetailRepository.save(od);

                    total += item.quantity * prod.getPrice();
                }

                savedOrder.setTotalPrice(total);
                orderRepository.save(savedOrder);
            }
            log.info("Created {} sample orders for customer: {}", orderConfigs.size(), username);
        }
    }

    private static class OrderSeedConfig {
        String status;
        String paymentMethod;
        int daysAgo;
        List<ItemSeed> items;

        OrderSeedConfig(String status, String paymentMethod, int daysAgo, List<ItemSeed> items) {
            this.status = status;
            this.paymentMethod = paymentMethod;
            this.daysAgo = daysAgo;
            this.items = items;
        }
    }

    private static class ItemSeed {
        int productId;
        long quantity;
        String size;
        String color;

        ItemSeed(int productId, long quantity, String size, String color) {
            this.productId = productId;
            this.quantity = quantity;
            this.size = size;
            this.color = color;
        }
    }
}
