package com.Prototype.StyloSphere.repositories;

import com.Prototype.StyloSphere.classes.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplaintRepository extends JpaRepository<Complain, Long> {
    // No need to override the save method
}

