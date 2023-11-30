// ..............................
// ........ application ......
// ..............................
window.addEventListener('load', () => {
  registerSW();
});

// Register the Service Worker
async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator
            .serviceWorker
            .register('serviceworker.js');
    }
    catch (e) {
      console.log('SW registration failed');
    }
  }
}

// ..............................
// ........ js and firebase ......
// ..............................

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
const appSettings = {
  databaseURL: "https://hints-nurse-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const hintListInDB = ref(database, "Hints");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const hintList = document.getElementById("hint-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  // send data to database
  if(inputValue !=""){
    push(hintListInDB, inputValue);
    clearInputFieldEl();
  }
});

onValue(hintListInDB, (snapshot) => {
  if(snapshot.exists()){
    const hints = Object.entries(snapshot.val());
    clearHitsListEl();
    for (let i = 0; i < hints.length; i++) {
      let currentHint = hints[i];
      let currentHintID = hints[i][0];
      let currentHintValue = hints[i][1];
      addHintToList(currentHint);
    }
  }else{
    hintList.innerHTML =`<div class="empty"> No Hints<span>/</span>Note Here... yet </div>`
  }

});

// clear the inputfield
function clearInputFieldEl() {
  inputFieldEl.value = "";
  inputFieldEl.focus();
}
// write hint
function addHintToList(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");
  newEl.textContent = itemValue;
  hintList.append(newEl);

  // click to remove
  newEl.addEventListener("click", () => {
    let exactLocation = ref(database,`Hints/${itemID}`)
    remove(exactLocation)
  });
}
// clear Hints list element
function clearHitsListEl() {
  hintList.innerHTML = "";
}
