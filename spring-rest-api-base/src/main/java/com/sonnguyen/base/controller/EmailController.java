
package com.sonnguyen.base.controller;

import com.sonnguyen.base.model.EmailCampaign;
import com.sonnguyen.base.model.EmailSubscriber;
import com.sonnguyen.base.service.EmailService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/email")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/subscribe")
    public EmailSubscriber subscribeEmail(@RequestBody EmailSubscriber subscriber) {
        return emailService.subscribeEmail(subscriber);
    }

    @PostMapping("/unsubscribe/{email}")
    public void unsubscribeEmail(@PathVariable String email) {
        emailService.unsubscribeEmail(email);
    }

    @GetMapping("/subscribers")
    public List<EmailSubscriber> getSubscribers() {
        return emailService.getSubscribers();
    }

    @PostMapping("/campaigns")
    public EmailCampaign createCampaign(@RequestBody EmailCampaign campaign) {
        return emailService.createCampaign(campaign);
    }

    @GetMapping("/campaigns")
    public List<EmailCampaign> getCampaigns() {
        return emailService.getCampaigns();
    }

    @PostMapping("/campaigns/{campaignId}/send")
    public void sendCampaign(@PathVariable Long campaignId) {
        emailService.sendCampaign(campaignId);
    }
}
