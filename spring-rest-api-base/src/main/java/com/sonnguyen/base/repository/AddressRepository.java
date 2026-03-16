package com.sonnguyen.base.repository;

import com.sonnguyen.base.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
	List<Address> findByUserIdOrderByIsDefaultDescCreatedAtDesc(String userId);

	Optional<Address> findByIdAndUserId(Long id, String userId);

	Optional<Address> findByUserIdAndIsDefaultTrue(String userId);

	long countByUserId(String userId);

	@Modifying
	@Query("UPDATE Address a SET a.isDefault = false WHERE a.userId = :userId")
	void unsetDefaultsByUserId(@Param("userId") String userId);

	@Modifying
	@Query("UPDATE Address a SET a.isDefault = false WHERE a.userId = :userId AND a.id != :id")
	void unsetOtherDefaults(@Param("userId") String userId, @Param("id") Long id);

	Optional<Address> findFirstByUserIdOrderByCreatedAtAsc(String userId);
}
