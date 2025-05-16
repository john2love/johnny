//for the javascript lesson
let userSatus = document.getElementById('userSatus');
let info = document.getElementById('info');
let btn = document.getElementById('click');



// Show the button if input has content
userSatus.addEventListener('input', () => {
    if (userSatus.value.trim()) {
        btn.style.display = 'block';
        btn.style.backgroundColor = 'green';
        btn.style.color = 'white';
        
    } 
    else {
        btn.style.display = 'none';
    }
});

// SWITCH STATEMENT: This used to validate different possible fixed(check if the 
// case value matches) options using a single referential value passed as an expression
    // so by this, different blocks of codes are executed based on the matched cases.
    // REAL WORLD CODE EXAMPLE: USER ROLE BASED ACCESS
    
btn.addEventListener('click', (e) => { 
    e.preventDefault();
    let statusValue = userSatus.value.trim(); // avoid overwriting the DOM element
    
    let message;
    let setout;
    
    switch(statusValue){
        case 'Admin':
            message = 'Access granted! You can manage users and settings.';
            break;
            case 'Staff':
                message = 'Access granted, you can edit content.';
                break;
                case 'Parent':
                    message = 'Access granted, you can view content.';
                    break;
                    default:
                        message = 'Access denied!';
                    }
                    
                    info.textContent = message;
          
                    userSatus.value = "";
                    
                   
                    if(setout){
                        clearTimeout(setout);
                    }
                    // Hide the button after 3second of click
                    setout = setTimeout(()=>{
                            btn.style.display = 'none';
                        },1000)
                });
                