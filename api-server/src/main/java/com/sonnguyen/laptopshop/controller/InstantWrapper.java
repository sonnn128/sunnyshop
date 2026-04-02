package com.sonnguyen.laptopshop.controller;


import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

class InstantWrapper {
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT")
    private LocalDateTime instant;

    public LocalDateTime getInstant() {
        return instant;
    }

    public void setInstant(LocalDateTime instant) {
        this.instant = instant;
    }
}
