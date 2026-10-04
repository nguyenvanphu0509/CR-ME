package com.creme.identity.persistence;

import com.creme.identity.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
	boolean existsByEmailIgnoreCase(String email);
}
