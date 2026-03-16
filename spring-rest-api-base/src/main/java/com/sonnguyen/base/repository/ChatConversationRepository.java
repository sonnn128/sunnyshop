
package com.sonnguyen.base.repository;

import com.sonnguyen.base.model.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatConversationRepository extends JpaRepository<ChatConversation, Long> {
}
