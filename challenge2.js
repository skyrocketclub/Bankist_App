'use strict';

const calcAverageHumanAge = function (dogAges) {
  //the dog ages are converted to human ages
  console.log(`Dog Ages: ${dogAges}`);
  const humanAges = dogAges.map(function (cur, i, arr) {
    if (cur <= 2) {
      return cur * 2;
    } else {
      return 16 + cur * 4;
    }
  });
  console.log(`Human Ages: ${humanAges}`);

  const dogsOldEnough = humanAges.filter(function (cur, i) {
    return cur >= 18;
  });
  console.log(`Dogs that are at least 18 human years: ${dogsOldEnough}`);

  const totalAge = dogsOldEnough.reduce(function (acc, cur, i, arr) {
    return acc + cur;
  }, 0);
  const averageAge = totalAge / dogsOldEnough.length;
  console.log(`The average age of the human dogs is: ${averageAge}`);
};

// let num;
const averageAge2 = dogAges =>
  dogAges
    .map(cur => {
      if (cur <= 2) return cur * 2;
      else return 16 + cur * 4;
    })
    .filter(cur => {
      return cur >= 18;
    })
    .reduce((acc, cur, i, arr) => {
      return acc + cur / arr.length;
    }, 0);

const dataOne = [5, 2, 4, 1, 15, 8, 3];
const dataTwo = [16, 6, 10, 5, 6, 1, 4];

calcAverageHumanAge(dataOne);
console.log(averageAge2(dataOne));
