/****** elo-backend.js will only update in all the files if you push thru Github ******/

// Global variables for Elo rating history and Chart instance
let ratingHistory = [];
let attemptCount = 0;

// Preload 25 columns (labels 1 to 25)
let initialLabels = Array.from({ length: 25 }, (_, i) => i + 1);

// Initialize Chart.js line chart for Elo progression
const ctx = document.getElementById("eloChart").getContext("2d");
const eloChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [], // preloaded with 25 columns
    datasets: [
      {
        label: "Progression",
        data: [],
        fill: false,
        borderColor: "blue",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: "Questions Solved",
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 2300,
        title: {
          display: true,
          text: "Rating",
        },
      },
    },
  },
});

setTimeout(preloadAttempts, 1000);
function preloadAttempts() {
  attemptCount = -1;
  for (var i = 0; i < ratingHistory.length; i++) {
    attemptCount++;
    // If attemptCount exceeds the preloaded labels, expand the labels array
    if (attemptCount > eloChart.data.labels.length) {
      eloChart.data.labels.push(attemptCount);
    } else {
      // Otherwise, update the existing label (optional)
      eloChart.data.labels[attemptCount - 1] = attemptCount - 1;
    }
    eloChart.data.datasets[0].data.push(ratingHistory[i]);
    eloChart.update();
  }
  if (ratingHistory.length > 0) {
    eloChart.data.datasets[0].data.pop();
    eloChart.update();
  }
}

// Function to add a new attempt data point and update labels if needed
function addAttempt(progressValue) {
  attemptCount++;
  ratingHistory.push(progressValue);
  // If attemptCount exceeds the preloaded labels, expand the labels array
  if (attemptCount > eloChart.data.labels.length) {
    eloChart.data.labels.push(attemptCount);
  } else {
    // Otherwise, update the existing label (optional)
    eloChart.data.labels[attemptCount - 1] = attemptCount;
  }
  eloChart.data.datasets[0].data.push(progressValue);
  eloChart.update();
}

let url = window.location.href;
let cache = url.split("/class/")[1];
cache = cache.split(".html")[0];
let progress = 500;
if(localStorage.getItem(cache)){
  progress = parseInt(localStorage.getItem(cache));
}

let notComingAgain = [];
let problem = 2;
let questionsSolved = -1;
let totalProg = progress;
let problemsCorrect = 0;
let qs = document.getElementById("qs");
let acc = document.getElementById("acc");
let cr = document.getElementById("cr");
let ar = document.getElementById("ar");

const progressBar = document.getElementById("progressBar");
const pro = document.getElementById("pro");
progressBar.style.width = progress / 32 + "%";
progressBar.textContent = Math.round(progress);

// Initialize rating history with initial progress
ratingHistory.push(progress);
eloChart.data.labels.push(attemptCount);
eloChart.data.datasets[0].data.push(progress);
eloChart.update();

loadNewQuestion();
setInterval(progCheck, 100);

function progCheck() {
  var progres = ar.innerHTML;
  localStorage.setItem(cache, progres);
  
  if (progres < 1200) {
    document.getElementById("progressBar").style.backgroundColor = "#ff2c00";
  } else if (progres < 1800) {
    document.getElementById("progressBar").style.backgroundColor = "#fcaf50";
  } else if (progres < 2400) {
    document.getElementById("progressBar").style.backgroundColor = "#4caf50";
  } else {
    document.getElementById("progressBar").style.backgroundColor = "#02a2ff";
  }
}

function problemWrong() {
  updateRating(
    Math.round(
      array[Math.floor(progress / 100)][0] * ratingJump
    )
  );
  document.getElementById("cor").innerHTML = "Wrong!";
  document.getElementById("problemOptions").style.display = "none";
  document.getElementById("solutionOptions").style.display = "inline";
  document.getElementById("solution").innerHTML = questions[problem][1];
}

function problemCorrect() {
  if (progress < 5000) {
    updateRating(array[Math.floor(progress / 100)][1] * ratingJump);
  }
  problemsCorrect++;
  document.getElementById("cor").innerHTML = "Correct!";
  document.getElementById("problemOptions").style.display = "none";
  document.getElementById("solutionOptions").style.display = "inline";
  document.getElementById("solution").innerHTML = questions[problem][1];
}

function loadNewQuestion() {
  var ele = document.getElementsByName("gender");
  for (var i = 0; i < ele.length; i++) {
    ele[i].checked = false;
  }
  progressBar.innerHTML = parseInt(ar.innerHTML);
  questionsSolved++;
  problem = Math.round(progress / 100) - 1;
  if (progress > 1800 && problem < 25) {
    problem = 25;
  } else if (problem > 49) {
    problem = (problem % 25) + 24;
  }
  console.log(notComingAgain);
  console.log(problem);
  while (notComingAgain.indexOf(problem) > -1) {
    problem++;
  }
  document.getElementById("problem").innerHTML = questions[problem][0];
  document.getElementById("problemOptions").style.display = "inline";
  document.getElementById("solutionOptions").style.display = "none";
  document.getElementById("o1").innerHTML = questions[problem][2];
  document.getElementById("o2").innerHTML = questions[problem][3];
  document.getElementById("o3").innerHTML = questions[problem][4];
  document.getElementById("o4").innerHTML = questions[problem][5];
}

