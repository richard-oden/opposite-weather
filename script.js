const cube = document.getElementById("cube");
const userInput = document.getElementById("user-input");

function handleInput(inputStr) {
    let inputArr = inputStr.split(/(?:\s|\W)+/gm);
    let urlSubStr = ``;
    // If input is only numbers, try zip code or coordinates:
    if (!inputArr.every(isNaN)) {
        urlSubStr += inputArr.length === 1 ? `zip=${inputArr[0]}` : `lat=${inputArr[0]}&lon=${inputArr[1]}`;
    // If first item in input is number, try zip code and country:
    } else if (!isNaN(inputArr[0])) {
        urlSubStr += `zip=${inputArr[0]},${inputArr[1]}`;
    // Else, try query:
    } else {
        urlSubStr += `q=`
        for (let i = 0; i < inputArr.length; i++) {
            if (acronymToFullName(inputArr[i])) inputArr[i] = acronymToFullName(inputArr[i]);
            urlSubStr += i === inputArr.length-1 ? inputArr[i] : inputArr[i] + ',';
        }
    }
    return urlSubStr;
}

function calcAntipode([lat, lon]) {
    let newLat = lat * -1;
    let newLon;
    [lon+180, lon-180].forEach(possibleLon => {
        if (possibleLon > -180 && possibleLon < 180) newLon = possibleLon;
    });
    return [newLat, newLon];
}

// Handle all fetch requests
async function getJSON(url) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

function generateHTML(json) {
    console.log(json.name, json.main.temp);
}

async function runApp() {
    let userLoc = userInput.value;
    let userJSON = await getJSON(`https://api.openweathermap.org/data/2.5/weather?${handleInput(userLoc)}&appid=0a50dd3f495753d9c6b5685bdfa0aa0e`)
    .then(antipodalCoord = calcAntipode(userJSON.coord.lon, userJSON.coord.lat))
    .then(antipodeJSON = await getJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${antipodalCoord[0]}&lon=${antipodalCoord[1]}&appid=0a50dd3f495753d9c6b5685bdfa0aa0e`))
    .then(generateHTML(userJSON))
    .then(generateHTML(antipodeJSON))
    .finally(cube.style.transform = "rotateY(-270deg)");
}

function resetApp() {
    cube.style.transform = "rotateY(0)";
}