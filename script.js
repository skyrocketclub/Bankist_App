'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2022-09-17T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

  const daysPassed = Math.round(calcDaysPassed(new Date(), date));
  console.log(daysPassed);
  if (daysPassed === 1) return 'Yesterday';

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // const displayDate = `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const now = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(now, currentAccount.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCur(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${`${formatCur(
    incomes,
    acc.locale,
    acc.currency
  )}`}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatCur(out, acc.locale, acc.currency)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${`${formatCur(
    interest,
    acc.locale,
    acc.currency
  )}`}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  //Set time to 5 minutes
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${seconds}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 30;
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};
///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// const now = new Date();
// labelDate.textContent = now;

// const now = new Date();
// const day = `${now.getDate()}`.padStart(2, 0);
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const year = now.getFullYear();
// const hour = now.getHours();
// const min = now.getMinutes();
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    const locale = currentAccount.locale;
    console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.round(Number(inputLoanAmount.value));

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      // receiverAcc.movementsDates.push(new Date());

      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// console.log(arr.slice(2));
// console.log(arr.slice(2, 4)); //the end parameter is not included in the slice...
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.splice(2));
// console.log(arr);

// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// console.log(letters.join('-'));

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log('jonas'.at(0));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// //It loops over the array and it iteration, it calls the call back function, passing the current iteration as arguments for the function execution...
// console.log('-----------FOR EACH---------------');
// movements.forEach(function (mov, i, array) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key} : ${value}`);
// });

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function (value, _key, map) {
//   console.log(`${_key} : ${value}`);
// });

// const eurToUsd = 1.1;

// //returns a brand new array
// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

// const movementsUSD = movements.map(mov => {
//   return mov * eurToUsd;
// });

// console.log(movementsUSD);
// console.log(movements);

// const movementsUSDfor = [];

// for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
// console.log(movementsUSDfor);

// const movementDescriptions = movements.map(function (mov, i, arr) {
//   return `Movement ${
//     i + 1
//   } You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`;
// });

// console.log(movementDescriptions);

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);

// console.log(depositsFor);

// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(withdrawals);

// const balance = movements.reduce(function (acc, cur, i) {
//   return acc + cur;
// }, 100);

// console.log(balance);

// //Maximum value of the movements array
// const maxNumber = movements.reduce(function (acc, cur, i, arr) {
//   if (cur > acc) acc = cur;
//   return acc;
// }, movements[0]);

// console.log(movements);
// console.log(maxNumber);

// const eurToUSD = 1.1;
// const totalDepositUSD = movements
//   .filter(function (mov) {
//     return mov > 0;
//   })
//   .map(function (mov) {
//     return mov * eurToUSD;
//   })
//   .reduce(function (acc, mov) {
//     return acc + mov;
//   }, 0);

// console.log(totalDepositUSD);

//When we wish to find an element that satisfies the condition that we already know...
// const account = accounts.find(function (acc) {
//   return acc.owner === 'Jessica Davis';
// });

// console.log(account);
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements);
// console.log(movements.includes(-130));

// //we specify a condition
// const anyDeposits = movements.every(function (cur) {
//   return cur > -650;
// });

// console.log(anyDeposits);

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const accountMovements = accounts.map(function (curr) {
//   return curr.movements;
// });
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance = allMovements.reduce(function (acc, curr) {
//   return acc + curr;
// }, 0);
// console.log(overallBalance);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];

// console.log(movements);

// movements.sort(function (a, b) {
//   if (a > b) return -1;
//   if (b > a) return 1;
// });

// console.log(movements);

// const x = new Array(7);
// console.log(x);

// x.fill(1, 3, 5);
// console.log(x);

// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, function (curr, i) {
//   return i + 1;
// });
// console.log(z);

// const random = Array.from({ length: 100 }, function () {
//   return Math.trunc(Math.random() * 100) + 1;
// });
// console.log(random);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value')
//   );
//   console.log(movementsUI);
// });
console.log(accounts);

//count the total sum of all the deposits
let positives = 0;
const bankDeposits = accounts.forEach(function (acc) {
  let prospects = acc.movements.filter(function (curr) {
    return curr > 0;
  });
  let sum = prospects.reduce(function (acc, curr) {
    return acc + curr;
  }, 0);
  positives += sum;
});

console.log(positives);

//count how many deposits there have been with at least 1000$
let numberRequired = 0;
const meetTheMark = accounts.forEach(function (current) {
  current.movements.forEach(function (mov) {
    if (mov >= 1000) {
      numberRequired += 1;
    }
  });
});

// meetTheMark();
console.log(numberRequired);

//create a new object which creates  sum of the deposits and of the withdrawals
const sums = accounts
  .flatMap(function (curr) {
    return curr.movements;
  })
  .reduce(
    function (sums, curr) {
      if (curr > 0) {
        sums.deposit += curr;
        return sums;
      } else {
        sums.withdrawal += curr;
        return sums;
      }
    },
    { deposit: 0, withdrawal: 0 }
  );

console.log(sums.deposit, sums.withdrawal);

//convert any string to a title case...

const convertTitleCase = function (title) {
  let array = title.split(' ');
  console.log(array);
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'in', 'with'];

  let convertedArray = array.map(function (cur) {
    if (exceptions.includes(cur)) {
      let newWord = '';
      for (let letters of cur) {
        newWord += letters.toLowerCase();
      }
      return newWord;
    } else {
      let newWord = '';
      for (let letters of cur) {
        newWord += letters.toLowerCase();
      }
      newWord = newWord.replace(newWord[0], newWord[0].toUpperCase());
      return newWord;
    }
  });

  let word = convertedArray.join(' ');
  return word;
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// console.log();
// const randomInt = function (min, max) {
//   return Math.trunc(Math.random() * (max - min) + 1) + min;
// };

// console.log(randomInt(10, 20));

// console.log(Math.round(23.3));
// console.log(Math.ceil(23.9));

// const isEven = function (num) {
//   return num % 2 === 0 ? true : false;
// };

// console.log(isEven(56));

// const diameter = 287_460_000_000;
// console.log(diameter);

// const transferFee = 1_500;
// console.log(Number('230000'));

// console.log(Number.MAX_SAFE_INTEGER);
// console.log(
//   2498741649494916494984169741494649841849984941594159861649744916494n
// );
// console.log(BigInt(55555555555555555555555555555555555555555555555555) + 3n);
// console.log(485487n + 888888888888888888888888888n);

//Create a date

// const now = new Date();
// console.log(now);

// console.log(new Date('Sep 18 2020 11:27:40'));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 19, 15, 23, 5));
// console.log(new Date(2037, 10, 33, 15, 23, 5));

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getTime());
// console.log(new Date(2142253380000));

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
// const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
// console.log(days1);

// const num = 3884764.23;
// const options = {
//   style: 'currency',
//   unit: 'mile-per-hour',
//   currency: 'EUR',
//   useGrouping: true,
// };
// console.log(new Intl.NumberFormat('en-GB', options).format(num));

//setTimeout
// const ingredients = ['olives', 'tomatoes'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza 🍕 with ${ing1} and ${ing2}`),
//   3000,
//   ...ingredients
// );
// console.log('Waiting...');
// if (ingredients.includes('spinach')) {
//   clearTimeout(pizzaTimer);
// }

// //setTimeInterval
// setInterval(function () {
//   const now = new Date();
//   const hour = `${now.getHours()}`.padStart(2, 0);
//   const minutes = `${now.getMinutes()}`.padStart(2, 0);
//   const seconds = `${now.getSeconds()}`.padStart(2, 0);
//   console.log(`${hour}:${minutes}:${seconds}`);
// }, 1000);
