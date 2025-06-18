const show = document.getElementById('show');
const button = document.getElementById('btn');
const input = document.getElementById('num');

let setout;
const checkEvenOrOdd = (value) => {
  const num = Number(value);
  if (isNaN(num)) return 'Please enter a valid number';
  return num % 2 === 0 ? `${num} is Even` : `${num} is Odd`;
};

button.addEventListener("click", () => {
  const result = checkEvenOrOdd(input.value);
  show.textContent = result;
  
  if(setout){
    clearTimeout(setout);
    
  }
  setout = setTimeout(() => {
    document.getElementById('num').value = "";
  }, 2000);
});
