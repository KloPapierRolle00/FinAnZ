package com.finantz.controller;

import com.finantz.model.Category;
import com.finantz.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category saved = categoryRepository.save(category);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category update) {
        return categoryRepository.findById(id)
                .map(existing -> {
                    if (update.getName() != null) {
                        existing.setName(update.getName());
                    }
                    return ResponseEntity.ok(categoryRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
