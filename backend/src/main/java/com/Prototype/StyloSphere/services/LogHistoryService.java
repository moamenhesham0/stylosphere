package com.Prototype.StyloSphere.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Prototype.StyloSphere.repositories.LogHistoryRepository;
import com.Prototype.StyloSphere.classes.LogHistory.*;
import java.util.*;
import java.util.stream.Collectors;
@Service
public class LogHistoryService {
    @Autowired
    private LogHistoryRepository logHistoryRepository;


    public List<LogInstance> getUserLogHistory(Long userId) {
        List<LogInstance> logHistory = logHistoryRepository.findByUserId(userId);
        
        // Get the date one month ago
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, -1);
        Date oneMonthAgo = calendar.getTime();
        
        // Filter the list for instances with a timestamp less than one month old
        logHistory = logHistory.stream()
            .filter(log -> log.getTimeStamp().after(oneMonthAgo))
            .collect(Collectors.toList());

        return logHistory;
    }
    
    public List<LogInstance> getAdminLogHistory(Long userId) { 
        List<LogInstance> logHistory = logHistoryRepository.findByUserId(userId);
        return logHistory;
    }
    

    public void addLogInstance(Long userId , String device , String browser)
    {
        LogInstance newLogInstance = new LogInstance(userId, device, browser);
        logHistoryRepository.save(newLogInstance);
    }

}
