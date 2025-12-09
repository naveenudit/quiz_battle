const category = localStorage.getItem("category");
const difficulty = localStorage.getItem("difficulty");

let apiURL = `https://opentdb.com/api.php?amount=10&type=multiple`;

if (category) apiURL += `&category=${category}`;
if (difficulty) apiURL += `&difficulty=${difficulty}`;

// Global variables for quiz state
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

async function fetchQuestion() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        console.log(apiURL)
        
        const quizContainer = document.getElementById("quiz-container");

        if (data.results.length === 0) {
            quizContainer.innerHTML = "No Question Found. Try selecting different option.";
            return;
        }

        displayQuestions(data.results);
    } catch (error) {
        document.getElementById("quiz-container").innerHTML = "Error fetching questions";
    }
}

function displayQuestions(questions) {
    // Store questions globally once
    quizQuestions = questions;
    // Start with the first question
    showQuestion(quizQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
    const quizContainer = document.getElementById("quiz-container");
    
    // Combine and shuffle the answers
    const options = [
        ...question.incorrect_answers, 
        question.correct_answer
    ];
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    // Map options to HTML buttons
    let optionsHTML = shuffledOptions.map(option => `
        <button class="option-button" onclick="handleAnswerSelection(this, '${question.correct_answer.replace(/'/g, "\\'")}')">
            ${option}
        </button>
    `).join('');
    // Note: Used replace to handle apostrophes in correct answer strings for the function call

    // Render the question and options
    quizContainer.innerHTML = `
        <div class="question-header">
            <h3>Question ${currentQuestionIndex + 1} of ${quizQuestions.length}</h3>
            <p>Score: ${score}</p>
        </div>
        <p class="question-text">${currentQuestionIndex + 1}. ${question.question}</p>
        <div class="options-container">
            ${optionsHTML}
        </div>
        <div id="feedback-message"></div>
        <button id="next-button" onclick="nextQuestion()" disabled>Next Question</button>
    `;
}

function handleAnswerSelection(selectedButton, correctAnswer) {
    const isCorrect = selectedButton.innerText === correctAnswer;
    const feedbackMessage = document.getElementById("feedback-message");
    const optionButtons = document.querySelectorAll(".option-button");
    const nextButton = document.getElementById("next-button");

    // Disable all options after selection and highlight
    optionButtons.forEach(button => {
        button.disabled = true;
        
        if (button.innerText === correctAnswer) {
            button.classList.add("correct");
        } else if (button === selectedButton && !isCorrect) {
            button.classList.add("incorrect");
        }
    });

    // Update score and show feedback
    if (isCorrect) {
        feedbackMessage.innerHTML = "<span class='correct-text'>🎉 Correct!</span>";
        score++;
    } else {
        feedbackMessage.innerHTML = `<span class='incorrect-text'>❌ Incorrect. The correct answer was: <strong>${correctAnswer}</strong></span>`;
    }

    // Enable the 'Next Question' button
    nextButton.disabled = false;
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        // Move to the next question
        showQuestion(quizQuestions[currentQuestionIndex]);
    } else {
        // Quiz is finished, show final score
        const quizContainer = document.getElementById("quiz-container");
        quizContainer.innerHTML = `
            <div class = "result-container">
                <h2>Quiz Complete!</h2>
                <p>Your final score is: **${score}** out of **${quizQuestions.length}**</p>
                <button onclick="window.location.reload()" class='srt-btn'>Start New Quiz</button>
                <button onclick="window.location.href = 'index.html'" class='home-btn'">Home</button>
            </div>
        `;
    }
}

// Start the process
fetchQuestion();