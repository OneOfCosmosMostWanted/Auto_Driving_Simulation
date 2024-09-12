const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 1500;
let cars = generateCars(N);
let maxNum = 0;
let currentMax = 0;

let counts = 10;

let num = 1;

let bestCar = cars[0];

let isRunning = true;

let gameStarted = false;

let timeout = null;

let gameOver = false;

let numOfGen = 1; //starts at 1

// the cars' neural networks update by refreshing the page 

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

let traffic = createTraffic();

// create traffic
function createTraffic() {
    let traffic = [
      new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -900, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -1100, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(2), -1100, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -1300, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -1300, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(2), -1500, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(0), -1700, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -1700, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -1900, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(2), -1900, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -2100, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(2), -2100, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -2300, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -2300, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(2), -2500, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(0), -2700, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -2700, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -2900, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(2), -2900, 30, 50, "DUMMY", 2),
    ];

  return traffic;
}

// create new generation
function createNewGeneration(oldCars) {
  
  let newCars = generateCars(N);
  
}

// generateTraffic();


// animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

// generate cars for AI
function generateCars(N, newChild = []) {
  const newCars = [];
  if (newChild.length == 0) {
    for (let i = 1; i <= N; i++) {
      newCars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 6));
    }
  } else {
    for (let i = 0; i < N; i++) {
      newCars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 6, newChild[i][0], newChild[i][1]));
    }
  }
  // for (let i = 1; i <= N; i++) {
  //   cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  // }
  return newCars;
}

// Timer
// function secondTimer() {
//   timeout = setTimeout(() => {
//     secondTimer()
//   }, 10000); // 5000 milliseconds = 5 seconds
// }

function firstTimer() {
  if (timeout === null) { // Check if the timeout is not already set
    timeout = setInterval(() => {
      if (currentMax == maxNum) {
        // create new generation
        const newChildValues = createNewGeneration(cars, N);
        const newCars = generateCars(N, newChildValues);

        // place the traffic at the beginning
        cars = newCars;
        traffic = createTraffic();
        maxNum = 0;
        currentMax = 0;

      } else {
        currentMax = maxNum;
      }
      timeout = null; // Reset timeout variable
    }, 10000); // 10000 milliseconds = 10 seconds
  }
}

// function startTimer() {
//   currentMax = maxNum;
//   firstTimer();
// }

// function resetTimer() {
//   clearTimeout(timeout); // Clear the previous timer
//   startTimer(); // Start a new timer
// }


// function generateTraffic() {
//   let randomNum = Math.floor(Math.random() * 3);
//   let x = 200;
//   for (let i = 0; i < counts; i++) {
//     traffic.push(
//       new Car(road.getLaneCenter(randomNum), -2900 - x, 30, 50, "DUMMY", 2),
//     );
//     randomNum = Math.floor(Math.random() * 3);
//     traffic.push(
//       new Car(road.getLaneCenter(randomNum), -2900 - x, 30, 50, "DUMMY", 2),
//     );
//     randomNum = Math.floor(Math.random() * 3);
//     x += 200;
//   }
// }

const popup = document.getElementById('popup');
const geneticBtn = document.getElementById('geneticBtn');
const eliticBtn = document.getElementById('eliticBtn');

document.getElementById("myButton").addEventListener("click", function() {
  // // Your function goes here
  if (!gameStarted) {
    popup.style.display = 'block'; // Show the pop-up
    gameStarted = true;
  } else {
    location.reload();
  }
  // Change button color
  this.style.backgroundColor = "#0000ff"; // Change to desired color
});

// Add event listener to the close button to hide the pop-up
geneticBtn.addEventListener('click', function() {
  // popup.style.display = 'none'; // Hide the pop-up
  firstTimer();
  animate();
  popup.style.display = 'none';
});
eliticBtn.addEventListener('click', function() {
  animate();
  popup.style.display = 'none'; // Hide the pop-up
});

// animate frame
function animate(time) {

  // update the neural net here
  
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, [], []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic, []);
  }

  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  carCtx.globalAlpha = 0.2;

  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;

  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  // check number of cars passed for each 
  for (let i = 0; i < cars.length; i++) {
     for (let j = 0; j < traffic.length; j++) {
       if (cars[i].y < traffic[j].y) {
         if (!cars[i].carsPassed.includes(traffic[j])) {
           cars[i].numOfCarsPassed += 1;
           cars[i].carsPassed.push(traffic[j]);
         }
       }
    }
  }

  // Get the max number of cars passed 
  const numPassed = cars.map(car => car.numOfCarsPassed);

  maxNum = Math.max(...numPassed);
  
  // if (maxNum != temp) {
  //   maxNum = Math.max(...numPassed);
  //   console.log("Current max num of passed: ", maxNum);
  //   evaluateFitness(cars, maxNum);
  //   console.log("car's fitness: ", cars[0].fitness);
  //   console.log("mother and father: ", selectParents(cars));
  //   console.log("weights: ", cars[0].brain.levels[0].weights);
  //   console.log("levels: ", cars[0].brain.levels);
  //   let weights = getWeightsIn1DArray(cars[0].brain.levels);
  //   console.log("weights in 1D: ", weights);  
  //   let biases = getBiasesIn1DArray(cars[0].brain.levels);
  //   console.log("biases in 1D: ", biases);
  //   console.log("child weights", createNewGeneration(cars));
  //   let newChild = createNewGeneration(cars);
  //   let formattedNewChild = formatWeights(newChild, cars[0].parameters);
  //   console.log(createNewGeneration(cars));
  //   console.log("format length :", createNewGeneration(cars));
  //   console.log("original length :", cars[0].brain.levels);
  //   let newKid = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 3, newChild[0][0], newChild[0][1]);
  //   console.log(newChild[0][0], newChild[0][1]);
  //   console.log("First new Gen child: ", newKid);
  //   console.log("new Child's weights and biases: ", newChild.length);
  //   console.log("new test: ");
  // }

  requestAnimationFrame(animate);
}