const ERROR_EYE_COLOR = "#650000";
const ERROR_IRIS_COLOR = "#F00";
const DEFAULT_EYE_COLOR = "#f5f5dc";
const DEFAULT_IRIS_COLOR = "#E47C56";

let trackEyeMovement = true;

function getEyeCenter(side) {
    const eye = document.querySelector(`.eye${side}`);

    const boundingBox = eye.getBoundingClientRect();
    const centerX = boundingBox.right - boundingBox.width / 2;
    const centerY = boundingBox.bottom - boundingBox.height / 2;

    return {
        x: centerX,
        y: centerY
    };
}

function getMouseCoordinates(event) {
    return {
        x: event.clientX,
        y: event.clientY
    }
}

function getDelta(event, side) {
    const mouse = getMouseCoordinates(event);
    const center = getEyeCenter(side);

    return {
        x: mouse.x - center.x,
        y: mouse.y - center.y
    }
}

function getDirection(event, side) {
    const delta = getDelta(event, side);
    const length = Math.hypot(delta.x, delta.y);

    return {
        x: delta.x / length,
        y: delta.y / length
    }
}

function getSize(object) {
    const width = Number(object.getAttribute("width"));
    const height = Number(object.getAttribute("height"));

    return {
        width: width,
        height: height
    }
}

function getEyeSize() {
    const eye = document.querySelector(".eye");

    return getSize(eye);
}

function getIrisSize() {
    const iris = document.querySelector(".iris");

    return getSize(iris);
}

function getMaxIrisMovement() {
    const eyeSize = getEyeSize();
    const irisSize = getIrisSize();

    return {
        x: (eyeSize.width - irisSize.width) / 2,
        y: (eyeSize.height - irisSize.height) / 2
    }
}

function isMouseInside(event, side) 
{
    const mouse = getMouseCoordinates(event);
    const eye = document.querySelector(`.eye${side}`);
    const boundingBox = eye.getBoundingClientRect();

    return (mouse.x > boundingBox.left && mouse.x < boundingBox.right) && (mouse.y > boundingBox.top && mouse.y < boundingBox.bottom)
}

function getIrisDisplacement(event, side) 
{
    if (isMouseInside(event, side)) 
    {
        return{
            x: 0,
            y: 0
        }
    }

    const direction = getDirection(event, side);
    const move = getMaxIrisMovement();

    return {
        x: move.x * direction.x,
        y: move.y * direction.y
    }
}

function applyIrisTransform(side, dX = 0, dY = 0) 
{
    const irises = document.querySelectorAll(`.iris${side}`);
    irises.forEach(iris => iris.setAttribute("transform", `translate(${dX}, ${dY})`));
    
}

function moveEye(event, side) 
{
    const displacement = getIrisDisplacement(event, side);
    applyIrisTransform(side, displacement.x, displacement.y);
}

function moveEyes(event)
{
    moveEye(event, ".left");
    moveEye(event, ".right");
}

function resetEyePosition()
{
    applyIrisTransform(".left");
    applyIrisTransform(".right");
}

function followMouse(event) {
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

    // Change event process situations where user clicks away from the form
    form.addEventListener("change", updateEyeProperties);
    // Invalid event process situations where user presses enter to send form for validation
    // This event does not bubble up so it requires a capturing flag
    // for form to be able to catch invalidated fields
    form.addEventListener("invalid", updateEyeProperties, true);
}

document.addEventListener("mousemove", followMouse);
addFormListener();