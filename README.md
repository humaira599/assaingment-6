 

#### 7) Create a README file to answer the following question-


#### 1) What is the difference between var, let, and const?
Ans:var is function-scoped and can be re-decleared and re-asaigned,leading to potaitial hoisting issues.
let is block-scoped and can be re-asaigned while const is also block-scoped but cannot be re assaigned, ensuring constant reference.


#### 2) What is the difference between map(), forEach(), and filter()? 
Ans:forEach() iteretes through an array to execute a function for side effects and does not return a new araay.
map() executes a function on every elements and returns a new array containing the result.
filter() executes a condition and returns a new array containing only the elements that pass the test.


#### 3) What are arrow functions in ES6?
Ans:arrow functions(=>)provide a shorter syntax for writing function expression and making the code more concise.
they do not bind their own this value; instead they lexically inherit this grom the surrounding scope.


#### 4) How does destructuring assignment work in ES6?
Ans:destructuring is syntax that allows you to unpack values from arrays or properties from objects into distinct, local variables.
it simplifiles extracting data and accessing multiple object properties in a single, readable atatment.


#### 5) Explain template literals in ES6. How are they different from string concatenation?
Ans: template literals use backticks (``)and allow for variable interpolation using the ${}syntax.
they are better than string concatenation(+operator)becouse they natively support multi-line strings and make variable injection cleaner.
