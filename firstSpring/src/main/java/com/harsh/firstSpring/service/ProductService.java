package com.harsh.firstSpring.service;

import com.harsh.firstSpring.model.PageResponse;
import com.harsh.firstSpring.model.product.ProductStats;
import org.springframework.stereotype.Service;

import com.harsh.firstSpring.model.product.RequestProductDTO;
import com.harsh.firstSpring.model.product.ResponseProductDTO;

import java.util.List;

@Service
public interface ProductService {
    String addProduct(RequestProductDTO product);
    PageResponse<ResponseProductDTO> viewProducts(int page, int size);
    ResponseProductDTO viewProductSingle(int id);
    String deleteProduct(int id);
    ResponseProductDTO updateProduct(int id, RequestProductDTO product);
    String refillStocks(int id, int stocks);
    List<ResponseProductDTO> searchItems(String keyword);
    ProductStats productStats();
}
