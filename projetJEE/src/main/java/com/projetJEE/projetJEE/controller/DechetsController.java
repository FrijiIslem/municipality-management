package com.projetJEE.projetJEE.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.projetJEE.projetJEE.dto.DechetsDTO;
import com.projetJEE.projetJEE.entity.Dechets;
import com.projetJEE.projetJEE.service.DechetsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dechets")
@RequiredArgsConstructor
public class DechetsController {

    private final DechetsService dechetsService;

    @PostMapping
    public ResponseEntity<Dechets> create(@RequestBody DechetsDTO dto) {
        return ResponseEntity.ok(dechetsService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<DechetsDTO>> findAll() {
        return ResponseEntity.ok(dechetsService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DechetsDTO> findById(@PathVariable String id) {
        return ResponseEntity.ok(dechetsService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DechetsDTO> update(@PathVariable String id, @RequestBody DechetsDTO dto) {
        return ResponseEntity.ok(dechetsService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        dechetsService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

