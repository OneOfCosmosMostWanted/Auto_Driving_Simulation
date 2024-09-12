function lerp(A, B, t) {
  return A + (B - A) * t;
}


function getIntersection(A, B, C, D) {
  const top = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
  if (bottom != 0) {


    const t = top / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {


      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t
      }
    }

  }

  return null;
}

function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length],
      );

      if (touch) {
        return true;
      }
    }

  }

  return false;
}

function polysIntersectLine(poly1, poly2) {


  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(((j + 1) % poly2.length) === 0) ? j : j + 1]
      );
      if (touch) {
        return true;
      }
    }

  }

  return false;

}


function getRGBA(value) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}

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

  // fitness based on How far each car travelled
  // sort the cars by their distance travelled
  cars.sort((a, b) => a.y - b.y);

  // Calculate the index position for the top 1 percent
  const top1PercentIndex = Math.ceil(cars.length * 0.01);
  // Calculate the index position for the top 10 percent
  const top10PercentIndex = Math.ceil(cars.length * 0.1);
  // Calculate the index position for the top 30 percent
  const top30PercentIndex = Math.ceil(cars.length * 0.3);

  for (let i = 0; i < top30PercentIndex; i++) {
    // Top 1% gets 5 points 
    if (i < top1PercentIndex) {
      cars[i].fitness += 5;
    } else if (i >= top1PercentIndex && i < top10PercentIndex) {
      // Top 10% gets 3 points
      cars[i].fitness += 3;
    } else if (i >= top10PercentIndex && i < top30PercentIndex) {
      // Top 30% gets 1 point
      cars[i].fitness += 1;
    }
  }

  // fitness based on numbers of cars passed
  for (let i = 0; i < cars.length; i++) {
    cars[i].fitness += cars[i].numOfCarsPassed;
  }
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

function mutate(weights, biases, mutationRate) {
    const mutatedWeights = [];
    const mutatedBiases = [];

    // Mutation for weights
    for (let i = 0; i < weights.length; i++) {
        const layerWeights = weights[i];
        const mutatedLayerWeights = [];
        for (let j = 0; j < layerWeights.length; j++) {
            const neuronWeights = layerWeights[j];
            const mutatedNeuronWeights = neuronWeights.map(weight => {
                if (Math.random() < mutationRate) {
                    // Mutate weight by adding a small random value
                    return weight + (Math.random() - 0.5) * 0.1; // Adjust mutation range as needed
                } else {
                    return weight;
                }
            });
            mutatedLayerWeights.push(mutatedNeuronWeights);
        }
        mutatedWeights.push(mutatedLayerWeights);
    }

    // Mutation for biases
    for (let i = 0; i < biases.length; i++) {
        const layerBiases = biases[i];
        const mutatedLayerBiases = layerBiases.map(bias => {
            if (Math.random() < mutationRate) {
                // Mutate bias by adding a small random value
                return bias + (Math.random() - 0.5) * 0.1; // Adjust mutation range as needed
            } else {
                return bias;
            }
        });
        mutatedBiases.push(mutatedLayerBiases);
    }

    return [mutatedWeights, mutatedBiases];
}