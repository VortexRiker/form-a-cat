function getEyeCenter(side)
{
    const eye = document.querySelector(`.eye${side}`);

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

function getDelta(event, side)
{
    const mouse = getMouseCoordinates(event);
    const center = getEyeCenter(side);

    return {
        x: mouse.x - center.x,
        y: mouse.y - center.y
    }
}

function getDirection(event, side)
{
    const delta = getDelta(event, side);
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

function isMouseInside(event, side)
{
    const mouse = getMouseCoordinates(event);
    const eye = document.querySelector(`.eye${side}`);
    const boundingBox = eye.getBoundingClientRect();

    return (mouse.x > boundingBox.left && mouse.x < boundingBox.right) && (mouse.y > boundingBox.top && mouse.y < boundingBox.bottom)
}

function getIrisDisplacement(event, side)
{
    if(isMouseInside(event, side))
    {
        return {
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

function applyTransform(displacement, side)
{
    const iris = document.querySelector(`.iris${side}`);
    iris.setAttribute("transform", `translate(${displacement.x}, ${displacement.y})`);
}

function moveEye(event, side)
{
    const displacement = getIrisDisplacement(event, side);
    applyTransform(displacement, side);
}

function moveLeftEye(event)
{
    const left = ".left";
    moveEye(event, left);
}

function moveRightEye(event)
{
    const right = ".right";
    moveEye(event, right);
}

function followMouse(event)
{
   moveLeftEye(event);
   moveRightEye(event);
}

document.addEventListener("mousemove", followMouse);