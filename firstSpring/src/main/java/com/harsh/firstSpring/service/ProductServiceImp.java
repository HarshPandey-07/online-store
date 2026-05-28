package com.harsh.firstSpring.service;

import com.harsh.firstSpring.model.PageResponse;
import com.harsh.firstSpring.repository.OrderItemRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.harsh.firstSpring.entity.Category;
import com.harsh.firstSpring.entity.Product;
import com.harsh.firstSpring.mapping.ProductMapper;
import com.harsh.firstSpring.model.product.RequestProductDTO;
import com.harsh.firstSpring.model.product.ResponseProductDTO;
import com.harsh.firstSpring.repository.CategoryRepo;
import com.harsh.firstSpring.repository.ProductRepo;

import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class ProductServiceImp implements ProductService {

    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;
    private final ProductMapper mapper;
    private final OrderItemRepo orderItemRepo;

    ProductServiceImp(ProductRepo productRepo, ProductMapper mapper, CategoryRepo categoryRepo, OrderItemRepo orderItemRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.mapper = mapper;
        this.orderItemRepo = orderItemRepo;
    }


    @Transactional
    @Override
    public String addProduct(RequestProductDTO dto) {
        Category category = categoryRepo.findById(dto.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Cannot get category"));

        productRepo.save(mapper.toEntity(dto, category));
        return "Data saved!";
    }
    
    @Override
    public PageResponse<ResponseProductDTO> viewProducts(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepo.findAll(pageable);
        Page<ResponseProductDTO> dto = productPage.map(mapper::toDTO);
        PageResponse<ResponseProductDTO> pageDTO = new PageResponse<>();

        pageDTO.setContent(dto.getContent());
        pageDTO.setPage(dto.getNumber());
        pageDTO.setSize(dto.getSize());
        pageDTO.setTotalElements(dto.getTotalElements());
        pageDTO.setTotalPages(dto.getTotalPages());

        return pageDTO;
    }

    @Override
    public ResponseProductDTO viewProductSingle(int id) {
        Product entity = productRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Cannot find product"));

        return mapper.toDTO(entity);
    }

    @Transactional
    @Override
    public String deleteProduct(int id) {
        Product productEntity = productRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        orderItemRepo.deleteByProduct(productEntity);
        productRepo.delete(productEntity);
        return "Deleted successfully";
    }
    
    @Transactional
    @Override
    public ResponseProductDTO updateProduct(int id, RequestProductDTO dto) {
        Product product = productRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Cannot find product"));
        Category category = categoryRepo.findById(dto.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Cannot find category"));

        mapper.updateEntity(dto, product, category);
        Product saved = productRepo.save(product);

        return mapper.toDTO(saved);
    }

    @Transactional
    @Override
    public String refillStocks(int id, int stocks) {
        Product product = productRepo.findById(id)
                .orElseThrow();

        if(stocks <= 0)
            return "Cannot add negative value";

        product.setStock(product.getStock() + stocks);

        return "Stocks refilled";
    }

    @Override
    public List<ResponseProductDTO> searchItems(String keyword) {
        return productRepo.searchItems(keyword).stream()
                .map(mapper::toDTO)
                .toList();
    }

}
