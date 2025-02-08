package com.Prototype.StyloSphere.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;



import com.Prototype.StyloSphere.classes.LogHistory.*;


import java.util.*;

@Repository
public interface LogHistoryRepository extends JpaRepository<LogInstance, Date> {
    List<LogInstance> findByUserId(Long userId);
}
