var game = {
	// Boolean value to determine start of game
	initialInput: true,
	// Array of all possible gameplay choices
	masterAnswerArray: ["TIBERIUS", "MARCUS", "BRUTUS", "OCTAVIUS", "CAESAR"],
	// Temp array to determine if the ENTIRE game is over. Wait, prob don't need this
	tempMasterAnswerArray: [],
	// The computer's choice from masterAnswerArray
	initialPick: "",
	// Make sure that user is only able to play with letters, man!!
	alphaRequirement: /^[A-z]+$/,
	// Save total games won, as count will be used for user feedback count (use 'x' as placeholder)
	gamesWon: [],
	// Save total games lost, as count will be used for user feedback count (use 'x' as placeholder)
	gamesLost: [],
	// Establish total possible number of guesses, before the current game is lost
	totalLetterGuessLimit: 15,
	// Array of inidividual letters for each character in the initialPick var
	currentAnswerArray: [],
	// User keystroke
	userGuess: "",
	// Store all correct guesses.  Use this to determine that the word has been guessed correctly.
	correctGuessArray: [],
	// Store all incorrect guesses
	incorrectGuessArray: [],
	// Initialize boolean to track correct or incorrect guess state (to be used to push items to guess arrays)
	correctGuess: false,
	// Initialize correctLetterCount for tracking of correct choices
	correctLetterCount: 0,
	// Initialize incorrectLetterCount for tracking of incorrect choices
	incorrectLetterCount: 0,
	// Initialize count for number of guesses left during current game
	guessesRemaining: 0,
	// Keep track of which round the player is currently playing
	roundNumber: 1,
	// Used for fade in, fade out feedback to use after winning keystroke
	successKeyFeedback: "Nice One!",
	// Used for fade in, fade out feedback to user after losing keystroke
	failureKeyFeedback: "Sorry, no dice!",
	// Used for fade in, fade out feedback to user after duplicate key entry
	dupeKeyFeedback: "You already chose that one!",

	// Create the game blanks and insert the html
	createGuessBlanks: function(id, array) {
		var content = "";
		for(var i=0; i<array.length; i++) {
			content += '<p class="underline" id="'+ i +'"></p>';
		}
		document.querySelector(id).innerHTML = content;
	},

	// Pick a random item from the masterAnswerArray
	randomPick: function() {
		return this.masterAnswerArray[Math.floor(Math.random() * this.masterAnswerArray.length)];
	},

	// Grab the key that the user chooses and convert into an uppercase letter
	convertKeyPress: function(keystroke) {
		return String.fromCharCode(keystroke.keyCode).toUpperCase();
	},

	// Console.log function for debugging
	log: function(msg) {
		console.log(msg + "\n");
	}
};

