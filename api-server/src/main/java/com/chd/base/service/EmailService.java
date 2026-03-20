
package com.chd.base.service;

import com.chd.base.model.EmailCampaign;
import com.chd.base.model.EmailSubscriber;

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
