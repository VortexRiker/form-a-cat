function validatePasswords()
{
    const password = document.getElementById("#password");
    const confirmation = document.getElementById("#password-confirm");

    if(password.value != confirmation.value)
    {
        confirmation.setCustomValidity("Passwords do not match");
        confirmation.reportValidity();
    }
}

const confirmation = document.getElementById("#password-confirm");
confirmation.addEventListener("change", validatePasswords);
