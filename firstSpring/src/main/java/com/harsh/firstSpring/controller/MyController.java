package com.harsh.firstSpring.controller;

import com.harsh.firstSpring.model.PageResponse;
import com.harsh.firstSpring.model.product.ProductStats;
import org.springframework.web.bind.annotation.*;

import com.harsh.firstSpring.model.product.RequestProductDTO;
import com.harsh.firstSpring.model.product.ResponseProductDTO;
import com.harsh.firstSpring.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MyController {

	private final ProductService productService;
	
	public MyController(ProductService productService) {
		this.productService = productService;
	}
	
	@GetMapping("/product")
	public PageResponse<ResponseProductDTO> myMethod(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size
	) {
		return productService.viewProducts(page, size);
	}
	
	@GetMapping("/product/{id}")
	public ResponseProductDTO getProduct(@PathVariable int id) {
		return productService.viewProductSingle(id);
	}

	@PostMapping("/admin/product")
	public String addProduct(@RequestBody RequestProductDTO dto) {
		return productService.addProduct(dto);
	}

	@DeleteMapping("/admin/product/{id}")
	public String removeProduct(@PathVariable int id) {
		return productService.deleteProduct(id);
	}

	@PutMapping("/admin/product/{id}")
	public ResponseProductDTO updateProduct(@PathVariable int id, @RequestBody RequestProductDTO product) {
		return productService.updateProduct(id, product);
	}

	@PostMapping("/admin/product/refill/{id}")
	public String refillStocks(@PathVariable int id, @RequestParam int stocks) {
		return productService.refillStocks(id, stocks);
	}

	@GetMapping("/product/search")
	public List<ResponseProductDTO> searchItems(@RequestParam String keyword) {
		return productService.searchItems(keyword);
	}

	@GetMapping("/admin/product/stats")
	public ProductStats productStats() {
		return productService.productStats();
	}

}
