package com.runner.game;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/scores")
public class ScoreController {
    private final ScoreRepository repo;
    public ScoreController(ScoreRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Score> all() { return repo.findAll(); }

    @PostMapping
    public Score save(@RequestBody Score score) { return repo.save(score); }
}
