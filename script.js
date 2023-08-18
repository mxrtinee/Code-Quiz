// Get references to HTML elements
var startButton = document.getElementById("start-button");
var introText = document.getElementById("intro-text");
var quizContainer = document.getElementById("quiz-container");
var timeContainer = document.getElementById("time-container");
var timeDisplay = document.getElementById("time-left");
var questionText = document.getElementById("question-text");
var answerButtons = document.getElementById("answer-buttons");
var feedbackText = document.getElementById("feedback-text");
var endContainer = document.getElementById("end-container");
var finalScore = document.getElementById("final-score");
var submitButton = document.getElementById("submit-button");
var initialsInput = document.getElementById("initials");
var leaderboardContainer = document.getElementById("leaderboard-container");
var restartButton = document.getElementById("restart-button");
var clearButton = document.getElementById("clear-button");

// Variables to keep track of quiz state
var currentQuestionIndex = 0;
var score = 0;
var timeLeft = 60;
var timerInterval;

// Event listeners
startButton.addEventListener("click", startQuiz);

// Array of quiz questions and their answers
var questions = [
  {
    question: "What does 'DOM' stand for?",
    answers: [
      { text: "Document Object Model", correct: true },
      { text: "Document Oriented Model", correct: false },
      { text: "Data Object Model", correct: false },
      { text: "Dynamic Object Model", correct: false }
    ],
  },
  {
    question: "Commonly used in data types DO NOT include:",
    answers: [
      { text: "String", correct: false },
      { text: "Number", correct: false },
      { text: "Boolean", correct: false },
      { text: "Function", correct: true }
    ],
  },
  {
    question: "Array in JavaScript can be used to store ____.",
    answers: [
      { text: "Numbers and strings", correct: false },
      { text: "Other arrays", correct: false },
      { text: "Booleans", correct: false },
      { text: "All of the above", correct: true }
    ],
  },
  {
    question: "A very useful tool used in development and debugging for printing content to the debugger is the ____.",
    answers: [
      { text: "JavaScript", correct: false },
      { text: "Terminal/Bash", correct: false },
      { text: "For loops", correct: false },
      { text: "Console.log", correct: true }
    ],
  },
  {
    question: "The condition in an if/else statement is enclosed within a ____.",
    answers: [
      { text: "Quotes", correct: false },
      { text: "Curly brackets", correct: true },
      { text: "Parentheses", correct: false },
      { text: "Square brackets", correct: false }
    ],
  },
];

// Function to start the quiz
function startQuiz() {
  // Hide intro text and show quiz elements
  introText.style.display = "none";
  startButton.classList.add("hidden");
  timeContainer.classList.remove("hidden");
  quizContainer.classList.remove("hidden");
  startTimer();
  showQuestion(questions[currentQuestionIndex]);
}

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(function() {
    timeLeft--;
    updateTimeDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000); // Timer counts down every 1000ms (1 second)
}

// Function to update the time display
function updateTimeDisplay() {
  timeDisplay.textContent = timeLeft;
}

// Function to display a quiz question
function showQuestion(question) {
  feedbackText.textContent = "";
  questionText.textContent = question.question;
  answerButtons.innerHTML = "";
  question.answers.forEach(function(answer) {
    var button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("btn");
    button.addEventListener("click", function() {
      selectAnswer(answer);
    });
    answerButtons.appendChild(button);
  });
}

// Function to handle user's answer selection
function selectAnswer(answer) {
  if (answer.correct) {
    score++;
    feedbackText.textContent = "Correct!";
  } else {
    decreaseTime(); // Call the function to decrease the timer
    feedbackText.textContent = "Wrong!";
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex]);
  } else {
    endGame();
  }
}

// Function to decrease time penalty for incorrect answers
function decreaseTime() {
  if (timeLeft >= 10) {
    timeLeft -= 10;
  } else {
    timeLeft = 0;
  }
  updateTimeDisplay();
}

// Function to end the quiz and display final score
function endGame() {
  clearInterval(timerInterval);
  quizContainer.classList.add("hidden");
  endContainer.classList.remove("hidden");
  finalScore.textContent = score;
}

// Event listener for submitting user's score
submitButton.addEventListener("click", function() {
  saveScore();
  displayLeaderboard();
});

// Event listener to restart the quiz
restartButton.addEventListener("click", restartQuiz);

// Event listener to clear the leaderboard
clearButton.addEventListener("click", clearLeaderboard);

// Function to save user's score to local storage
function saveScore() {
  var initials = initialsInput.value.trim().toUpperCase();
  if (initials) {
    var highScoreEntry = { initials: initials, score: score };
    saveHighScoreToStorage(highScoreEntry);
  }
}

// Function to save user's score to local storage
function saveHighScoreToStorage(highScoreEntry) {
  var highScores = getHighScoresFromStorage();
  highScores.push(highScoreEntry);
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

// Function to retrieve high scores from local storage
function getHighScoresFromStorage() {
  var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  return highScores;
}

// Function to display the leaderboard
function displayLeaderboard() {
  leaderboardContainer.classList.remove("hidden");
  quizContainer.classList.add("hidden");
  endContainer.classList.add("hidden");
  displayHighScores();
}

// Function to display high scores on the leaderboard
function displayHighScores() {
  var highScores = getHighScoresFromStorage();
  highScores.sort(function(a, b) {
    return b.score - a.score;
  });

  var leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "";
  highScores.forEach(function(entry) {
    var entryElement = document.createElement("div");
    entryElement.classList.add("leaderboard-entry");
    entryElement.textContent = entry.initials + " - " + entry.score;
    leaderboard.appendChild(entryElement);
  });
}

// Function to restart the quiz
function restartQuiz() {
  leaderboardContainer.classList.add("hidden");
  endContainer.classList.add("hidden");
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 60;
  startQuiz();
}

// Function to clear the leaderboard
function clearLeaderboard() {
  localStorage.removeItem("highScores");
  displayHighScores();
}

function stopTimer() {
  clearInterval(timerInterval);
}
// Function to display the leaderboard
function showLeaderboard() {
  introText.style.display = "none";
  quizContainer.style.display = "none";
  endContainer.style.display = "none";
  leaderboardContainer.style.display = "block"; // Show leaderboard
  leaderboardContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  displayHighScores();
}

// Event listener to restart the quiz
restartButton.addEventListener("click", function() {
  resetQuizState(); // Reset the quiz state
  startQuiz();
});

// Function to reset the quiz state
function resetQuizState() {
  stopTimer();
  currentQuestionIndex = 0;
  score = 0;
  updateTimeDisplay();
}