let currentQuestionIndex = 0;
let score = 0;
let questions = [];

function startQuiz() {
    fetchQuestions();
}

function fetchQuestions() {
    const apiUrl = 'https://opentdb.com/api.php?amount=5&type=multiple';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            questions = data.results;
            displayQuestion();
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            alert('Error fetching questions. Please try again.');
        });
}

function displayQuestion() {
    const questionContainer = document.getElementById('question-container');
    const answersContainer = document.getElementById('answers-container');

    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];

        questionContainer.innerHTML = `<p>${currentQuestion.question}</p>`;

        answersContainer.innerHTML = '';
        currentQuestion.incorrect_answers.forEach(answer => {
            answersContainer.innerHTML += `
                <button class="answer-btn incorrect" onclick="checkAnswer(false, this)" disabled>${answer}</button>
            `;
        });

        answersContainer.innerHTML += `
            <button class="answer-btn correct" onclick="checkAnswer(true, this)" disabled>${currentQuestion.correct_answer}</button>
        `;

        // Enable buttons after a short delay
        setTimeout(() => {
            const buttons = document.querySelectorAll('.answer-btn');
            buttons.forEach(button => {
                button.disabled = false;
            });
        }, 1000);
    } else {
        endQuiz();
    }
}

function checkAnswer(isCorrect, selectedButton) {
    if (isCorrect) {
        score++;
    }

    // Disable buttons after an answer is selected
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(button => {
        button.disabled = true;
    });

    // Highlight the correct answer
    selectedButton.classList.add(isCorrect ? 'correct-answer' : 'incorrect-answer');

    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 1000);
}

function endQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your Score: ${score}/${questions.length}</p>
        <button onclick="resetQuiz()">Try Again</button>
    `;
}

function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    fetchQuestions();
}