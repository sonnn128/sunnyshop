package com.sonnguyen.laptopshop.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class DatabaseCleanupConfig {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @PostConstruct
    public void cleanupLegacyTables() {
        try {
            // Drop legacy wishlist_items table which blocks product deletion
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=0;");
            jdbcTemplate.execute("DROP TABLE IF EXISTS wishlist_items;");
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=1;");
            log.info("Successfully dropped legacy wishlist_items table");
        } catch (Exception e) {
            log.warn("Could not drop wishlist_items table: " + e.getMessage());
        }
    }
}