$(document).ready(function() {

	// Show the modal before gameplay begins
	$("#myModal").modal("show");

	document.onkeyup = function(event) {
		if(game.initialInput) {
			// Hide the modal when user presses the first key
			$("#myModal").modal("hide");

			// Get the computer to choose a random string from masterAnwerArray
			game.initialPick = game.randomPick();
			game.log("initial pick: " + game.initialPick);

			// Push the initialPick 

			// Take the initialPick string and push into currentAnswerArray as an array of letters
			game.currentAnswerArray = game.initialPick.split("");
			game.log("currentAnswerArray: " + game.currentAnswerArray);

			// Fill in zeroes for the counts
			$('h3#remaining-guesses').html(game.guessesRemaining);
			$('h3#total-guesses').html(0);

			// Create html content to display blank answer choices
			game.createGuessBlanks("#guessBlanks", game.currentAnswerArray);

			// Set initialInput to true so that that code goes into gameplay mode at next keystroke
			game.initialInput = false;
		} else {	
			game.log("Entered else block");

			// Grab the key that the user chose
			game.userGuess = game.convertKeyPress(event);
			game.log("keystrok chosen: " + game.userGuess);

			// Test to make sure that the user selected a letter
			if(!game.alphaRequirement.test(game.userGuess)) {
				alert("You can only choose letters!!");
				return false;
			}

			// Establish temp holding array for determining which array to house userGuess in.
			// Do not initialize inside of object, as would have to manually reset it for every keystroke
			var tempCorrectArray = [];

			// Use this loop for updating the blanks on the page. 
			// tempCorrectArray will be used to determine later array push to correct or incorrect guess arrays
			game.currentAnswerArray.forEach(function(letter, index) {
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
				// Store the correct guess if it does not already exist in the array
				if(tempCorrectArray > 1) {
					// Push dupe letters into correct guess array so can determine if round is over in future
					if(game.correctGuessArray.indexOf(game.userGuess) == -1) {
						tempCorrectArray.forEach(function(letter) {
							game.correctGuessArray.push(game.userGuess);
						});
						// Now fade in/ fade out a message on the screen for feedback
						$('.key-feedback').text(game.successKeyFeedback).fadeIn("slow").fadeOut(3500);
					} else {
						// Now fade in/ fade out a message on the screen for duplicate feedback
						$('.key-feedback').text(game.dupeKeyFeedback).fadeIn("slow").fadeOut(3500);
					}
				} else {
					// Will == 1 in this case
					if(game.correctGuessArray.indexOf(game.userGuess) == -1) {
						game.correctGuessArray.push(game.userGuess);
						// Now fade in/ fade out a message on the screen for feedback
						$('.key-feedback').text(game.successKeyFeedback).fadeIn("slow").fadeOut(3500);
					} else {
						// Now fade in/ fade out a message on the screen for duplicate feedback
						$('.key-feedback').text(game.dupeKeyFeedback).fadeIn("slow").fadeOut(3500);
					}
				}
			} else {
				// Store the incorrect guess if it doesn't already exist in the array
				if(game.incorrectGuessArray.indexOf(game.userGuess) == -1) {
					game.incorrectGuessArray.push(game.userGuess);
					// Now fade in/ fade out a message on the screen for feedback
					$('.key-feedback').text(game.failureKeyFeedback).fadeIn("slow").fadeOut(3500);
				} else {
					// Now fade in/ fade out a message on the screen for duplicate feedback
					$('.key-feedback').text(game.dupeKeyFeedback).fadeIn("slow").fadeOut(3500);
				}
			}

			// Use the incorrect array to update the incorrect letters guessed on the screen
			var content = "";
			game.incorrectGuessArray.forEach(function(letter, index) {
				content += (index == game.incorrectGuessArray.length -1) ? letter : letter + ", ";
			});
			$('#letters-incorrect').text(content);

			game.log('correctGuessArray: ' + game.correctGuessArray);
			game.log('incorrectGuessArray: ' + game.incorrectGuessArray);

			// Determine number of guesses left in current game, and display on the screen
			game.guessesRemaining = (game.totalLetterGuessLimit - game.incorrectGuessArray.length); 
			$('#remaining-guesses').text(game.guessesRemaining);

			if(game.guessesRemaining == 0) {
				// Round would end and game would either continue with a new word, or completely end (if master array == blank)
				game.gamesLost.push('x');
				alert("You just lost that round!");
				game.log("You just lost that round!");
				// Pull the initialPick string out of the master array
				var removeIndex = game.masterAnswerArray.indexOf(game.initialPick);
				game.log('initialPick: ' + initialPick);
				(removeIndex != -1) ? game.masterAnswerArray.splice(removeIndex) : alert("initialPick not found!");

				// Check masterAnswerArray length to see if game should continue
				if(masterAnswerArray.length != 0) {
					game.initialPick = game.randomPick();
					game.currentAnswerArray = game.initialPick.split("");
					// Would need to also replace the "Round 1" etc <div> with "Round 2"
					var round = game.roundNumber += 1;
					$('#round-heading').html("Round " + game.roundNumber )
					// Would need to clear the content of the answer blanks

				}
			} else if(game.correctGuessArray.length == game.currentAnswerArray.length) {
				// If the correct guesses == actual current answer array length, then they won!
				alert("Nice job!  You won that one!");
				// Push to the games won array
				game.gamesWon.push('x');
				// Now you need to remove the word from the master answer array

				// At this point, you would need to check and see if the temp master array == original master array. If so, whole game is over.
				// If it is not == original master array, then need to start another round and get the comp to pick another word that doesn't
				// Already exist in the temp master array
				if(game.masterAnswerArray.length == game.tempMasterAnswerArray.length) {
					// The entire game is over, as every round has been exhausted
					alert("Thanks for playing!  Please insert a quarter to start another round /;");
					return false;
				} else {
					// In this case, the comp needs to pick another word from the master array that's NOT already in the temp master array
					// REVISIT THIS
					game.tempMasterAnswerArray.forEach(function(word, index) {
						//if(game.tempMasterAnswerArray.indexOf(word))
					});
				}	
			} else {
				//Update the guesses remaining and the guesses taken values on the screen
				$('h3#remaining-guesses').html(game.guessesRemaining);
				$('h3#total-guesses').html(game.correctGuessArray.length + game.incorrectGuessArray.length);
				game.log("Guesses remaining and taken were updated.");
			}
			// If the value == 0, game is over (Check the temp master array length)

		}
	}
});