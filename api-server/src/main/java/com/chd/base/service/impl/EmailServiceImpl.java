
package com.chd.base.service.impl;

import com.chd.base.model.EmailCampaign;
import com.chd.base.model.EmailSubscriber;
import com.chd.base.service.EmailService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class EmailServiceImpl implements EmailService {

	@Override
	public EmailSubscriber subscribeEmail(EmailSubscriber subscriber) {
		// TODO: Implement logic
		return null;
	}

	@Override
	public void unsubscribeEmail(String email) {
		// TODO: Implement logic
	}

	@Override
	public List<EmailSubscriber> getSubscribers() {
		// TODO: Implement logic
		return Collections.emptyList();
	}

	@Override
	public EmailCampaign createCampaign(EmailCampaign campaign) {
		// TODO: Implement logic
		return null;
	}

	@Override
	public List<EmailCampaign> getCampaigns() {
		// TODO: Implement logic
		return Collections.emptyList();
	}

	@Override
	public void sendCampaign(Long campaignId) {
		// TODO: Implement logic
	}

	@Override
	public void sendEmail(String to, String subject, String content) {
		// TODO: Implement logic
	}
}
