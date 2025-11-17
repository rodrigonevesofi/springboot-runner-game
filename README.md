# Spring Boot Superman Dodger Game

Projeto de exemplo para disciplina de ADS — jogo simples (estilo 'dino' / pulos) com backend em Spring Boot (Java 21).

## Como executar

Pré-requisitos:
- Java 21 instalado
- Maven instalado (ou use wrapper)

Na pasta do projeto:

```bash
mvn spring-boot:run
```

O app ficará disponível em `http://localhost:8080/`.

## O que contém
- Backend Spring Boot (endpoints REST para salvar scores em H2)
  - GET /api/scores
  - POST /api/scores  (JSON `{ "player": "Nome", "score": 123 }`)
- Frontend simples em `src/main/resources/static`:
  - index.html
  - app.js
  - styles.css
  - superman.png (sprite - imagem enviada pelo usuário usada como personagem)

## Observações
- Projeto de exemplo para fins educativos. O jogo é simples: toque no canvas ou pressione espaço para pular.
- Você pode melhorar: adicionar sprites, animação, sons, mobile controls, fases, etc.
