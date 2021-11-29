const gREQUEST_STATUS_OK = 200;
const gREQUEST_READY_STATUS_FINISH_AND_OK = 4;
//base url
const gBASE_URL = "http://42.115.221.44:8080/devcamp-lucky-dice/";
const gUTF8_TEXT_APPLICATON_HEADER = "application/json;charset=UTF-8";

//form data
var gUserName = document.getElementById("userName");
var gFirstName = document.getElementById("firstName");
var gLastName = document.getElementById("lastName");
var gHistoryResult = document.getElementById("historyResult");

function onClickPostApiNewDice() {
  //hideHistory
  gHistoryResult.style.display = "none";

  //collect data
  var vPersonDataObj = {
    firstname: gFirstName.value.trim(),
    lastname: gLastName.value.trim(),
    username: gUserName.value.trim(),
  };

  //validate data
  var isValid = validateData(vPersonDataObj);
  if (isValid) {
    var vXmlHttpDice = new XMLHttpRequest();
    //send request
    sendRequestGetNewDice(vPersonDataObj, vXmlHttpDice);
    //proccess response data
    vXmlHttpDice.onreadystatechange = function () {
      //when request done or success
      if (
        vXmlHttpDice.readyState == gREQUEST_READY_STATUS_FINISH_AND_OK &&
        vXmlHttpDice.status === gREQUEST_STATUS_OK
      ) {
        handleResponseData(vXmlHttpDice);
      }
    };
  }
}

function onClickGetHistoryDice() {
  //get data
  var vPersonDataHistoryObj = {
    firstname: gFirstName.value.trim(),
    lastname: gLastName.value.trim(),
    username: gUserName.value.trim(),
  };

  //validate Data
  var isValid = validateData(vPersonDataHistoryObj);

  if (isValid) {
    var vXmlHttpDiceHistory = new XMLHttpRequest();
    //send request get history
    sendRequestGetHistoryDice(vPersonDataHistoryObj, vXmlHttpDiceHistory);
    //proccess response data
    vXmlHttpDiceHistory.onreadystatechange = function () {
      if (
        vXmlHttpDiceHistory.readyState ===
          gREQUEST_READY_STATUS_FINISH_AND_OK &&
        vXmlHttpDiceHistory.status === gREQUEST_STATUS_OK
      ) {
        handleResponseHistoryData(vXmlHttpDiceHistory);
      }
    };
  }
}

function validateData(paramPerson) {
  if (paramPerson.username === "") {
    alert("Provide User Name");
    return false;
  }
  if (paramPerson.firstname === "") {
    alert("Provide First Name");
    return false;
  }
  if (paramPerson.lastname === "") {
    alert("Provide Last Name");
    return false;
  }
  return true;
}

function sendRequestGetNewDice(paramPerson, paramXmlHttp) {
  var vPersonDataJson = JSON.stringify(paramPerson);
  paramXmlHttp.open("POST", gBASE_URL + "/dice", true);
  paramXmlHttp.setRequestHeader("Content-Type", gUTF8_TEXT_APPLICATON_HEADER);
  paramXmlHttp.send(vPersonDataJson);
}

function handleResponseData(paramXmlHttp) {
  var vDiceObj = JSON.parse(paramXmlHttp.responseText);

  var resultImg = document.getElementById("resultImg");
  resultImg.src = "./LuckyDiceImages/" + vDiceObj.dice + ".png";

  var textSuccess = document.getElementById("textSuccess");
  var textFailure = document.getElementById("textFailure");

  if (vDiceObj.voucher !== null) {
    var vVoucherTag = document.createElement("p");
    vVoucherTag.innerHTML =
      "Voucher: " + vDiceObj.voucher.phanTramGiamGia + "%";
  }

  if (vDiceObj.prize !== null) {
    var vPrizeTag = document.createElement("p");
    vPrizeTag.innerHTML = "Prize: " + vDiceObj.prize;
  }

  if (vDiceObj.dice > 3) {
    textSuccess.style.display = "block";
    textFailure.style.display = "none";

    textSuccess.innerHTML = "";
    var vCongratText = document.createElement("h2");
    vCongratText.innerHTML = "Congratulations!";
    vCongratText.style.color = "blue";
    textSuccess.appendChild(vCongratText, vVoucherTag, vPrizeTag);
    textSuccess.appendChild(vVoucherTag);
    textSuccess.appendChild(vPrizeTag);
  } else {
    textFailure.style.display = "block";
    textSuccess.style.display = "none";
  }
}

function sendRequestGetHistoryDice(paramPerson, paramXmlHttp) {
  paramXmlHttp.open(
    "GET",
    gBASE_URL + "/dice-history?username=" + paramPerson.username,
    true
  );
  paramXmlHttp.send();
}

function handleResponseHistoryData(paramXmlHttp) {
  var vHistoryDiceObj = JSON.parse(paramXmlHttp.responseText);
  gHistoryResult.style.display = "block";
  gHistoryResult.innerHTML = "";
  gHistoryResult.innerHTML += "Result: " + vHistoryDiceObj.dices;
}
