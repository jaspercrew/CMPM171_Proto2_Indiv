// https://github.com/JunoNgx/crisp-game-lib-tutorial as reference

title = "Prototype 2";

description = `One Button.`;

const G = {
	WIDTH: 200,
	HEIGHT: 150,
};

characters = [
	`
	LLLLLLLL
	LLLLLLLL
	LLLLLLLL
	LLLLLLLL
	LLLLLLLL
	LLLLLLLL
	`
	];

options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
	theme: "dark",
	isReplayEnabled: true
};

/**
 * @typedef {{
 * pos: Vector,
 * color: Color,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * color: Color
 * }} Box
 */

/**
 * @type { Box [] }
 */

/**
 * @typedef {{
 * pos: Vector
 * color: Color
 * }} BeatBox
 */

/**
 * @type { BeatBox [] }
 */

/**
 * @typedef {{
 * pos: Vector
 * color: Color
 * triggered: Boolean
 * }} Backplate
 */

// Top level var declarations
let beatBoxes;
let currentSequence;
let bpm;
let backPlate;
let topBox;
let bottomBox;
let SCROLLSPEED;
let measureGap;
let begin;

var sequences = [
	[true, false, false, true, true, false, false, true],
	[true, true, false, true, true, false, true, false],
	[false, false, true, true, true, true, true, false],
	[false, true, true, false, true, true, false, true],
]


function update() {
	score += 1;
	if (!ticks) {
		start();
	} else {
		box_update();
		tempo_update();
		beatboxes_update();
		player_update();
		backplate_update();
	}

}

function start(){
	begin = true;
	SCROLLSPEED = 1.3;
	score = 0;
	measureGap = 0;
	player = {
		pos: vec((G.WIDTH * 0.5) - 20, G.HEIGHT * 0.5),
		color:"green"
	};
	backPlate = {
		pos: vec(60, (G.HEIGHT * 0.5) - 15),
		color:"yellow"
	}
	bpm = 120;
	beatBoxes = [];
	currentSequence = [];
	topBox = {
		pos: vec(0, player.pos.y + 15),
		color: "black",
	}

	bottomBox = {
		pos: vec(0, player.pos.y - 25),
		color: "black",
	}
}

function tempo_update(){
	if (ticks % (60 / (bpm / 60)) == 0) { //bpm of 120
		beat_event();
	}
}

function beat_event(){
	if (currentSequence.length == 0){
		console.log("reset")
		sequence_reset();
	}

	if (measureGap > 0) {
		measureGap -= 1;
	} else {
		let isBeat = currentSequence.shift();
		if (isBeat){
			beatBoxes.push({
				pos: vec(G.WIDTH , player.pos.y - 15),
				color: "red"
			});
		} else {
			beatBoxes.push({
				pos: vec(G.WIDTH , player.pos.y - 15),
				color: "light_black",
				triggered: true,
			});
		}
	}

}

function backplate_update(){
	// Drawing
	color(backPlate.color);
	rect(backPlate.pos, 5, 30);
}

function sequence_reset(){
	if (!begin){
		measureGap = 4;
	} else {
		begin = false
	}

	//SCROLLSPEED += 0.01;
	currentSequence = [...sequences[Math.floor(Math.random()*sequences.length)]];
}

function gameEnd(){
	end();
	
	// TODO: find some sound to play on death
	play("powerUp");
}


function player_update(){
    color (player.color);
    char("a", player.pos);
}

function box_update(){
    color(topBox.color);
    rect(topBox.pos, 1000, 10);

	color(bottomBox.color);
    rect(bottomBox.pos, 1000, 10);
}

function beatboxes_update(){
	// Updating and drawing beatboxes

	beatBoxes.forEach((bb) => {
		// Drawing
		color(bb.color);
		rect(bb.pos, 5, 30);
		let isCollidingWithBackplate = Math.abs(bb.pos.x - backPlate.pos.x) < 2;

		// Move the beatboxes backwards
		bb.pos.x -= SCROLLSPEED;


        if (isCollidingWithBackplate && !bb.triggered) { // If collision happens AND colors are mismatching, DIE
			gameEnd();
        }

		if (
			input.isJustPressed &&
			Math.abs(bb.pos.x - player.pos.x) < 5
		) {
			bb.triggered = true;
			bb.color = "light_black"
			play("hit");
			color("black")
			particle(
				player.pos.x + 5, // x coordinate
				player.pos.y, // y coordinate
				16, // The number of particles
				1, // The speed of the particles
				0, // The emitting angle
				PI/2  // The emitting width
			);
		}

	});
}