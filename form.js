
console.log("I love you");

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






document.getElementById('regForm').addEventListener('submit', async function(e) {
  e.preventDefault(); // Prevent full page reload
  let message = document.getElementById('message');

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
 



