'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  //sort is an optional parameter tha checks if sorted is so or not
  const movs = sort
    ? movements.slice().sort(function (a, b) {
        if (a > b) return 1;
        if (a < b) return -1;
      })
    : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// const user = 'Steven Thomas Williams';
// const username = user
//   .toLowerCase()
//   .split(' ')
//   .map(function (name) {
//     return name[0];
//   })
//   .join('');

const calcPrintBalance = function (account) {
  //We are modifying the variable pointing to the account in the heap
  account.balance = account.movements.reduce(function (acc, cur, i, arr) {
    return acc + cur;
  }, 0);
  labelBalance.textContent = `${account.balance} EUR`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(function (curr, i) {
      return curr > 0;
    })
    .reduce(function (acc, cur) {
      return acc + cur;
    }, 0);
  labelSumIn.textContent = `${incomes}€`;

  const expenses = account.movements
    .filter(function (cur) {
      return cur < 0;
    })
    .reduce(function (acc, cur) {
      return acc + cur;
    }, 0);
  labelSumOut.textContent = `${Math.abs(expenses)}€`;

  const interest = account.movements
    .filter(function (cur, i) {
      return cur > 0;
    })
    .map(function (cur, i) {
      return (cur * account.interestRate) / 100;
    })
    .filter(function (cur) {
      return cur > 1;
    })
    .reduce(function (acc, cur) {
      return acc + cur;
    }, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner //here we are defining a new element of the afore mentioned object
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};
createUserNames(accounts);

//Event handler
let currentAccount;

const updateUI = function (currentAccount) {
  //Display movements
  displayMovements(currentAccount.movements);
  //Display balance
  calcPrintBalance(currentAccount);
  //Display summary
  calcDisplaySummary(currentAccount);
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('LOGIN');

  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currentAccount);

  //If the account entered exists and the password is correct
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('LOGIN');

    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    console.log('Transfer Valid');
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  //if there is a deposit that is at least 10 % greater than the loan requested
  if (
    amount > 0 &&
    currentAccount.movements.some(function (cur) {
      return cur >= 0.1 * amount;
    })
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
  console.log('Loan granted');
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('Delete');
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });
    console.log(index);
    //delete account
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';

    console.log(accounts);
  }
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

const x = new Array(7);
console.log(x);

x.fill(1, 3, 5);
console.log(x);

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, function (curr, i) {
  return i + 1;
});
console.log(z);

const random = Array.from({ length: 100 }, function () {
  return Math.trunc(Math.random() * 100) + 1;
});
console.log(random);
