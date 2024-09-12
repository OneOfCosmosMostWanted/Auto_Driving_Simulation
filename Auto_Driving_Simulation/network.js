class NeuralNetwork {
    constructor(neuronCounts, weights = [], biases = []) {
        this.levels = [];

        if (weights.length == 0 && biases.length == 0) {
          for (let i = 0; i < neuronCounts.length - 1; i++) {
              this.levels.push(new Level(
                  neuronCounts[i], neuronCounts[i+1]
              ));
          }
        } else {
          for (let i = 0; i < neuronCounts.length - 1; i++) {
              this.levels.push(new Level(
                  neuronCounts[i], neuronCounts[i+1], weights[i], biases[i]
              ));
          }
        }
          // for (let i = 0; i < neuronCounts.length - 1; i++) {
          //     this.levels.push(new Level(
          //         neuronCounts[i], neuronCounts[i+1]
          //     ));
          // }
    }
  
    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(
            givenInputs, network.levels[0]
        );
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(
                outputs, network.levels[i]
            );
        }

        return outputs;
    }

    // mutate the network's weights
    static mutate(network, amount=1) {
        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random() * 2 - 1,
                    amount
                )
            }
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random() * 2 - 1,
                        amount
                    )
                }
            }
        });
    }

    // Genetic Algorithm

    

  
}


class Level {
    constructor(inputCount, outputCount, mutatedWeights = [], mutatedBiases = []) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        // this.mutatedWeights = mutatedWeights;
        // this.mutatedBiases = mutatedBiases;

        this.weights = [];
      
        // for (let i = 0; i < inputCount; i++) {
        //     this.weights[i] = new Array(outputCount);
        // }
      
        if (mutatedWeights.length == 0 && mutatedBiases.length == 0) {
          for (let i = 0; i < inputCount; i++) {
              this.weights[i] = new Array(outputCount);
          }
          Level.#randomize(this);
        } else {
          this.weights = mutatedWeights;
          this.biases = mutatedBiases;
        }
        // Level.#randomize(this);
    }

    //radomize numbers for weights and biases
    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1; // range of the random: [-1, 1]
            }
        }

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }   
    }

    //set the values for the weights and biases
    static #setValues(level) {
      for (let i = 0; i < level.inputs.length; i++) {
          for (let j = 0; j < level.outputs.length; j++) {
              level.weights[i][j] = level.mutatedWeights[i][j];
          }
      }

      for (let i = 0; i < level.biases.length; i++) {
          level.biases[i] = level.mutatedBiases[i];
      }  
    }

    /*feedforwarding with given inputs and level, then return the corresponding ouputs.
      The biases are not added into the outputs*/
    static feedForward(givenInputs, level) {
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            // activation function
            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }

        return level.outputs;
    }
}