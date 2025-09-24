const name = document.cookie
const user = name.split("=")[1]
let allData = [];
const dreams = [];
const dreamsForm = document.forms[0];
const dreamInput = dreamsForm.elements["dream"];
const dreamsList = document.getElementById("dreams");
const clearButton = document.querySelector('#clear-dreams');

fetch("/getDreams", {})
  .then(res => res.json())
  .then(response => {
    response.forEach(row => {
      appendNewDream(row.dream);
      allData.push(row.dream);
    });
});

setTimeout(function f(){
  alert(allData);
}, 1000)


const appendNewDream = dream => {
  const newListItem = document.createElement("li");
  newListItem.innerText = dream;
  dreamsList.appendChild(newListItem);
};

dreamsForm.onsubmit = event => {
  event.preventDefault();

  const data = { dream: dreamInput.value };

  fetch("/addDream", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(response => {
      console.log(JSON.stringify(response));
    });
  dreams.push(dreamInput.value);
  appendNewDream(dreamInput.value);

  dreamInput.value = "";
  dreamInput.focus();
};

function sqlAddItem(x){
  const data = { dream: x};

  fetch("/addDream", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(response => {
      console.log(JSON.stringify(response));
    });
  dreams.push(x);
  allData.push(x);
 // alert(allData);
}

/*setTimeout(function f(){sqlAddItem("hello")}, 5000)*/

clearButton.addEventListener('click', event => {
  fetch("/clearDreams", {})
    .then(res => res.json())
    .then(response => {
    });
  let delet = dreams.length
  dreamsList.innerHTML = "<li><i>You cleared all past messages</i></li>";
  
});