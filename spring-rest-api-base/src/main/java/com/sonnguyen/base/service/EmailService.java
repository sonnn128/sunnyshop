
package com.sonnguyen.base.service;

import com.sonnguyen.base.model.EmailCampaign;
import com.sonnguyen.base.model.EmailSubscriber;

import java.util.List;

public interface EmailService {
	EmailSubscriber subscribeEmail(EmailSubscriber subscriber);
	void unsubscribeEmail(String email);
	List<EmailSubscriber> getSubscribers();
	EmailCampaign createCampaign(EmailCampaign campaign);
	List<EmailCampaign> getCampaigns();
	void sendCampaign(Long campaignId);
	void sendEmail(String to, String subject, String content);
}
