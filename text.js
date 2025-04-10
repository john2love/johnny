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

    // SWITCH STATEMENT: This used to validate different possible fixed(check if the case value matches) options using a single referential value passed as an expression
    // so by this, different blocks of codes are executed based on the matched cases.
    // REAL WORLD CODE EXAMPLE: USER ROLE BASED ACCESS

    let userSatus = document.getElementById('userSatus');
    let info = document.getElementById('info');
    let btn = document.getElementById('click');

    function ShowButton(){
        if(userSatus.value){
            btn.style.display = "block";
        }
        else{btn.style.display = "none"}
    }
    userSatus.addEventListener('input', ShowButton );
    

    btn.addEventListener('click', (e)=>{ 
        e.preventDefault();
        let userSatus = document.getElementById('userSatus').value.trim();

        let message;// this is empty message variable to hold info associated with case value
        
        // the trim method accessed to the espression is to take input value and remove spaces
        switch(userSatus){
            case 'Admin':
            message = 'Access granted! you can manage users and settings.';
                break
            case 'Staff':
            message = 'Access granted, you can edit content';
                break
            case 'Parent':
            message = 'Access granted, you can view content';
                break
            default:
            message = 'Access denied!';
        }
        info.innerHTML = message; // display the initialised message in the span element with info id
        // you know the message was declares above and assigned to empty value
        userSatus.value = "";//reset input field to empty.
    });