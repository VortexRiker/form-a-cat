function validatePasswords()
{
    const password = document.getElementById("password");
    const confirmation = document.getElementById("password-confirm");

    if((password.value !== confirmation.value) || !password.validity.valid)
    {
       confirmation.setCustomValidity("Passwords do not match");
    }
    else
    {
        confirmation.setCustomValidity("");
    }
}

const password = document.getElementById("password");
password.addEventListener("change", validatePasswords);
const confirmation = document.getElementById("password-confirm");
confirmation.addEventListener("change", validatePasswords);
