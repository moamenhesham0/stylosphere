package com.Prototype.StyloSphere.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.Prototype.StyloSphere.classes.LogHistory.*;
import java.util.List;

@Repository
public interface LogHistoryRepository extends JpaRepository<LogInstance, LogId> {
    public List<LogInstance> findByUserId(LogId logId);
}
