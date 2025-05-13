//for the javascript lesson
let userSatus = document.getElementById('userSatus');
let info = document.getElementById('info');
let btn = document.getElementById('click');

// Hide the button initially
btn.style.display = "none";

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


// Also run it once on page load


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
                        },3000)
                });
                