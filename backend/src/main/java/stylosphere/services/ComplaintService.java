package stylosphere.services;

// Import from stylosphere packages
import stylosphere.models.feedback.Complaint;
import stylosphere.repositories.ComplaintRepository;

// Import from Spring Service and Autowired
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// Import from standard Java packages
import java.util.List;

@Service
public class ComplaintService
{
    @Autowired
    private ComplaintRepository complaintRepository;

    /**
     * Saves a complaint to the database.
     * @param complain The complaint to be saved.
     * @return The saved complaint.
     */
    public Complaint saveComplaint(Complaint complain)
    {
        return complaintRepository.save(complain);
    }

    /**
     * Fetches all complaints from the database.
     * @return List of all complaints.
     */
    public List<Complaint> getAllComplaints()
    {
        return complaintRepository.findAll();
    }
}
