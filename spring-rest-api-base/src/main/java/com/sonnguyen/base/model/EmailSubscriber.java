
package com.sonnguyen.base.model;

import lombok.Data;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "email_subscribers")
@Data
public class EmailSubscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;

    private boolean isActive;

    private Date subscribedAt;

    private Date unsubscribedAt;

    // Preferences can be a separate entity or a JSONB column

    @Enumerated(EnumType.STRING)
    private Source source;
}

public enum Source {
    website, checkout, admin, import_source
}
