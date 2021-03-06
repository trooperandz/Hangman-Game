'use strict';

/* Ojbect for storage of main game functionality */
const game = {
	// Boolean value to determine start of game
	initialInput: true,
	// Array of all possible gameplay choices
	masterAnswerArray: [

		{
			name: "TIBERIUS",
			hint: "Pliny the Elder called him 'The gloomiest of men'",
		},

		{
			name: "MARCUS",
			hint: "The last of the 'Five Good Emperors'",
		},

		{
			name: "BRUTUS",
			hint: "He assassinated Julius Caesar",
		},

		{
			name: "AUGUSTUS",
			hint: "The founder of the Roman Empire",
		},

		{
			name: "CAESAR",
			hint: "He was assassinated on the Ides of March"
		},

		{
			name: "CALIGULA",
			hint:  "Described as a sadistic, insane tyrant"
		},

		{
			name: "NERO",
			hint: "Romans believed he started the Great Fire of Rome"
		}
	],
	// The computer's random object selection from masterAnswerArray
	initialObjPick: {},
	// The computer's random index selection from masterAnswerArray
	initialIndexPick: 0,
	// The name selected from the initial pick
	namePick: "",
	// The hint selected from the initial pick
	hintPick: "",
	// Make sure that user is only able to play with letters, man!!
	alphaRequirement: /^[A-z]+$/,
	// Save total games won, as count will be used for user feedback count (use 'x' as placeholder)
	roundsWon: [],
	// Save total games lost, as count will be used for user feedback count (use 'x' as placeholder)
	roundsLost: [],
	// Initialize total number of rounds possible. Obtain length from masterAnswerArray at initialization
	roundsTotal: 0,
	// Establish total possible number of guesses, before the current game is lost
	totalLetterGuessLimit: 10,
	// Array of inidividual letters for each character in the initialPick var
	currentAnswerArray: [],
	// User keystroke
	userGuess: "",
	// Store all correct guesses.  Use this to determine that the word has been guessed correctly.
	correctGuessArray: [],
	// Store all incorrect guesses
	incorrectGuessArray: [],
	// Initialize count for number of guesses left during current game
	guessesRemaining: 10,
	// Keep track of which round the player is currently playing
	roundNumber: 0,
	// Used for fade in, fade out feedback to use after winning keystroke
	successKeyFeedback: "Nice One!",
	// Used for fade in, fade out feedback to user after losing keystroke
	failureKeyFeedback: "Sorry, no dice!",
	// Used for fade in, fade out feedback to user after duplicate key entry
	dupeKeyFeedback: "You already chose that one!",

	// Initialize a new round
	initializeGameRound: () => {
		// Reset the object properties for the new round
		game.resetRoundVars();

		// Get the computer to choose a random object from masterAnswerArray. Save the index and the object for later use.
		let index = game.initialIndexPick = game.randomIndexPick();
		let prick = game.initialObjPick = game.masterAnswerArray[index];
		game.namePick = prick.name;
		game.hintPick = prick.hint;
		game.log("name pick: " + game.namePick + " hint pick: " + game.hintPick);

		// Take the namePick string and push into currentAnswerArray as an array of letters
		game.currentAnswerArray = game.namePick.split("");
		game.log("currentAnswerArray: " + game.currentAnswerArray);

		// Increment the game round count, and then fill in the correct game round #
		game.roundNumber = game.roundNumber += 1;
		$('#round-heading').html("Round " + game.roundNumber + " of " + game.roundsTotal).fadeIn(2500);

		// Fill in zeroes for the counts
		$('#remaining-guesses').html(game.guessesRemaining).fadeIn(2500);
		$('#total-guesses').html(0).fadeIn(2500);
		$('#letters-incorrect').text("");

		// Fill in the hint span
		//$('#hint-span').text(game.hintPick);
		let hintSpan = document.getElementById("hint-span");
		hintSpan.innerHTML = game.hintPick;

		// Create html content to display blank answer choices
		game.createGuessBlanks("#guessBlanks", game.currentAnswerArray);
	},

	// Reset the global variables for a new game round. Do not reset master array.  Window reload will do that.
	resetRoundVars: () => {
		game.namePick = "";
		game.hintPick = "";
		game.currentAnswerArray = [];
		game.userGuess = "";
		game.correctGuessArray = [];
		game.incorrectGuessArray = [];
		game.guessesRemaining = 10;
	},

	// Create the game blanks and insert the html
	createGuessBlanks: (id, array) => {
		let content = "";
		for(let i=0; i<array.length; i++) {
			content += '<p class="underline" id="'+ i +'"></p>';
		}
		document.querySelector(id).innerHTML = content;
	},

	// Pick a random object from the masterAnswerArray. Will be used to access name and hint properties of the chosen object.
	randomIndexPick: () => {
		let index = Math.floor(Math.random() * game.masterAnswerArray.length);
		return index;
		//return game.masterAnswerArray[index];
	},

	// Grab the key that the user chooses and convert into an uppercase letter
	convertKeyPress: (keystroke) => {
		return String.fromCharCode(keystroke.keyCode).toUpperCase();
	},

	// Remove the initial pick from the master answer array after game round has concluded
	pullMasterAnswerArray: (index) => {
		game.masterAnswerArray.splice(index, 1);
		game.log('masterAnswerArray should have been altered. It is now: ' + game.masterAnswerArray);
		//var removeIndex = game.masterAnswerArray.indexOf(currentPick);
		//(removeIndex != -1) ? game.masterAnswerArray.splice(removeIndex, 1) : alert("Fatal System Error: initialPick not found!");
		//game.log("masterAnswerArray should have been altered! It is now: " + game.masterAnswerArray);
	},

	// When the game is over, show the win or lose message
	showGameCompleteModal: (msg) => {
		$('#game-over-modal').modal('show');
		$('#game-over-modal-msg').text(msg + " " + game.showGameWinsLostCount());
		game.log("You just reached the end of the game!");
	},

	// Show how many rounds were won/lost in the completed game modal
	showGameWinsLostCount: () => {
		return "You won " + game.roundsWon.length + " rounds and you lost " + game.roundsLost.length + " rounds!";
	},

	// Play the winning music if player wins
	playWinMusic: () => {
		let background = document.getElementById("music-background");
		background.pause();
		let win = document.getElementById("music-win");
		win.play();
	},

	// Play the losing music if player loses
	playLoseMusic: () => {
		let background = document.getElementById("music-background");
		background.pause();
		let lose = document.getElementById("music-lose");
		lose.play();
	},

	// Console.log function for debugging
	log: (msg) => {
		console.log(msg + "\n");
	}
};

