const name = document.cookie
const user = name.split("=")[1]
let allData = [];
const dreams = [];
/*const dreamsForm = document.forms[0];
const dreamInput = dreamsForm.elements["dream"];
const dreamsList = document.getElementById("dreams");
const clearButton = document.querySelector('#clear-dreams');*/

fetch("/getDreams", {})
  .then(res => res.json())
  .then(response => {
    response.forEach(row => {
      allData.push(row.dream);
    });
});
function valid(x){return !(x == "" || x == " " || x.split(" ") != x)}
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
function sqlRead(type, item, columns){
  let results = [];
  for(let i=0; i<allData.length; i++){
    let k = allData[i].split(" ::: ");
    let col = [];
    let itemValid = false;
    if(k[0] == type && (k[1] == item || item == true)){
      if(item == true){
        for(let i=1; i<=columns; i++){
          col.push(k[i]);
          itemValid = true;
        }
      }
      else{
        for(let i=2; i<=columns+1; i++){
          col.push(k[i]);
          itemValid = true;
        }
      }
    }
    if(itemValid){
      results.push(col);
    }
  }
  return results;
}
function login(user, pass){
  let pwd = sqlRead("login", user, 1);
  if(pwd.length < 1){
    alert("That user doesn't exist in our database! If you don't have an account, select \"I don\'t have an account!\"")
  }
  else if(pwd[pwd.length-1] == pass){
    document.cookie = "account="+user;
    window.location = "/index.html"
  }
  else{
    alert("That password is incorrect!")
  }
}
function signup(user, pass, email, backup, phone){
  if(valid(user) && valid(pass) && valid(email) && valid(backup) && !isNaN(phone) && phone.length == 10 && sqlRead("login", user, 1).length < 1){
    alert("Account successfully created!")
    sqlAddItem("login ::: "+user+" ::: "+pass+" ::: "+email+" ::: "+backup+" ::: "+phone);
    window.location = "/index.html"
  }
  else if(!valid(user) || !valid(pass) || !valid(email) || !valid(backup)){
    alert("The username, password, and emails cannot be blank or contain any spaces!")
  }
  else if(isNaN(phone) || phone.length != 10){
    alert("The phone number is invalid!")
  }
  else{
    alert("That username already exists!")
  }
}