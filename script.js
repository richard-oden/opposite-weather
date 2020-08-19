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

function calcAntipode(lat, lon) {
    let newLat = lat * -1;
    let pLon = 180 - Math.abs(lon);
    let newLon = (pLon >= 0 && lon >= 0) || (pLon < 0 && lon < 0) ? pLon * -1 : pLon;
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
    let antipodalCoord = calcAntipode(userJSON.coord.lat, userJSON.coord.lon);
    let antipodeJSON = await getJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${antipodalCoord[0]}&lon=${antipodalCoord[1]}&appid=0a50dd3f495753d9c6b5685bdfa0aa0e`);
    generateHTML(userJSON);
    generateHTML(antipodeJSON);
    cube.style.transform = "rotateY(-270deg)";
}

function resetApp() {
    cube.style.transform = "rotateY(0)";
}