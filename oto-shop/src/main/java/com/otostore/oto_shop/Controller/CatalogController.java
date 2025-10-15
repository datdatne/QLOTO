package com.otostore.oto_shop.Controller;

import com.otostore.oto_shop.Entity.Catalog;
import com.otostore.oto_shop.Service.CatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/catalogs")
@CrossOrigin(origins = "*")
public class CatalogController {

    @Autowired
    private CatalogService catalogService;

    // 1. Lấy tất cả danh mục
    @GetMapping
    public ResponseEntity<List<Catalog>> getAllCatalogs() {
        try {
            List<Catalog> catalogs = catalogService.getAllCatalogs();
            return ResponseEntity.ok(catalogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 2. Lấy danh mục theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Catalog> getCatalogById(@PathVariable Integer id) {
        try {
            Optional<Catalog> catalog = catalogService.getCatalogById(id);
            if (catalog.isPresent()) {
                return ResponseEntity.ok(catalog.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 3. Thêm danh mục mới (ADMIN)
    @PostMapping
    public ResponseEntity<?> createCatalog(@RequestBody Catalog catalog) {
        try {
            Catalog savedCatalog = catalogService.createCatalog(catalog);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Thêm danh mục thành công");
            response.put("catalog", savedCatalog);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // 4. Cập nhật danh mục (ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCatalog(@PathVariable Integer id, @RequestBody Catalog catalog) {
        try {
            Catalog updatedCatalog = catalogService.updateCatalog(id, catalog);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cập nhật danh mục thành công");
            response.put("catalog", updatedCatalog);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // 5. Xóa danh mục (ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCatalog(@PathVariable Integer id) {
        try {
            catalogService.deleteCatalog(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Xóa danh mục thành công");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}