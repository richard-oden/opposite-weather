const cube = document.getElementById("cube");
const userLoc = document.getElementById("user-loc");

function handleInput(input) {
    let inputString = input.value;
    return inputString.split(' ').map(str => parseFloat(str));
}

function calcAntipode([lat, lon]) {
    let newLat = lat * -1;
    let newLon;
    [lon+180, lon-180].forEach(possibleLon => {
        if (possibleLon > -180 && possibleLon < 180) newLon = possibleLon;
    });
    return [newLat, newLon];
}

function generateHTML(json) {
    console.log(json.name, json.main.temp);
}

function runApp() {
    let antipode = calcAntipode(handleInput(userLoc));
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${antipode[0]}&lon=${antipode[1]}&appid=0a50dd3f495753d9c6b5685bdfa0aa0e`)
        .then(response => response.json())
        .then(generateHTML);
    cube.style.transform = "rotateY(-270deg)";
}

function resetApp() {
    cube.style.transform = "rotateY(0)";
}