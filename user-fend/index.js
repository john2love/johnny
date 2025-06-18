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

    
    async function FetchData (){
        return('How are you doing?');
    }
    console.log(FetchData())

    function IconShow(size = 46, color = 'black'){
        return(`<svg width='${size}' height='${size}' fill='${color}'>
            <use href="#icon"></use>
            </svg>`
            
        );
                  
    }

    document.getElementById('icon-container').innerHTML = IconShow( 30, 'red');

    function displayIcon(size=40, color='green'){
        return`<svg width='${size}' height='${size}' fill='${color}'>
                <use href = "#bar"></use>
            </svg>`
    }

    document.getElementById('bar-cont').innerHTML = displayIcon(20, 'blue');

    let handle = document.getElementById('clickin');
    handle.onclick = ()=>{
        globalThis.location = "form.html";
    }