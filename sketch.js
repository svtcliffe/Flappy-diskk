// FLAPPY DISK 
// UNA - Multimediales
// Informática Aplicada 1
// TP3 MiniJuego 
// Alumnx: Victoria Cabello Herrera
// Año 2024
 
let disco;
let obstaculos = [];
let puntaje = 0;
let velocidadBase = 6;
let juegoTerminado = false;
let botonReinicio;
let fuente;
let fondo;
let imgDisco;
let imgRoto;
let obstaculosPasados = 0;

function preload() {
  fuente = loadFont('VCR_OSD_MONO_1.001.ttf'); // fuente estilo videogame
  fondo = loadImage('estrella.jpg'); 
  imgDisco = loadImage('disco.png');
  imgRoto = loadImage('roto.png');
}

function setup() {
  createCanvas(600, 600);
  disco = new configuracionDisco();
  obstaculos.push(new Obstaculo()); 
}

function draw() {
  if (!juegoTerminado) {
    dibujarFondo();
    actualizarObstaculos();
    actualizarDisco();
    mostrarDisco();
    mostrarPuntaje();
  
  // frecuencia con la que aparecen los obstaculos 
    if (frameCount % 60 == 0) {
      obstaculos.push(new Obstaculo());
    }
  }
}

function dibujarFondo() {
  image(fondo, 0, 0, width, height);
}

function actualizarObstaculos() {
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    obstaculos[i].mostrar();
    obstaculos[i].mover();

    // se evalua si hay colision entre el obstaculo y el disco, si hay colision el juego termina y se ejecuta la pantalla de game over
    if (obstaculos[i].colision(disco)) {
      juegoTerminado = true;
      pantallaGameOver();
    }
  
  // si los obstaculos salieron de lienzo se eliminará del array
    if (obstaculos[i].fueraDePantalla()) {
      obstaculos.splice(i, 1);
 // si el obstaculo pasó el obstaculo se cuenta el puntaje
    } else if (obstaculos[i].contarPuntaje(disco)) {
      obstaculosPasados++; 
      velocidadBase += 0.5; // aumenta velocidad
      if (obstaculosPasados % 3 === 0) { // incrementa el puntaje cada 3 obstaculos pasados
        puntaje++;
      }
    }
  }
}

function actualizarDisco() {
  disco.actualizar();
  if (disco.y > height || disco.y < 0) {
    disco.limitar();
  }
}

function mostrarDisco() {
  if (juegoTerminado) {
    image(imgRoto, disco.x, disco.y, 60, 50);
  } else {
    image(imgDisco, disco.x, disco.y, 50, 50);
  }
}

function mostrarPuntaje() {
  fill(255);
  textSize(32);
  textFont(fuente);
  textAlign(LEFT, TOP);
  text('Score: ' + puntaje, 10, 10);
}

// teclas flechita up and down, ENTER para el restart
function keyPressed() {
  if (keyCode === UP_ARROW) {
    disco.arriba();
  } else if (keyCode === DOWN_ARROW) {
    disco.abajo();
  } else if (keyCode === ENTER) {
    if (juegoTerminado) {
      reiniciarJuego();
    }
  }
}

// al soltar se para el disco
function keyReleased() {
  if (keyCode === UP_ARROW) {
    disco.flechaArriba = false;
  } else if (keyCode === DOWN_ARROW) {
    disco.flechaAbajo = false;
  }
}

function pantallaGameOver() {
  fill(0, 150); // transparencia 
  rect(0, 0, width, height);

  textFont(fuente);
  textSize(64);
  fill(255);
  textAlign(CENTER, CENTER);
  text('Game Over', width / 2, height / 2 - 50);

  // estilos del boton
  botonReinicio = createButton('Restart');
  botonReinicio.position(width / 2 - 50, height / 2 + 20);
  botonReinicio.style('background-color', '#5e548e');
  botonReinicio.style('border', '2px solid #fff');
  botonReinicio.style('color', '#fff');
  botonReinicio.style('padding', '10px 18px');
  botonReinicio.style('font-family', 'Courier New');
  botonReinicio.style('font-size', '16px');
  botonReinicio.style('border-radius', '8px');
  botonReinicio.mousePressed(reiniciarJuego);
  botonReinicio.style('position', 'absolute');
}

// RESTART
function reiniciarJuego() {
  puntaje = 0;
  velocidadBase = 6;
  disco = new configuracionDisco();
  obstaculos = [];
  obstaculos.push(new Obstaculo());
  juegoTerminado = false;
  obstaculosPasados = 0;
  botonReinicio.remove();
}

// disco propiedades
class configuracionDisco {
  constructor() {
    this.y = height / 2;
    this.x = 64;
    this.velocidad = 0;
    this.velocidadArriba = -6; // velocidad hacia arriba cuando se mantiene presionada la flecha
    this.velocidadAbajo = 6; // velocidad hacia abajo cuando se mantiene presionada la flecha
    this.flechaArriba = false; // estado de la tecla de flecha hacia arriba
    this.flechaAbajo = false; // estado de la tecla de flecha hacia abajo
  }

  arriba() {
    this.flechaArriba = true; //  la flecha hacia arriba está presionada
  }

  abajo() {
    this.flechaAbajo = true; // la flecha hacia abajo está presionada
  }

  actualizar() {
    this.velocidad *= 0.9;
    if (this.flechaArriba) {
      this.y += this.velocidadArriba; // aumentar la posición hacia arriba si la flecha está presionada
    } else if (this.flechaAbajo) {
      this.y += this.velocidadAbajo; // aumentar la posición hacia abajo si la flecha está presionada
    } else {
      this.y += this.velocidad; // movimiento normal
    }
  }

  limitar() {
    this.y = constrain(this.y, 0, height);
    this.velocidad = 0;
    this.flechaArriba = false; // Asegurarse de restablecer el estado cuando se limita la posición
    this.flechaAbajo = false; // Asegurarse de restablecer el estado cuando se limita la posición
  }
}

// configuracion de los obstaculos
class Obstaculo {
  constructor() {
    this.espacio = random(150, 250); // espaciado entre arriba y abajo aleatorio
    this.alturaMinima = 50; // Altura mínima de arriba
    this.alturaMaxima = height - this.alturaMinima - this.espacio; // Altura máxima de arriba
    this.arriba = random(this.alturaMinima, this.alturaMaxima);
    this.abajo = height - (this.arriba + this.espacio);
    this.x = width;
    this.ancho = random(20, 50); // Ancho variable entre 20 y 50
    this.velocidad = velocidadBase;
    this.puntajeContado = false; 
  }

  mostrar() {
    fill(255);
    rect(this.x, 0, this.ancho, this.arriba);
    rect(this.x, height - this.abajo, this.ancho, this.abajo);
  }

  mover() {
    this.x -= this.velocidad;
  }

  colision(disco) {
    if (disco.y < this.arriba || disco.y > height - this.abajo) {
      if (disco.x > this.x && disco.x < this.x + this.ancho) {
        return true;
      }
    }
    return false;
  }

  // si el obstaculo salio del lienzo
  fueraDePantalla() {
    return this.x < -this.ancho;
  }

  // verifica si el disco paso el obstaculo
  contarPuntaje(disco) {
    if (!this.puntajeContado && this.x < disco.x) {
      this.puntajeContado = true;
      return true;
    }
    return false;
  }
}
