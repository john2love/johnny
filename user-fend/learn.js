
let global = " I am accessible by anyone";
function hum(){
    let attention = "Hey";
    global = "I am only accissible by the function holding me";//this over shadow the global variable name global
    console.log(attention, global);

}
console.log(global);
hum();

let land = "small";
function myLand (){
    land = " Very big. "; //land variable accessed because it is global
    let combine = ` I want ${land} land, `;
    console.log(combine)
}

console.log(land);// this log the global variable(land) to the console, 
// it will show first because it is called before the function(called outside the function)
myLand(); // this call the function to action,log the conbine variable to the console.

console.log(land);// called after the function (called inside the function). 
// it log the local version of the land variable

// PARAMETERS OF A FUNCTION: This is a variable assign to a function 
// while declaring that function. It can be given a defaut value.
// it is reuseable.e.g
 
function sum(e, y){
    console.log(e + y);
}
sum(6, 6);//arguments(the actual values that is been copied into the variables)

// you can choose to give a default value to your parameter

function perfectSqure(e = 9){
    console.log(`${e} is a perfect square?`);
}
perfectSqure();//default value of e is loged here
perfectSqure(8);// the default value of e is bypassed and input value is loged, reuseable

//RETURN STATEMENT, :it is used to a. return value from evaluation, b. also ussed to stop the 
// function from execution, so mind were you place it in your function body, where there is 
// no value to return, it only go with the the constant funtion of stopping the function.

function cal(c = 9, g = 6){
    return(c - g);
}
let result = cal(20);// the second parameter above is 
// not given an argument(actual value) so the default value steps in
console.log(result);
// you can console.log(); the two default values will 
// step in, but is resusable to for it to yake and input
//like console.log(9, 5)
//IF A FUNCTION DOES NOT RETURN A VALUE IT MEANS IT RETURN UNDEFINED
function doNothing() { return; }

console.log( doNothing() === undefined ); 

function checkAge(age){
    return age > 18 ? true : "did your parent know about this?";
}
console.log(checkAge(9));