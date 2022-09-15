'use strict';

const jData = [3, 5, 2, 12, 7];
const kData = [4, 1, 15, 8, 3];
const jDataNew = jData.slice(1, -2); //copying the data of the real dogs
/*
The second round of data
const jData = [9, 16, 6, 8, 3];
const kData = [10, 5, 6, 1, 4];
*/
const checkDogs = function (dogs) {
  dogs.forEach(function (dog, i, dogs) {
    if (dog >= 5)
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
    else {
      console.log(`Dog number ${i + 1} is still a puppy 🐶`);
    }
  });
};

checkDogs(jData);
checkDogs(jDataNew);
checkDogs(kData);
