package com.otostore.oto_shop.Service;

import com.otostore.oto_shop.Entity.Catalog;
import com.otostore.oto_shop.Exception.ResourceNotFoundException;
import com.otostore.oto_shop.Repository.CatalogRepository;
import com.otostore.oto_shop.Service.CatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CatalogServiceImpl implements CatalogService {

    @Autowired
    private CatalogRepository catalogRepository;

    @Override
    public List<Catalog> getAllCatalogs() {
        return catalogRepository.findAll();
    }

    @Override
    public Optional<Catalog> getCatalogById(Integer id) {
        return catalogRepository.findById(id);
    }

    @Override
    public Catalog createCatalog(Catalog catalog) {
        return catalogRepository.save(catalog);
    }

    @Override
    public Catalog updateCatalog(Integer id, Catalog catalog) {
        Optional<Catalog> existing = catalogRepository.findById(id);
        if (!existing.isPresent()) {
            throw new ResourceNotFoundException("Catalog", "id", id);
        }
        catalog.setIdCata(id);
        return catalogRepository.save(catalog);
    }

    @Override
    public void deleteCatalog(Integer id) {
        Optional<Catalog> catalog = catalogRepository.findById(id);
        if (!catalog.isPresent()) {
            throw new ResourceNotFoundException("Catalog", "id", id);
        }
        catalogRepository.deleteById(id);
    }
}