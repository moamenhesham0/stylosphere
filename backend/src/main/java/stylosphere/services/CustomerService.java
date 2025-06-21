package stylosphere.services;

// Import from stylosphere packages
import stylosphere.repositories.UserRepository;
import stylosphere.models.user.Customer;

// Import from Spring Service and Autowired
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    @Autowired
    private UserRepository<Customer> customerRepository;

    /**
     * Saves a customer to the database.
     * @param customer The customer to be saved.
     * @return The saved customer.
     */
    public Customer getCustomerById(Long id)
    {
        return customerRepository.findById(id).get();
    }
}