function gradeProblem(x) {
  let id = ["option0", "option1", "option2", "option3"];
  notComingAgain.push(problem);
  if (x) {
    if (document.getElementById(id[questions[problem][6] - 1]).checked) {
      //They selected the correct option
      problemCorrect();
      totalProg += Math.max(parseInt(ar.innerHTML), progress);
    } else {
      //They selected the wrong option
      problemWrong();
      totalProg += progress / 2;
    }
  } else {
    //They clicked "See Solution"
    updateRating(
      Math.round(
        array[Math.floor(progress / 100)][0] * ratingJump
      )
    );
    document.getElementById("cor").innerHTML = "Don't worry, you got this!";
    document.getElementById("problemOptions").style.display = "none";
    document.getElementById("solutionOptions").style.display = "inline";
    document.getElementById("solution").innerHTML = questions[problem][1];
    totalProg += progress / 2;
  }
  cr.innerHTML = progress;
  ar.innerHTML = Math.round(totalProg / (attemptCount + 2));
  acc.innerHTML =
    Math.round((problemsCorrect * 100) / (questionsSolved + 1)) + "%";
  qs.innerHTML = questionsSolved + 1;
  progressBar.style.width =
    Math.round(totalProg / (attemptCount + 2)) / 32 + "%";

  if (
    Math.round(totalProg / (attemptCount + 2)) -
      parseInt(progressBar.innerHTML) >
    0
  ) {
    progressBar.innerHTML =
      "<strong>" +
      Math.round(totalProg / (attemptCount + 2)) +
      "</strong> (+" +
      (Math.round(totalProg / (attemptCount + 2)) -
        parseInt(progressBar.innerHTML)) +
      ")";
  } else {
    progressBar.innerHTML =
      "<strong>" +
      Math.round(totalProg / (attemptCount + 2)) +
      "</strong> (" +
      (Math.round(totalProg / (attemptCount + 2)) -
        parseInt(progressBar.innerHTML)) +
      ")";
  }

  setTimeout(function () {
    attemptCount++;
    ratingHistory.push(Math.round(totalProg / (attemptCount + 1)));
    if (attemptCount > 25) {
      eloChart.data.labels.push(attemptCount);
    }
    eloChart.data.datasets[0].data.push(
      Math.round(totalProg / (attemptCount + 1))
    );
    eloChart.update();
  }, 201 * 3);
}

for (var i = 0; i < initialLabels.length; i++) {
  eloChart.data.labels.push(initialLabels[i]);
}

// Updated updateRating function that also updates the Elo progression chart
function updateRating(amount) {
  let val = progress;
  /*for (let i = 200; i >= 1; i--) {
          setTimeout(function () {
            val += (amount * i) / 20100;
            progressBar.style.width = val / 32 + "%";
            if (amount < 0) {
              progressBar.innerHTML =
                "<strong>" + Math.round(val) + "</strong> (" + amount + ")";
            } else {
              progressBar.innerHTML =
                "<strong>" + Math.round(val) + "</strong> (+" + amount + ")";
            }
            if (val < 499.5) {
              progressBar.style.backgroundColor = "#ff0000";
            } else {
              progressBar.style.backgroundColor = "#4caf50";
            }
          }, i * 3);
        }*/
  progress += amount;

  /* After the animation, update the chart with the new rating.
        setTimeout(function () {
          attemptCount++;
          ratingHistory.push(progress);
          if (attemptCount > 25) {
            eloChart.data.labels.push(attemptCount);
          }
          eloChart.data.datasets[0].data.push(progress);
          eloChart.update();
        }, 201 * 3);*/
}
// Inject CSS for the popup
  var popupStyle = document.createElement("style");
  popupStyle.innerHTML = `
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }
  .popup-content {
    background: #fff;
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    text-align: center;
    font-size: 1.2em;
    max-width: 50%;
    max-height: 75%;
    position: relative;
    overflow-y: scroll;
  }
  .close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 20px;
    cursor: pointer;
    background: none;
    border: none;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
`;
  document.head.appendChild(popupStyle);

  function showPopup(message) {
    var overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    
    var content = document.createElement("div");
    content.className = "popup-content";
    content.innerHTML = message;
    
    var closeButton = document.createElement("button");
    closeButton.className = "close-btn";
    closeButton.innerHTML = "&times;";
    closeButton.onclick = function() {
      document.body.removeChild(overlay);
    };
    
    overlay.onclick = function(event) {
      if (event.target === overlay) {
        document.body.removeChild(overlay);
      }
    };
    
    content.appendChild(closeButton);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
  }

  var proficiencyShown = false;
  var masteryShown = false;

  setInterval(function () {
    if (typeof progress !== "undefined") {
      if (progress >= 4000 && !proficiencyShown) {
        proficiencyShown = true;
        showPopup(
          "<strong>Proficiency Achieved!</strong><br>You have achieved proficiency by getting to a rating above 4000.<br>"
        );
      }
      if (progress >= 5000 && !masteryShown) {
        masteryShown = true;
        showPopup(
          "<strong>Mastery Achieved!</strong><br>You have achieved mastery by getting to a rating above 5000."
        );
      }
    }
  }, 500);

  showPopup('<h3>Tutorial - How to Use Elo Practice</h3><iframe width="560" height="315" src="https://www.youtube.com/embed/VYgirFHLwrM?si=h47XOI1EQchj7d-z" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><br><p>For practice units, we have a database full of questions with each problem having its own problem rating, which you can view under the stats tab. As you get problems right, you will level up your rating, when you miss problems, you lose rating. As your rating gets higher and higher, the problems become more and more difficult. Problems rated above 1800 are real AP questions taken straight from past exams, so you should have plenty of practice. <strong>Consider completed practice as either you completing 25 or more questions or getting to a rating above 1800.</strong><br><br><i>Note: Progress is not saved when you close or refresh the tab</i>'); 
    