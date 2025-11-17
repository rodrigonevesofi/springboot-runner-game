package com.runner.game;

import jakarta.persistence.*;

@Entity
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String player;
    private int score;

    public Score() {}
    public Score(String player, int score) { this.player = player; this.score = score; }

    public Long getId() { return id; }
    public String getPlayer() { return player; }
    public void setPlayer(String player) { this.player = player; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
}
