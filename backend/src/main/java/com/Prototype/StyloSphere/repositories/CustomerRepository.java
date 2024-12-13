package com.Prototype.StyloSphere.repositories;

import com.Prototype.StyloSphere.classes.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByEmail(String email);
}
