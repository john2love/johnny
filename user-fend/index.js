  function IconShow(size = 46) {
    const iconStar = `<svg width='${size}' height='${size}'> <use href="#star"></use></svg>`;
    const barIcon = `<svg width='${size}' height='${size}'><use href="#bar"></use></svg>`;
    const htmlIcon = `<svg width='${size}' height='${size}'><use href="#html"></use></svg>`;
    
    // Render into the ID container
    // const iconContainer = document.getElementById('icon-container');
    // iconContainer.innerHTML += iconStar;

    // Render into all class-based containers
    const iconSlots = document.querySelectorAll('.icon-slot');
    iconSlots.forEach(slot => {
        slot.innerHTML += htmlIcon;

        // slot.style.transition = 'transform 0.2s ease'; // smooth animation

        // slot.addEventListener('mouseenter', () => {
        //     slot.style.transform = 'scale(1.2)';
        // });

        // slot.addEventListener('mouseleave', () => {
        //     slot.style.transform = 'scale(1)';
        // });
    });
}
IconShow(30,);

// google reviewauthor name, rating, and text and store them in a variable "mockReview"
// creat an array of objects each with  
const mockReviews = [
  {
    author: "Jane Doe",
    rating: 5,
    text: "Absolutely amazing! The staff was friendly and helpful.",
  },
  {
    author: "destiny4ife@gmail.com",
    rating: 4,
    text: "Great experience, would recommend to others.",
  },
  {
    author: "Emily Johnson",
    rating: 3,
    text: "Decent service, but room for improvement.",
  },
  {
    author: "john4ever",
    rating: 5,
    text: "Absolutely amazing! The staff was friendly and helpful.",
  },
  {
    author: "mary1234@gmail.com",
    rating: 4,
    text: "Great experience, would recommend to others.",
  },
  {
    author: "andrew",
    rating: 3,
    text: "Decent service, but room for improvement.",
  },
];
 



//DOM ACCESSMENT IN J.S

// 1. To select an element from html file into a a j.s environment you use a built-in method taht is particular to 

// document object, these are a. getElementById()this is strictly for element with id. b. querySelector()this select element with either id or class, 

// but with a specification of the selector(."dot" for class and # for id ) e.g, document.getElementById("iterm"); if iterm is an id or document.querySelector('.iterm') 

// you can store the selected element in a variable as const list = document.querySelector('.iterm') .

// NODELIST: This is a list or group of html elements selected from html file by a document's method called
// querySelector() or getElementById() into a j.s environment.

// so the line "const list = document.querySelectorAll('.iterm');" Select all .iterm elements for html file and store it in a nodelist( list)

// 2. A METHOD: This is a function which is specific to an object, e.g, log is specific to console object
//(console.log()) etc, so in the code block below, the forEach method is is a built-in method particular to the object "list"

// there is an arrow function inside the method it has two parameters, element and i, both the function and method work together so that when the forEach method go through (looping)
// the nodelist list one after another it gives out the two parameters, element(review block) and it's index number (i) if you look we console the element and index in the below.
// in the browser sonsole the result will be iterm: iphon, index: 0, iterm: tv, index: 1, iterm: charger, index: 2,
const list = document.querySelectorAll('.iterm');
  list.forEach((element, i)=>{
    console.log(list);
    console.log("Iterm:", element.textContent);
    console.log("index:", i);

})
// THE MAIN PROJECT, ABOVE IS A CLUE TO WHAT IS HAPENIN IN THIS MAIN CODE.
const reviewElements = document.querySelectorAll(".review"); //  THE SAME THING THAT HAPENS ABOUT BUT IN THIS CASE THE DOCUMENT METHOD(queryselector()) 
// IS SELECTING ALLL THE PARENT DIV WITH REVIEW AS CLASS NAME, // AND STORING THEM IN A NODELIST CALLED reviewElements. 
// WE GAVE ALL THE REVIEW IN NODELIST  A NAME 'el',NOW TO ACCESS EACH REVIEW CHILDREN WE FIRST ACCESS THE REVIEW FORM NODELIST AS el THEN ACCESSING THE CHILDREM FROM HTML FILE AS BELOW. 
// THIS IS WHAT I MEAN; const authorEl = el.querySelector(".review-author");

reviewElements.forEach((el, i) => {
  const data = mockReviews[i]; // DATA IS THE ARRAY OF MATCHING OBJECTS , EACH OF THESE OBJECTS HAS PROPS THAT MATCHES THE EACH OF THE CHILDREN OF 'el' FROM NODELIST
  // TO SEE THE ARRAY IN THE CONSOLE DO // console.log("data:", data);

  if (!data) return; // skip if more HTML blocks than mock reviews

  const authorEl = el.querySelector(".review-author");
  const ratingEl = el.querySelector(".review-rating");
  const textEl = el.querySelector(".review-text");

  console.log("Author:", authorEl.textContent); //  TEST: write anything in any of the auther div in html file it will display in the console, that is to 
  // show this element is actualy selected. so as the rest of the divs
  console.log("index:", i);
  


  // Populate content, NOTE: THE ARRAY INDEX IS AT THE SAME LEVEL WITH "el" INDEX SUCH THAT EACH OF THE object PROP IS SET AS THE TEXTCONTENT OF THE MATCHING "el" children
  //see the props:{
   // author: "Emily Johnson", the authorEl will have it's textcontent set to be "Emily Johnson", like whise to other props
   // rating: 3,
   // text: "Decent service, but room for improvement.",
  //},
  authorEl.textContent = data.author; //
  ratingEl.textContent = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);
  textEl.textContent = data.text;
});



// Jave script statements
    // 1. if statement: this execute a block of code if a condition is met
    let score = 50;
    if(score <= 40 ){console.log('We dont need you');}

    // 2. if else statement this execute a block of code if a condition is met, otherwise execute another block
    if(score < 49 ){
        console.log('you tried but you did not meet up the pass mark');
    }
    else {console.log('Is either a Good or excellence result');}

// if elsle if else statement: this check multiple conditions, skips to the next condition if the 
// current one is fals, and stops after executing the first true condition, ones the first true condition is met
// if none of the condition is true j.s executes else block if present
// NOTE: the purpose of this statement is to find out the desired option out of many options
if(score < 49 ){
        console.log('you tried but you did not meet up the pass mark');
    }

    else if(score > 40){console.log('congratulations, you have qualified!');}

    else if(score > 60){console.log('congratulations, you have over qualified!');}
 
    else {console.log('Is either a Good or excellence resuld');}
    // in the above conditions the j.s will skip the first one because it's not true, when it 
    // gets to the second one, it will execute it and stop because it is true, but in a case where 
    // the last is else is true, it will skip the second condition to execute the last one, also if 
    // none of the else if inclution of the only if statements is true, it will skip all to the else statement.

  
    
  

