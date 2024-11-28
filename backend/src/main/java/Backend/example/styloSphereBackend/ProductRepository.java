package Backend.example.styloSphereBackend.repository;

import Backend.example.styloSphereBackend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Custom queries can be added here, for example, to filter by type or price
}


