package com.Prototype.StyloSphere.Controllers;

import com.Prototype.StyloSphere.classes.Complain;
import com.Prototype.StyloSphere.services.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping("/save")
    public Complain saveComplaint(@RequestBody Complain complain) {
        System.out.println(complain);
        return complaintService.saveComplaint(complain);
    }

    @GetMapping("/all")
    public List<Complain> getAllComplaints() {
        return complaintService.getAllComplaints();
    }
}
