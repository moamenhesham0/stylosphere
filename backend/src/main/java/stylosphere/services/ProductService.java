package stylosphere.services;

// Import stylosphere packages
import stylosphere.models.product.*;
import stylosphere.repositories.ProductRepository;

// Import from Spring Service and Autowired
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// Import from standard Java packages
import java.util.Set;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.function.Function;


@Service
public class ProductService
{
    @Autowired
    private ProductRepository productRepository;


    private String capitalize(String input)
    {
        if (input == null || input.isEmpty())
        {
            return input;
        }
        return input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase();
    }

    /**
     * Saves a product to the database.
     * @param product The product to be saved.
     */
    public void saveProduct(Product product)
    {
        productRepository.save(product);
    }

    /**
     * Fetches all products from the database.
     * @return List of all products.
     */
    public List<Product> getBaseList()
    {
        return productRepository.findAll();
    }

    /**
     * Fetches all products from the database.
     * @return List of all products.
     */
    public Product getProductById(Long id)
    {
        Optional<Product> product = productRepository.findById(id);
        return product.orElse(null);
    }

    /**
     * Filters products by tags.
     * @param attributeList List of tags to filter by.
     * @param products List of products to filter.
     * @param attributeGetterMethod Method to get the attribute from the product.
     * @return List of products that match the specified tags.
     */
    private List<Product> filterByAttribute(List<String> attributeList, List<Product> products, Function<Product, Set<String>> attributeGetterMethod)
    {
        List<Product> filteredProducts = new ArrayList<>();
        for (Product product : products)
        {
            if(matchesAttributeList(attributeList, product, attributeGetterMethod))
            {
                filteredProducts.add(product);
            }
        }
        return filteredProducts;
    }

    /**
     * Filters products by tags.
     * @param tags List of tags to filter by.
     * @param products List of products to filter.
     * @return List of products that match the specified tags.
     */
    public List<Product> filterByTags(List<String> tags, List<Product> products)
    {
        return filterByAttribute(tags, products, Product::getTags);
    }

    /**
     * Filters products by color.
     * @param colors List of colors to filter by.
     * @param products List of products to filter.
     * @return List of products that match the specified colors.
     */
    public List<Product> filterByColor (List<String> colors , List<Product> products)
    {
        return filterByAttribute(colors, products, Product::getColors);
    }

    /**
     * Filters products by size.
     * @param sizes List of sizes to filter by.
     * @param products List of products to filter.
     * @return List of products that match the specified sizes.
     */
    public List<Product> filterBySizes(List<String> sizes, List<Product> products)
    {
        return filterByAttribute(sizes, products, Product::getSizes);
    }

    /**
     * Filters products by style.
     * @param styles List of styles to filter by.
     * @param products List of products to filter.
     * @return List of products that match the specified styles.
     */
    public List<Product> filterByStyles(List<String> styles, List<Product> products)
    {
        return filterByAttribute(styles, products, Product::getStyles);
    }

    /**
     * Filters products by brand.
     * @param brands List of brands to filter by.
     * @param products List of products to filter.
     * @return List of products that match the specified brands.
     */
    public List<Product> filterByBrands(List<String> brands, List<Product> products)
    {
        return filterByAttribute(brands, products, product -> Set.of(product.getBrand()));
    }

    /**
     * Filters products by maximum price.
     * @param maxPrice The maximum price to filter by.
     * @param products List of products to filter.
     * @return List of products that are priced at or below the specified maximum price.
     */
    public List<Product> filterByMaxPrice(double maxPrice, List<Product> products)
    {
        return products.stream()
                       .filter(product -> product.getPrice() <= maxPrice)
                       .collect(Collectors.toList());
    }

    /**
     * Searches for products based on a query string.
     * @param query The search query.
     * @return List of products that match the search query.
     */
    public List<Product> search(String query)
    {
        return productRepository.search(query);
    }

    /**
     * Fetches the top best-selling products.
     * @param limit The maximum number of products to return.
     * @return List of top best-selling products.
     */
    public List<Product> getTopBestSellers(int limit)
    {
        List<Product> allProducts = productRepository.findAll();
        allProducts.sort((p1, p2) -> Integer.compare(p2.getSalesCount(), p1.getSalesCount()));
        return allProducts.stream().limit(limit).toList();
    }

    /**
     * Fetches products that are currently discounted.
     * @return List of discounted products.
     */
    public List<Product> getDiscountedProducts()
    {
        return productRepository.findAll().stream()
                .filter(product -> product.getDiscountedPrice() < product.getPrice())
                .toList();
    }

    /**
     * Checks if a product matches any of the specified attributes in a list.
     * @param attributeList List of attributes to match against.
     * @param product The product to check.
     * @param attributeGetterMethod Method to retrieve the product's attributes.
     * @return True if the product matches any of the attributes, false otherwise.
     */
    private boolean matchesAttributeList(List<String> attributeList, Product product, Function<Product, Set<String>> attributeGetterMethod)
    {
        if (attributeList == null || attributeList.isEmpty())
        {
            return true; // No attributes specified, no filtering required
        }
        Set<String> productAttributes = attributeGetterMethod.apply(product);

        return attributeList.stream().anyMatch(attribute -> productAttributes.contains(attribute.toLowerCase()) ||
                                                             productAttributes.contains(attribute.toUpperCase()) ||
                                                             productAttributes.contains(capitalize(attribute)));
    }

    /**
     * Checks if a product matches any of the specified tags.
     * @param tags List of tags to match against.
     * @param product The product to check.
     * @return True if the product matches any of the tags, false otherwise.
     */
    public boolean matchesTags(List<String> tags, Product product)
    {
        return matchesAttributeList(tags, product, Product::getTags);
    }

    /**
     * Checks if a product matches any of the specified colors.
     * @param colors List of colors to match against.
     * @param product The product to check.
     * @return True if the product matches any of the colors, false otherwise.
     */
    public boolean matchesColors(List<String> colors, Product product)
    {
        return matchesAttributeList(colors, product, Product::getColors);
    }

    /**
     * Checks if a product matches any of the specified sizes.
     * @param sizes List of sizes to match against.
     * @param product The product to check.
     * @return True if the product matches any of the sizes, false otherwise.
     */
    public boolean matchesSizes(List<String> sizes, Product product)
    {
        return matchesAttributeList(sizes, product, Product::getSizes);
    }

    /**
     * Checks if a product matches any of the specified styles.
     * @param styles List of styles to match against.
     * @param product The product to check.
     * @return True if the product matches any of the styles, false otherwise.
     */
    public boolean matchesStyles(List<String> styles, Product product)
    {
        return matchesAttributeList(styles, product, Product::getStyles);
    }

    /**
     * Checks if a product matches any of the specified brands.
     * @param brands List of brands to match against.
     * @param product The product to check.
     * @return True if the product matches any of the brands, false otherwise.
     */
    public boolean matchesBrands(List<String> brands, Product product)
    {
        return matchesAttributeList(brands, product, p -> Set.of(p.getBrand()));
    }
}
