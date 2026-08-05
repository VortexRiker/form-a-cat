function isValid(password, confirmation)
{
    return (password.value !== confirmation.value) || !password.validity.valid;
}

function validatePasswords()
{
    const password = document.getElementById("password");
    const confirmation = document.getElementById("password-confirm");

    if(isValid(password, confirmation))
    {
       confirmation.setCustomValidity("Passwords do not match");
    }
    else
    {
        confirmation.setCustomValidity("");
    }
}

function addPasswordListener()
{
    const password = document.getElementById("password");
    password.addEventListener("change", validatePasswords);
}

function addConfirmationListener()
{
    const confirmation = document.getElementById("password-confirm");
    confirmation.addEventListener("change", validatePasswords);
}

function addValidationListeners()
{
   addPasswordListener();
   addConfirmationListener(); 
}

addValidationListeners();



