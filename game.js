class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = [{x: 10, y: 10}];
        this.food = this.generateFood();
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameSpeed = 150;
        
        this.setupEventListeners();
        this.updateHighScore();
        this.draw();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
    }
    
    handleKeyPress(e) {
        const key = e.key;
        
        switch(key) {
            case 'ArrowUp':
                if (this.direction !== 'down') {
                    this.nextDirection = 'up';
                }
                break;
            case 'ArrowDown':
                if (this.direction !== 'up') {
                    this.nextDirection = 'down';
                }
                break;
            case 'ArrowLeft':
                if (this.direction !== 'right') {
                    this.nextDirection = 'left';
                }
                break;
            case 'ArrowRight':
                if (this.direction !== 'left') {
                    this.nextDirection = 'right';
                }
                break;
        }
    }
    
    generateFood() {
        const maxX = this.canvas.width / this.gridSize - 1;
        const maxY = this.canvas.height / this.gridSize - 1;
        
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        
        return food;
    }
    
    moveSnake() {
        this.direction = this.nextDirection;
        const head = {...this.snake[0]};
        
        switch(this.direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // Verificar colisão com paredes
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.gameOver();
            return;
        }
        
        // Verificar colisão com o próprio corpo
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Verificar se comeu a comida
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.food = this.generateFood();
            // Aumentar velocidade
            if (this.gameSpeed > 50) {
                this.gameSpeed -= 5;
            }
        } else {
            this.snake.pop();
        }
    }
    
    draw() {
        // Limpar canvas
        this.ctx.fillStyle = '#f8f8f8';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Desenhar grade
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Desenhar minhoca
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Cabeça
                this.ctx.fillStyle = '#2E8B57';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 2,
                    segment.y * this.gridSize + 2,
                    this.gridSize - 4,
                    this.gridSize - 4
                );
                
                // Olhos
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 6,
                    segment.y * this.gridSize + 6,
                    3,
                    3
                );
                this.ctx.fillRect(
                    segment.x * this.gridSize + 11,
                    segment.y * this.gridSize + 6,
                    3,
                    3
                );
            } else {
                // Corpo
                this.ctx.fillStyle = '#3CB371';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 2,
                    segment.y * this.gridSize + 2,
                    this.gridSize - 4,
                    this.gridSize - 4
                );
            }
        });
        
        // Desenhar comida
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
    }
    
    updateHighScore() {
        document.getElementById('highScore').textContent = this.highScore;
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gamePaused = false;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateHighScore();
            alert(`Parabéns! Novo recorde: ${this.score} pontos!`);
        } else {
            alert(`Fim de jogo! Pontuação: ${this.score}`);
        }
        
        this.resetGame();
    }
    
    resetGame() {
        this.snake = [{x: 10, y: 10}];
        this.food = this.generateFood();
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameSpeed = 150;
        this.updateScore();
        this.draw();
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
    }
    
    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            document.getElementById('startBtn').disabled = true;
            document.getElementById('pauseBtn').disabled = false;
            this.gameLoop();
        }
    }
    
    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            if (!this.gamePaused) {
                this.gameLoop();
            }
        }
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) {
            return;
        }
        
        this.moveSnake();
        this.draw();
        
        setTimeout(() => {
            this.gameLoop();
        }, this.gameSpeed);
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
