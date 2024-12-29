package com.Prototype.StyloSphere.services;

import com.Prototype.StyloSphere.classes.Complain;
import com.Prototype.StyloSphere.repositories.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public Complain saveComplaint(Complain complain) {
        return complaintRepository.save(complain);
    }

    public List<Complain> getAllComplaints() {
        return complaintRepository.findAll();
    }
}
