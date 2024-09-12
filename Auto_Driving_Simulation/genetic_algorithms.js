function rouletteWheelSelection(cars) {

  // calculate the prob
  const totalFitness = cars.reduce((sum, car) => sum + car.fitness, 0);
  const probabilities = cars.map(car => car.fitness / totalFitness);
  // Calculate total probability sum
  const totalProbability = probabilities.reduce((sum, prob) => sum + prob, 0);

  // Generate a random number between 0 and the total probability sum
  const randomValue = Math.random() * totalProbability;

  // Calculate the selected index
  let cumulativeProbability = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomValue <= cumulativeProbability) {
        return i; // Return the index of the selected individual
    }
  }

  // If no index is selected (shouldn't happen unless probabilities sum to 0),
  // return -1 or throw an error indicating the issue.
  return -1;
}

// Evaluate the fitness of each car
function evaluateFitness(cars) {

  cars.sort((a, b) => b.numOfCarsPassed - a.numOfCarsPassed);
  
  // fitness based on numbers of cars passed
  // for (let i = 0; i < cars.length; i++) {
  //   cars[i].fitness += cars[i].numOfCarsPassed * 10;
  // }

  const top1PercentIndex = Math.ceil(cars.length * 0.01);
  // const top1Percent = cars.slice(0, top1PercentIndex);

  const top10PercentIndex = Math.ceil(cars.length * 0.1);
  // const top10Percent = cars.slice(0, top10PercentIndex);

  const top50PercentIndex = Math.ceil(cars.length * 0.5);
  // const top50Percent = cars.slice(0, top50PercentIndex);

  cars[0].fitness += 5;
  cars[1].fitness += 3;
  cars[2].fitness += 1;
  cars[3].fitness += 1;

  // const totalPercent = 10;
  // for (let i = 0; i < top50PercentIndex; i++) {
  //   if (i < top1PercentIndex) {
  //     cars[i].fitness += (totalPercent * 0.6) / (top1PercentIndex + 1);
  //   } else if (i >= top1PercentIndex && i < top10PercentIndex) {
  //     cars[i].fitness += (totalPercent * 0.3) / (top10PercentIndex + 1 - (top1PercentIndex + 1));
  //   } else if (i >= top10PercentIndex && i < top50PercentIndex) {
  //     cars[i].fitness += (totalPercent * 0.1) / (top50PercentIndex + 1 - (top10PercentIndex + 1));
  //   }
  // }
  cars.sort((a, b) => b.fitness - a.fitness);
  console.log(cars);
}

// select the parents
function selectParents(cars) {
  // select the parents
  const parents = [];

  evaluateFitness(cars);
  
  const motherIndex = rouletteWheelSelection(cars);
  const fatherIndex = rouletteWheelSelection(cars);
  parents.push(cars[motherIndex]);
  parents.push(cars[fatherIndex]);
  return parents;
}

// Two-Point Crossover
function twoPointCrossover(parent1, parent2) {
    // Generate two random points within the length of the parents
    const length = parent1.length;
    const point1 = Math.floor(Math.random() * length);
    const point2 = Math.floor(Math.random() * length);

    // Ensure point1 is less than point2
    const [start, end] = point1 < point2 ? [point1, point2] : [point2, point1];

    // Create children arrays initialized with null values
    const child1 = Array(length).fill(null);
    const child2 = Array(length).fill(null);

    // Copy the selected portion from parents to children
    for (let i = start; i <= end; i++) {
        child1[i] = parent1[i];
        child2[i] = parent2[i];
    }

    // Fill the rest of the children with genes from the other parent
    let index1 = (end + 1) % length;

    while (index1 !== start) {
        child1[index1] = parent2[index1];
        child2[index1] = parent1[index1];
        index1 = (index1 + 1) % length;
    }


    return [child1, child2];
}

// mutation on weights and biases
function mutate(weights, biases, mutationRate) {
    const mutatedWeights = [];
    const mutatedBiases = [];

    // Mutation for weights
    for (let i = 0; i < weights.length; i++) {
        const layerWeights = weights[i];
        const mutatedLayerWeights = [];
        for (let j = 0; j < layerWeights.length; j++) {
            const neuronsWeights = layerWeights[j];
            const mutatedNeuronsWeights = neuronsWeights.map(weight => {
                if (Math.random() < mutationRate) {
                    // Mutate weight by adding a small random value
                    let temp = weight + (Math.random() - 0.6) * 1;
                    if (temp >= 1) {
                      return 1;
                    } else if (temp <= -1) {
                      return -1
                    }
                    return temp; // Adjust mutation range as needed
                } else {
                    return weight;
                }
            });
            mutatedLayerWeights.push(mutatedNeuronsWeights);
        }
        mutatedWeights.push(mutatedLayerWeights);
    }

    // Mutation for biases
    for (let i = 0; i < biases.length; i++) {
        const layerBiases = biases[i];
        const mutatedLayerBiases = layerBiases.map(bias => {
            if (Math.random() < mutationRate) {
                // Mutate bias by adding a small random value
                let temp = bias + (Math.random() - 0.6) * 1;
                if (temp >= 1) {
                  return 1;
                } else if (temp <= -1) {
                  return -1;
                }
                return temp; // Adjust mutation range as needed
            } else {
                return bias;
            }
        });
        mutatedBiases.push(mutatedLayerBiases);
    }

    return [mutatedWeights, mutatedBiases];
}



