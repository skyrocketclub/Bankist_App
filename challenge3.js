'use strict';

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// current > (recommended * 0.90) && current < (recommended *1.10)

let ownersEatTooMuch = [];
let ownersEatTooLittle = [];
let ownersEatOkay = [];

for (const objs of dogs) {
  objs.recommendedFood = objs.weight ** 0.75 * 28;

  console.log(objs);
  if (objs.owners.includes('Sarah')) {
    objs.curFood > objs.recommendedFood
      ? console.log("Sarah's dog eats too much")
      : console.log("Sarah's dog eats just fine");
  }

  if (objs.curFood < objs.recommendedFood * 0.9) {
    //dog eats too little
    ownersEatTooLittle.push(...objs.owners);
  } else if (objs.curFood > objs.recommendedFood * 1.1) {
    //dog eats too little
    ownersEatTooMuch.push(...objs.owners);
  } else {
    console.log(`${objs.owners}'s dog eats okay`);
    ownersEatOkay.push(objs);
  }
}
// console.log(ownersEatTooLittle);
// console.log(ownersEatTooMuch);

ownersEatTooMuch[ownersEatTooMuch.length - 1] =
  ownersEatTooMuch[ownersEatTooMuch.length - 1] + "'s dogs eat too much!";
let stringForMuch = ownersEatTooMuch.join(' and ');
console.log(stringForMuch);

let dogsCopy = dogs;
dogsCopy.sort(function (a, b) {
  if (a.recommendedFood > b.recommendedFood) return -1;
  if (a.recommendedFood < b.recommendedFood) return 1;
});

console.log(dogsCopy);
