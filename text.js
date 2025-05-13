//for the javascript lesson
let userSatus = document.getElementById('userSatus');
let info = document.getElementById('info');
let btn = document.getElementById('click');

// Hide the button initially
btn.style.display = "none";

// Show the button if input has content
function ShowButton(){
    if(userSatus.value.trim()){
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}

// Trigger ShowButton when typing in the input
userSatus.addEventListener('input', ShowButton);

// Also run it once on page load
ShowButton();

btn.addEventListener('click', (e) => { 
    e.preventDefault();

    let statusValue = userSatus.value.trim(); // avoid overwriting the DOM element

    let message;

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
    ShowButton(); // hide button again after clearing input
});
