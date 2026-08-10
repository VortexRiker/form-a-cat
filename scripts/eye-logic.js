const ERROR_EYE_COLOR = "#650000";
const ERROR_IRIS_COLOR = "#F00";
const DEFAULT_EYE_COLOR = "#f5f5dc";
const DEFAULT_IRIS_COLOR = "#E47C56";

let trackEyeMovement = true;

function getEyeCenter(side, logoClass) 
{
    const eye = document.querySelector(`${logoClass} .eye${side}`);

    const boundingBox = eye.getBoundingClientRect();
    const centerX = boundingBox.right - boundingBox.width / 2;
    const centerY = boundingBox.bottom - boundingBox.height / 2;

    return {
        x: centerX,
        y: centerY
    };
}

function getMouseCoordinates(event) 
{
    return {
        x: event.clientX,
        y: event.clientY
    }
}

function getDelta(event, side, logoClass) 
{
    const mouse = getMouseCoordinates(event);
    const center = getEyeCenter(side, logoClass);

    return {
        x: mouse.x - center.x,
        y: mouse.y - center.y
    }
}

function getDirection(event, side, logoClass) 
{
    const delta = getDelta(event, side, logoClass);
    const length = Math.hypot(delta.x, delta.y);

    return {
        x: delta.x / length,
        y: delta.y / length
    }
}

function getSize(object) 
{
    const width = Number(object.getAttribute("width"));
    const height = Number(object.getAttribute("height"));

    return {
        width: width,
        height: height
    }
}

function getEyeSize() 
{
    const eye = document.querySelector(".eye");

    return getSize(eye);
}

function getIrisSize() 
{
    const iris = document.querySelector(".iris");

    return getSize(iris);
}

function getMaxIrisMovement() 
{
    const eyeSize = getEyeSize();
    const irisSize = getIrisSize();

    return {
        x: (eyeSize.width - irisSize.width) / 2,
        y: (eyeSize.height - irisSize.height) / 2
    }
}

function isMouseInside(event, side, logoClass) 
{
    const mouse = getMouseCoordinates(event);
    const eye = document.querySelector(`${logoClass} .eye${side}`);
    const boundingBox = eye.getBoundingClientRect();

    return (mouse.x > boundingBox.left && mouse.x < boundingBox.right) && (mouse.y > boundingBox.top && mouse.y < boundingBox.bottom)
}

function getIrisDisplacement(event, side, logoClass) 
{
    if (isMouseInside(event, side, logoClass)) 
    {
        return {
            x: 0,
            y: 0
        }
    }

    const direction = getDirection(event, side, logoClass);
    const move = getMaxIrisMovement();

    return {
        x: move.x * direction.x,
        y: move.y * direction.y
    }
}

function applyIrisTransform(side, logoClass, dX = 0, dY = 0) 
{
    const iris = document.querySelector(`${logoClass} .iris${side}`);
    iris.setAttribute("transform", `translate(${dX}, ${dY})`);
}

function moveEye(event, side, logoClass) 
{
    const displacement = getIrisDisplacement(event, side, logoClass);
    applyIrisTransform(side, logoClass, displacement.x, displacement.y);
}

function isMainLogoVisible()
{
    const leftPanel = document.querySelector(".left-side");

    return leftPanel.checkVisibility();
}

function getActiveLogoClass()
{
    let activePanel = ".left-side"
    if  (!isMainLogoVisible())
    {
        activePanel = ".right-side";
    }

    return activePanel
}

function moveEyes(event)
{
    
    const logoClass = getActiveLogoClass();

    moveEye(event, ".left", logoClass);
    moveEye(event, ".right", logoClass);
}

function resetEyePosition()
{
    const logoClass = getActiveLogoClass();

    applyIrisTransform(".left", logoClass);
    applyIrisTransform(".right", logoClass);
}

function followMouse(event) 
{
    if (trackEyeMovement) 
    {
        moveEyes(event);
    }
}

function changeEyeColor(eyeColor = DEFAULT_EYE_COLOR, irisColor = DEFAULT_IRIS_COLOR) 
{
    const eyes = document.querySelectorAll(".eye");
    eyes.forEach(eye => eye.setAttribute("fill", eyeColor));

    const irises = document.querySelectorAll(".iris");
    irises.forEach(iris => iris.setAttribute("fill", irisColor));
}

function hasInvalidFormFields()
{
    const form = document.getElementById("sign-up-form");

    return form.querySelectorAll(":user-invalid").length;
}

function updateEyeProperties()
{
    if (hasInvalidFormFields()) 
    {
        changeEyeColor(ERROR_EYE_COLOR, ERROR_IRIS_COLOR);
        resetEyePosition();
        trackEyeMovement = false;
    }
    else 
    {
        changeEyeColor();
        trackEyeMovement = true;
    }
}

function addFormListener() {
    const form = document.getElementById("sign-up-form");

    // Two listeners are required to fire the logic consistently

    // "change" event process situations where user clicks away from the form
    form.addEventListener("change", updateEyeProperties);
    // "invalid" event process situations where user presses enter to send form for validation
    // This event does not bubble up so it requires a capturing flag
    // for form to be able to catch invalidated fields
    form.addEventListener("invalid", updateEyeProperties, true);
}

document.addEventListener("mousemove", followMouse);
addFormListener();