const timer = {
	startTimer: () => {
		// Set timer for 15 minutes
		let timeLimit = 60 * 15;
    	let timer = timeLimit, minutes, seconds;
    	setInterval(function () {
    	    let minutes = parseInt(timer / 60, 10);
    	    let seconds = parseInt(timer % 60, 10);

    	    minutes = minutes < 10 ? "0" + minutes : minutes;
    	    seconds = seconds < 10 ? "0" + seconds : seconds;

    	    // If the time runs out, show the game over modal and reset the game vars
    	    if(minutes == "00" && seconds == "00") {
    	    	game.resetRoundVars();
    	    	game.showGameCompleteModal("Game Over! You ran out of time, slowpoke.");
    	    }

    	    // Update the html with the minutes and seconds values
    	    $('.minutes').text(minutes);
    	    $('.seconds').text(seconds);

			// If the timer runs to zero, restart it
    	    if (--timer < 0) {
    	        timer = timeLimit;
    	    }
    	}, 1000);
    }
}

$(document).ready(() => {
	// Show the modal before gameplay begins
	$("#myModal").modal("show");

	// Include the backstretch plugin to make the background image fully responsive
	$.backstretch(
		[
  	      "img/bg_main.jpg",
  	      "img/man.jpg",
  	  	  "img/night.jpg",
  	  	  "img/stairs.jpg",
  	  	  "img/pantheon.jpg",
  	  	  "img/bw_street_sculpture.jpg",
  	  	  "img/forum.jpg",
  		],

  		{
  			duration: 9000,
  			fade: 1400
  		}
  	);

	// Provide a click handler for the game over modal, restart game choice, so that modal goes away
	// Note that the processing code for the new game start has already occurred on the page prior to modal displaying
	$('#new-game-button').on('click', (e) => {
		//e.target.modal("hide");
		location.reload();
	});

	// Provide a click handler for the window close modal button
	$('#close-window-button').on('click', () => {
		window.close();
	});

	document.onkeyup = (event) => {
		if(game.initialInput) {
			// Hide the modal when user presses the first key
			$("#myModal").modal("hide");

			// Initialize the timer
    		timer.startTimer();

			// Set the total number of rounds for round feedback. Note: value will not change as rounds progress.
			game.roundsTotal = game.masterAnswerArray.length;

			// Initialize the new round
			game.initializeGameRound();

			// Set initialInput to true so that that code goes into gameplay mode at next keystroke
			game.initialInput = false;
		} else {
			// Grab the key that the user chose
			game.userGuess = game.convertKeyPress(event);
			//game.log("keystrok chosen: " + game.userGuess);

			// Test to make sure that the user selected a letter
			if(!game.alphaRequirement.test(game.userGuess)) {
				alert("You can only choose letters!!");
				return false;
			}

			// Establish temp holding array for determining which array to house userGuess in.
			// Do not initialize inside of object, as would have to manually reset it for every keystroke
			let tempCorrectArray = [];

			// Use this loop for updating the blanks on the page.
			// tempCorrectArray will be used to determine later array push to correct or incorrect guess arrays
			game.currentAnswerArray.forEach((letter, index) => {
				if(game.userGuess === letter) {
					// Insert the correct letter into the <p> element, and remove the 'underline' class
					$('p#' + index).html(letter).removeClass("underline");
					tempCorrectArray.push(letter);
				}
			});

			// Store userGuess into guess arrays based on tempCorrectArray length
			// incorrectGuessArray lengths will be used later to determine guesses left
			// Note: no need to clear the temp array, as the code above does so for each keystroke
			if(tempCorrectArray.length > 0) {
				// User chose a correct letter! Store the correct guess if it does not already exist in the array
				// Push dupe letters into correct guess array so can determine if round is over in future
				// Note: you need to store dupes so that when user has guessed all correct letters,
				// the length of correctGuessArray == length of correctAnswerArray == correctAnswerArray.length
				if(game.correctGuessArray.indexOf(game.userGuess) == -1) {
					tempCorrectArray.forEach((letter) => {
						game.correctGuessArray.push(game.userGuess);
						game.log("The letter " + game.userGuess + " was addded to correctGuessArray!");
					});
					// Now fade in/ fade out a message on the screen for feedback
					$('.key-feedback').text(game.successKeyFeedback).fadeIn("1000").fadeOut(2500);
				} else {
					// Now fade in/ fade out a message on the screen for duplicate feedback
					$('.key-feedback').text(game.dupeKeyFeedback).fadeIn("1000").fadeOut(2500);
				}
			} else {
				// Store the incorrect guess if it doesn't already exist in the array
				if(game.incorrectGuessArray.indexOf(game.userGuess) == -1) {
					game.incorrectGuessArray.push(game.userGuess);
					// Now fade in/ fade out a message on the screen for feedback
					$('.key-feedback').text(game.failureKeyFeedback).fadeIn("1000").fadeOut(2500);
				} else {
					// Now fade in/ fade out a message on the screen for duplicate feedback
					$('.key-feedback').text(game.dupeKeyFeedback).fadeIn("1000").fadeOut(2500);
				}
			}

			// Use the incorrect array to update the incorrect letters guessed on the screen
			let content = "";
			game.incorrectGuessArray.forEach((letter, index) => {
				content += (index == game.incorrectGuessArray.length -1) ? letter : letter + ", ";
			});

			$('#letters-incorrect').text(content);

			game.log('correctGuessArray: ' + game.correctGuessArray);
			game.log('incorrectGuessArray: ' + game.incorrectGuessArray);

			// Determine number of guesses left in current game, and display on the screen
			game.guessesRemaining = (game.totalLetterGuessLimit - game.incorrectGuessArray.length);
			$('#remaining-guesses').text(game.guessesRemaining);

			// If the user was unable to guess the current word, continue to next round if he/she confirms
			if(game.guessesRemaining == 0) {
				// Record the lost round.
				game.roundsLost.push('x');
				game.log('roundsWon: ' + game.roundsWon);

				// Remove the initial pick from the master answer array
				game.log('masterAnswerArray before pull: ' + game.masterAnswerArray);
				game.pullMasterAnswerArray(game.initialIndexPick);
				game.log('masterAnswerArray after pull: ' + game.masterAnswerArray);

				// User lost the round. Check masterAnswerArray length to see if game should continue
				if(game.masterAnswerArray.length != 0) {
					// Show confirm to ask use if they want to continue playing
					if(!(confirm("Sorry, you weren't smart enough for that one.  Do you want to continue to the next round?"))) {
						// User chose not to continue the game.  End it by reloading the page
						location.reload();
					} else {
						// User chose to go to the next round. Initialize the new round. Note: this method includes the resetRoundVars() method
						game.initializeGameRound();
						game.log("Another round should have started at this point...");

						// Update the games lost count
						$('#game-loss-count').text(game.roundsLost.length);
						return;
					}
				} else {
					// User lost the whole game.  Show game over modal.  Modal button listeners will take care of action.
					game.playLoseMusic();
					game.showGameCompleteModal("Sorry, Game Over! You're not that smart.");
					return;
				}
			} else if(game.correctGuessArray.length == game.currentAnswerArray.length) {
				// If the correct guesses == actual current answer array length, then they won that round! Push to the games won array.
				game.roundsWon.push('x');
				game.log('roundsWon: ' + game.roundsWon);

				// Remove the initial pick from the master answer array
				game.log('masterAnswerArray before pull: ' + game.masterAnswerArray);
				game.pullMasterAnswerArray(game.initialIndexPick);
				game.log('masterAnswerArray after pull: ' + game.masterAnswerArray);

				// User won the round.  Check masterAnswerArray length to see if game should continue
				if(game.masterAnswerArray.length != 0) {
					// Show confirm to ask use if they want to continue playing
					if(!(confirm("Nice work, you won that round!  Do you want to continue to the next round?"))) {
						// User chose not to continue the game.  End it by reloading the page
						location.reload();
					} else {
						// User chose to go to the next round.  Initialize the new round. Note: this method includes the resetRoundVars() method
						game.initializeGameRound();
						game.log("Another round should have started at this point...");

						// Update the games won count
						$('#game-win-count').text(game.roundsWon.length);
						return;
					}
				} else {
					// User won the whole game.  Show game over modal.  Modal button listeners will take care of action.
					game.playWinMusic();
					game.showGameCompleteModal("You won, congrats! Insert $1,500 to play again!");
					return;
				}
			} else {
				//Update the guesses remaining and the guesses taken values on the screen
				$('#remaining-guesses').html(game.guessesRemaining);
				$('#total-guesses').html(game.correctGuessArray.length + game.incorrectGuessArray.length);
				game.log("Guesses remaining and taken were updated.");
			}
		}
	}
});