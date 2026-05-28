package com.harsh.firstSpring.mapping;

import org.springframework.stereotype.Component;

import com.harsh.firstSpring.entity.Category;
import com.harsh.firstSpring.entity.Product;
import com.harsh.firstSpring.model.product.RequestProductDTO;
import com.harsh.firstSpring.model.product.ResponseProductDTO;

@Component
public class ProductMapper {
    
    public Product toEntity(RequestProductDTO dto, Category category) {
        Product entity = new Product();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setCategory(category);
        entity.setStock(dto.getStock());
        return entity;
    }

    public ResponseProductDTO toDTO(Product entity) {
        ResponseProductDTO dto = new ResponseProductDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setStock(entity.getStock());
        if(entity.getCategory() != null)
            dto.setCategoryName(entity.getCategory().getName());
        return dto;
    }

    public void updateEntity(RequestProductDTO dto, Product entity, Category category) {
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setCategory(category);
        entity.setStock(dto.getStock());
    }
}
