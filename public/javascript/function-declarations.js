const square = (function (num) {
  return num * num;
})(function mult(num) {
  return num * 2;
})(5);
console.log(square(5));