// twopointcrossover takes only 1D array, therefore
// we need to convert the car's weights into 1D array
// Each car's level has its own weight array
// the weight array has weights for each neurons in the level

function getWeightsIn1DArray(levels) {
  let weights = [];
  for (let i = 0; i < levels.length; i++) {
    for (let j = 0; j < levels[i].weights.length; j++) {
      for (let k = 0; k < levels[i].weights[j].length; k++) {
        weights.push(levels[i].weights[j][k]);
      }
    }
  }
  return weights;
}

// function for getting biases in 1D array

function getBiasesIn1DArray(levels) {
  let biases = [];
  for (let i = 0; i < levels.length; i++) {
    for (let j = 0; j < levels[i].biases.length; j++) {
      biases.push(levels[i].biases[j]);
    }
  }
  return biases;
}

// levels -> one level -> weights -> neurons -> its weights
//after format complete -> mutate
// [4, 5, 2] parameters  ->   
function formatWeights(weights, parameters) {
  
  let count = 0;

  const layerWeights = [];
  for (let i = 0; i < parameters.length - 1; i++) {
    const neuronWeights = [];
    
    for (let j = 0; j < parameters[i]; j++) {
      let oneNeuronWeights = [];
      
      for (let k = 0; k < parameters[i + 1]; k++) {
        oneNeuronWeights.push(weights[count]);
        count++;
      }
      
      neuronWeights.push(oneNeuronWeights);
    }
    
    layerWeights.push(neuronWeights);
  }
  return layerWeights;
}

// format biases
function formatBiases(biases, parameters) {
  let count = 0;
  const layerBiases = [];
  for (let i = 1; i < parameters.length; i++) {
    const neuronBiases = [];
    for (let j = 0; j < parameters[i]; j++) {
      neuronBiases.push(biases[count]);
      count++;
    }
    layerBiases.push(neuronBiases);
  }
  return layerBiases;
}


// create new generation based on the mutated child
function createNewGeneration(oldCars, populationSize=100, mutationRate=0.5) {
  const [mother, father] = selectParents(oldCars);
  // need to get the parents' weights and biases first
  let motherWeights = getWeightsIn1DArray(mother.brain.levels);
  let motherBiases = getBiasesIn1DArray(mother.brain.levels);
  let fatherWeights = getWeightsIn1DArray(father.brain.levels);
  let fatherBiases = getBiasesIn1DArray(father.brain.levels);

  // two-point crossover on the weights
  const [firstChildWeights, secondChildWeights] = twoPointCrossover(motherWeights, fatherWeights);

  // two-point crossover on the biases
  const [firstChildBiases, secondChildBiases] = twoPointCrossover(motherBiases, fatherBiases);

  const formattedMotherWeights = formatWeights(motherWeights, mother.parameters);
  const formattedMotherBiases = formatWeights(motherBiases, mother.parameters);
  const formattedFatherWeights = formatWeights(fatherWeights, mother.parameters);
  const formattedFatherBiases = formatWeights(fatherBiases, mother.parameters);
  
  const formattedFirstChildWeights = formatWeights(firstChildWeights, mother.parameters);
  const formattedFirstChildBiases = formatBiases(firstChildBiases, mother.parameters);

  const formattedSecondChildWeights = formatWeights(secondChildWeights, mother.parameters);
  const formattedSecondChildBiases = formatBiases(secondChildBiases, mother.parameters);
  
  
  //create numbers of new generation by mutating the children
  
  const newGeneration = [];
  newGeneration.push([formattedMotherWeights, formattedMotherBiases]);
  newGeneration.push([formattedFatherWeights, formattedFatherBiases]);
  newGeneration.push([formattedFirstChildWeights, formattedFirstChildBiases]);
  newGeneration.push([formattedSecondChildWeights, formattedSecondChildBiases]);

  // create mutated half of populationSize children from the first child
  for (let i = 2; i < populationSize / 2; i++) {
    newGeneration.push(mutate(formattedFirstChildWeights, formattedFirstChildBiases, mutationRate));
  }
  
  // create mutated half of populationSize children from the second child
  for (let i = 2; i < populationSize / 2; i++) {
    newGeneration.push(mutate(formattedSecondChildWeights, formattedSecondChildBiases, mutationRate));
  }
  
  return newGeneration;
  
}