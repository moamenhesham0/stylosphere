package com.Prototype.StyloSphere.repositories;

import com.Prototype.StyloSphere.classes.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository<T extends User> extends JpaRepository<T, Long> {
    User findByEmail(String email);
}
