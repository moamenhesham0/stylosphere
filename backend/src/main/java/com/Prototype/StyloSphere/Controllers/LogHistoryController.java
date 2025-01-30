package com.Prototype.StyloSphere.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.Prototype.StyloSphere.classes.LogHistory.LogInstance;
import com.Prototype.StyloSphere.services.LogHistoryService;
import java.util.*;
@RequestMapping("/api/log-history")
public class LogHistoryController {
    @Autowired
    private LogHistoryService logHistoryService;


    @GetMapping("/get-customer-log-history")
    public ResponseEntity<List<LogInstance>> getCustomerLogHistory(@RequestParam Long userId)
    {
        List<LogInstance> recentLogHistory = new ArrayList<>();
        try {
             recentLogHistory = logHistoryService.getUserLogHistory(userId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(recentLogHistory);
        }
        return ResponseEntity.ok(recentLogHistory);
    }

    @GetMapping("/get-admin-log-history")
    public ResponseEntity<List<LogInstance>> getAdminLogHistory(@RequestParam Long userId)
    {
        List<LogInstance> recentLogHistory = new ArrayList<>();
        try {
             recentLogHistory = logHistoryService.getAdminLogHistory(userId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(recentLogHistory);
        }
        return ResponseEntity.ok(recentLogHistory);
    }

    @PostMapping("/add-log-instance")
    public ResponseEntity<String> addLogInstance(@RequestParam Long userId,
                                                 @RequestParam String device,
                                                 @RequestParam String browser)
                                                 
    {
        try {
            logHistoryService.addLogInstance(userId, device, browser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Server Failure : Failed to save the log instance");
        }
        return ResponseEntity.ok("Log instance successfully saved");
    }
    
}
