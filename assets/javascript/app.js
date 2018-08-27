var triviaQuestions = [{
	question: "WHEN WAS THE PILOT EPISODE OF RICK AND MORTY AIRED?",
	answerList: ["December 2012", "October 2011", "January 2014", "July 2013"],
	answer: 0
},{
	question: "WHAT IS RICK’S MAIN CATCHPHRASE?",
	answerList: ["Blamo lamma jamma", "Wubba lubba dub dub", "whoop  whoo sweeee", "noc knoc socks"],
	answer: 1
},{
	question: "WHAT WAS JERRY'S JOB BEFORE BEING FIRED?",
	answerList: ["Real estate agent", "Car salesman", "Advertising agent", "Supermarket manager"],
	answer: 2
},{
	question: "WHAT IS THE NAME OF THE GADGET THAT RICK USES TO TRAVEL BETWEEN DIMENSIONS AND UNIVERSES?",
	answerList: ["Whipper snapper", "Deportation device", "Transporter", "Portal gun"],
	answer: 3
},{
	question: "WHAT IS THE NAME OF MORTY’S HIGH SCHOOL??",
	answerList: ["Lincoln", "Herold Samson", "Harry Hempson", "Rick skipped high school"],
	answer: 2
},{
	question: "IN SEASON 3, RICK TRANSFORMED HIMSELF INTO WHAT FOOD ITEM?",
	answerList: ["Pickle", "Banana", "Eggplant", "Cucumber"],
	answer: 0
},{
	question: "WHAT CEREAL DO THE SMITHS EAT?",
	answerList: ["Flakecorns", "Hoes and berries", "Captain stuffits", "Strawberry Smiggles"],
	answer: 3
},{
	question: "WHAT IS JERRY’S FAVORITE MOVIE??",
	answerList: ["Goonies", "Titanic", "Dirty dancing", "Clue"],
	answer: 1
},{
	question: "WHO IS ONE OF RICK’S TWO BESTFRIENDS?",
	answerList: ["Squibbles", "Longjack", "Birdperson", "Morty"],
	answer: 2
},{
	question: "IN SEASON 1, EPISODE 7,WHAT NON-HUMAN SPECIES MAKES UP HALF OF MORTY'S SON? ?",
	answerList: ["Squanchies", "Traflorkian", "Conardians", "Gazorpazorp"],
	answer: 3
},{
	question: "WHAT IS BETH’S JOB?",
	answerList: ["Horse surgeon", "Dentist", "Butcher", "Adoption agent"],
	answer: 0
}];
var search = ['rick+morty+adventure','rick+morty', 'meeseeks', 'rick+morty+dancing','rick+morty+flying','rick+picklerick','morty+gazorpazorp', 'rick+morty+snap', 'rick+beth','morty+beth']
var currentQuestion; 
var correctAnswer; 
var incorrectAnswer;
var unanswered; 
var seconds;
var time;
var answered;
var userSelect;
var messages = {
	correct: "BOOM! Brilliance strikes again!",
	incorrect: "Perhaps you need to reinterpret your data",
	endTime: "Out of time!",
	finished: "Alright! Let's see how well you did."
}

$('#startBtn').on('click', function(){
	$(this).hide();
	newGame();
});

$('#startOverBtn').on('click', function(){
	$(this).hide();
	newGame();
});

function newGame(){
	$('#finalMessage').empty();
	$('#correctAnswers').empty();
	$('#incorrectAnswers').empty();
	$('#unanswered').empty();
	currentQuestion = 0;
	correctAnswer = 0;
	incorrectAnswer = 0;
	unanswered = 0;
	newQuestion();
}

function newQuestion(){
	$('#message').empty();
	$('#correctedAnswer').empty();
	$('#gif').empty();
	answered = true;
	
	//sets up new questions & answerList
	$('#currentQuestion').html('Question #'+(currentQuestion+1)+'/'+triviaQuestions.length);
	$('.question').html('<h2>' + triviaQuestions[currentQuestion].question + '</h2>');
	for(var i = 0; i < 4; i++){
		var choices = $('<div>');
		choices.text(triviaQuestions[currentQuestion].answerList[i]);
		choices.attr({'data-index': i });
		choices.addClass('thisChoice');
		$('.answerList').append(choices);
	}
	countdown();
	//clicking an answer will pause the time and setup answerPage
	$('.thisChoice').on('click',function(){
		userSelect = $(this).data('index');
		clearInterval(time);
		answerPage();
	});
}

function countdown(){
	seconds = 15;
	$('#timeLeft').html('<h3>Time Remaining: ' + seconds + '</h3>');
	answered = true;
	//sets timer to go down
	time = setInterval(showCountdown, 1000);
}

function showCountdown(){
	seconds--;
	$('#timeLeft').html('<h3>Time Remaining: ' + seconds + '</h3>');
	if(seconds < 1){
		clearInterval(time);
		answered = false;
		answerPage();
	}
}

function answerPage(){
	$('#currentQuestion').empty();
	$('.thisChoice').empty(); //Clears question page
	$('.question').empty();

	var rightAnswerText = triviaQuestions[currentQuestion].answerList[triviaQuestions[currentQuestion].answer];
	var rightAnswerIndex = triviaQuestions[currentQuestion].answer;
	//giphy api
	var giphyURL = "http://api.giphy.com/v1/gifs/search?q=rickandmorty+" + search[currentQuestion] + "&limit=1&rating=g&api_key=dc6zaTOxFJmzC"
	$.ajax({url: giphyURL, method: 'GET'}).done(function(giphy){
		var currentGif = giphy.data;
		$.each(currentGif, function(index,value){
		var embedGif = value.images.original.url;
		newGif = $('<img>');
		newGif.attr('src', embedGif);
		newGif.addClass('gifImg');
		$('#gif').html(newGif);
		});
	});
	//checks to see correct, incorrect, or unanswered
	if((userSelect == rightAnswerIndex) && (answered == true)){
		correctAnswer++;
		$('#message').html(messages.correct);
	} else if((userSelect != rightAnswerIndex) && (answered == true)){
		incorrectAnswer++;
		$('#message').html(messages.incorrect);
		$('#correctedAnswer').html('The correct answer was: ' + rightAnswerText);
	} else{
		unanswered++;
		$('#message').html(messages.endTime);
		$('#correctedAnswer').html('The correct answer was: ' + rightAnswerText);
		answered = true;
	}
	
	if(currentQuestion == (triviaQuestions.length-1)){
		setTimeout(scoreboard, 5000)
	} else{
		currentQuestion++;
		setTimeout(newQuestion, 5000);
	}	
}

function scoreboard(){
	$('#timeLeft').empty();
	$('#message').empty();
	$('#correctedAnswer').empty();
	$('#gif').empty();

	$('#finalMessage').html(messages.finished);
	$('#correctAnswers').html("Correct Answers: " + correctAnswer);
	$('#incorrectAnswers').html("Incorrect Answers: " + incorrectAnswer);
	$('#unanswered').html("Unanswered: " + unanswered);
	$('#startOverBtn').addClass('reset');
	$('#startOverBtn').show();
	$('#startOverBtn').html('Start Over?');
}