
console.log("I love you");

const show = document.getElementById('show');
const button = document.getElementById('btn');
const input = document.getElementById('num');

const checkEvenOrOdd = (value) => {
  const num = Number(value);
  if (isNaN(num)) return 'Please enter a valid number';
  return num % 2 === 0 ? `${num} is Even` : `${num} is Odd`;
};

button.addEventListener("click", () => {
  const result = checkEvenOrOdd(input.value);
  show.textContent = result;
  const setout = setTimeout(() => {
    document.getElementById('num').value = "";
    clearTimeout(setout);
  }, 2000);
});



// function isEven(n){
//    return +n % 2 === 0? `${n} "is and even`:  `${n} is odd`
// }
// console.log(isEven(8));

let message = document.getElementById('message');

document.getElementById('regForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent full page reload

    const formData = {
        username: e.target.username.value,
        email: e.target.email.value,
        password: e.target.password.value        
    };

    try {
        const sendAndResponse = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await sendAndResponse.json();
        message.textContent =result;

    } catch (error) {
        message.textContent = 'An error occurred.';
        console.error(error);
    }
});
 



