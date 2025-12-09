let startButtonClicked = document.querySelector(".begin");
let popup = document.querySelector(".pop-up");
let startGameBtn = document.getElementById("startbtn");

function viewPopUp(){
    popup.style.display = 'flex';
}

function hidePopup(){
    popup.style.display = 'none'
}

function onStartGameButtonClicked(){
    const categoryValue = document.getElementById("category").value;
    const difficultyValue = document.getElementById("difficulty").value;

    localStorage.setItem("category",categoryValue);
    localStorage.setItem("difficulty",difficultyValue);

    window.location.href = "quiz.html";
}