// variaveis
var lives = 3,
	points = 0,
	meteorMOVE = false,
	fireSPEED = 8,
	speed = 8,
	gameOver = false,
	shipLEFT = false,
	shipRIGHT = false,
	fireUP = false,
	LEFT = 37,
	RIGHT = 39

// imagens
background = new Image();
background.src = "img/fundo.jpg";

var shipIMG = new Image();
shipIMG.src = "img/nave.png";

var meteorIMG = new Image();
meteorIMG.src = "img/meteoro.png";

var bulletIMG = new Image();
bulletIMG.src = "img/bala.png";

var cnv = document.querySelector('canvas');
var ctx = cnv.getContext('2d');

// objetos
var ship = {
	x: 270,
	y: 670,
	w: 80,
	h: 100
}

bullets = [];

meteors = [{
		x: Math.floor(Math.random() * 520) + 1,
		y: -70,
		w: 40,
		h: 60
	},
	{
		x: Math.floor(Math.random() * 520) + 1,
		y: -60,
		w: 40,
		h: 60
	},
	{
		x: Math.floor(Math.random() * 520) + 1,
		y: -90,
		w: 40,
		h: 60
	}
];


// listeners

window.addEventListener("keydown", function keyDown(e) {
	var key = e.keyCode;
	if (key === LEFT && key !== RIGHT) {
		shipLEFT = true;
		shipRIGHT = false;
	}

	if (key === RIGHT && key !== LEFT) {
		shipRIGHT = true;
		shipLEFT = false;
	}

	if (key === 65) {
		side = Math.floor(Math.random() * 2) + 1
		if (side == 1) {
			bullets.push({
				x: ship.x + 17,
				y: ship.y + 35,
				w: 15,
				h: 10
			})
		}
		if (side == 2) {
			bullets.push({
				x: ship.x + 55,
				y: ship.y + 35,
				w: 15,
				h: 10
			})
		}
		fireUP = true
	}
});

window.addEventListener("keyup", function keyUp(e) {
	var key = e.keyCode;
	if (key == LEFT && key !== RIGHT) {
		shipLEFT = false;
	}
	if (key == RIGHT && key !== LEFT) {
		shipRIGHT = false;
	}
});

// movimentação

function shipAction() {
	if (shipLEFT) {
		ship.x -= speed;
	}

	if (shipRIGHT) {
		ship.x += speed;
	}

	if (ship.x > 520) {
		ship.x = 520;
	}
	if (ship.x < 0) {
		ship.x = 0;
	}

	if (fireUP) {
		bullets.forEach(function (value, i, array) {
			bullets[i].y -= 4;
		})
	}
}

function collision() {
	bullets.forEach(function (value, i, array) {
		meteors.forEach(function (value, m, array) {
			if (bullets[i].y >= meteors[m].y && bullets[i].y <= meteors[m].y + meteors[m].h && bullets[i].x >= meteors[m].x && bullets[i].x <= meteors[m].x + meteors[m].w) {
				meteors[m].x = Math.floor(Math.random() * 520) + 1;
				meteors[m].y = -30;
				delete bullets[i];
				points += 1
			}
		})
	})
}

function clearBullets() {
	bullets.forEach(function (value, i, array) {
		if (bullets[i].y < 0) {
			delete bullets[i];
		}
	})
}

function checkStatus() {
	if (meteorMOVE) {
		meteors.forEach(function (value, i, array) {
			meteors[i].y += 2;
		})
	}
	if (lives <= 0) {
		gameOver = true;
	}
}


function render() {
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	ctx.drawImage(background, 0, 0);
	//informações
	ctx.font = "20px Arial";
	ctx.fillText("PONTOS: " + points, 20, 790);
	ctx.fillText("VIDAS: " + lives, 450, 790);
	ctx.fillStyle = "rgb(236, 240, 241)";
	//nave
	ctx.drawImage(shipIMG, ship.x, ship.y, ship.w, ship.h);
	//meteoros
	meteors.forEach(function (value, i, array) {
		ctx.drawImage(meteorIMG, meteors[i].x, meteors[i].y, meteors[i].w, meteors[i].h);
		if (meteors[i].y > 800) {
			meteors[i].x = Math.floor(Math.random() * 520) + 1;
			meteors[i].y = -30;
			lives -= 1;
		}
	})
	// bullets
	bullets.forEach(function (value, i, array) {
		ctx.drawImage(bulletIMG, bullets[i].x, bullets[i].y, bullets[i].w, bullets[i].h);
	})

	if (gameOver) {
		bullets = [];
		ctx.clearRect(0, 0, cnv.width, cnv.height);
		ctx.drawImage(background, 0, 0);
		ctx.font = "25px Arial";
		ctx.fillText("VOCÊ PERDEU!", 225, 320);
		ctx.font = "15px Arial";
		ctx.fillText("Sua Pontuação " + points, 230, 350);
		document.getElementById('restart').style.display = 'block';

	}
}

function start() {
	document.getElementById('start').style.display = 'none';
	meteorMOVE = true;
}

function restart() {
	document.getElementById('restart').style.display = 'none';
	meteors.forEach(function (value, i, array) {
		meteors[i].y = -70;
	})
	gameOver = false;
	lives = 3;
	meteorMOVE = true;
	points = 0;
}

main();

function main() {
	requestAnimationFrame(main, cnv);
	shipAction();
	collision();
	checkStatus();
	clearBullets();
	render();
}