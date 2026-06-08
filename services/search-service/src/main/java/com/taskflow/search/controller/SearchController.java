package com.taskflow.search.controller;

import com.taskflow.search.dto.SearchResponse;
import com.taskflow.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:3000"
})
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<SearchResponse> search(
            @RequestParam String q) {

        if (q == null || q.trim().length() < 2) {
            return ResponseEntity.badRequest().build();
        }

        log.info("Search request for: {}", q);
        return ResponseEntity.ok(searchService.search(q.trim()));
    }
}