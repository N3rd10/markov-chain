javascript

Verify

Open In Editor
Run
Copy code
// Import Matter.js
const { Engine, Render, World, Bodies, Mouse, MouseConstraint, Body } = Matter;

// Create an engine
const engine = Engine.create();
const world = engine.world;

// Create a renderer
const canvas = document.getElementById('simulationCanvas');
const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

// Add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});
World.add(world, mouseConstraint);

// Add ground
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 10, window.innerWidth, 20, { isStatic: true });
World.add(world, ground);

// Function to create a new circle
function createCircle(x, y) {
    const circle = Bodies.circle(x, y, 20, { render: { fillStyle: '#ffffff' } });
    World.add(world, circle);
}

// Function to create a new rectangle
function createRectangle(x, y) {
    const rectangle = Bodies.rectangle(x, y, 40, 20, { render: { fillStyle: '#ffffff' } });
    World.add(world, rectangle);
}

// Function to clear all bodies
function clearAll() {
    World.clear(world);
    World.add(world, ground); // Re-add the ground
}

// Function to enable moving shapes
let isMoving = false;

function enableMove() {
    isMoving = true;
    canvas.style.cursor = 'move'; // Change cursor to indicate moving mode
}

function disableMove() {
    isMoving = false;
    canvas.style.cursor = 'default'; // Reset cursor
}

// Event listeners for menu buttons
document.getElementById('addCircle').addEventListener('click', () => {
    canvas.addEventListener('click', (event) => {
        createCircle(event.clientX, event.clientY);
    }, { once: true }); // Only add one circle per click
});

document.getElementById('addRectangle').addEventListener('click', () => {
    canvas.addEventListener('click', (event) => {
        createRectangle(event.clientX, event.clientY);
    }, { once: true }); // Only add one rectangle per click
});

document.getElementById('move').addEventListener('click', () => {
    if (isMoving) {
        disableMove();
    } else {
        enableMove();
    }
});

document.getElementById('clear').addEventListener('click', clearAll);

// Mouse event listeners for moving shapes
canvas.addEventListener('mousedown', (event) => {
    if (isMoving) {
        const mousePosition = { x: event.clientX, y: event.clientY };
        const bodies = Matter.Composite.allBodies(world);
        const clickedBody = bodies.find(body => Matter.Bounds.contains(body.bounds, mousePosition));

        if (clickedBody) {
            // Start dragging the body
            Body.setStatic(clickedBody, false); // Make it non-static
            Matter.Body.setPosition(clickedBody, mousePosition);
            canvas.addEventListener('mousemove', onMouseMove);
            canvas.addEventListener('mouseup', onMouseUp);
        }
    }
});

// Right-click event to open the properties popup
canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // Prevent the default context menu
    const mousePosition = { x: event.clientX, y: event.clientY };
    const bodies = Matter.Composite.allBodies(world);
    const clickedBody = bodies.find(body => Matter.Bounds.contains(body.bounds, mousePosition));

    if (clickedBody) {
        // Show the properties popup
        document.getElementById('propertyPopup').style.display = 'block';
        document.getElementById('propertyPopup').style.left = `${event.clientX}px`;
        document.getElementById('propertyPopup').style.top = `${event.clientY}px`;

        // Set initial values in the popup
        document.getElementById('color').value = clickedBody.render.fillStyle;
        document.getElementById('size').value = clickedBody.circleRadius || 20; // Default size for circles
    }
});

// Update properties when the user clicks the update button
document.getElementById('updateProperties').addEventListener('click', () => {
    const color = document.getElementById('color').value;
    const size = parseInt(document.getElementById('size').value, 10);
    const bodies = Matter.Composite.allBodies(world);
    const clickedBody = bodies.find(body => body.render.fillStyle === color); // Find the body by color

    if (clickedBody) {
        // Update the body properties
        clickedBody.render.fillStyle = color;
        if (clickedBody.circleRadius) {
            // If it's a circle, update the radius
            Body.scale(clickedBody, size / clickedBody.circleRadius, size / clickedBody.circleRadius);
        } else {
            // If it's a rectangle, update the size
            Body.scale(clickedBody, size / 40, size / 20); // Assuming default rectangle size is 40x20
        }
    }

    // Close the popup
    document.getElementById('propertyPopup').style.display = 'none';
});

// Close the popup when the close button is clicked
document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('propertyPopup').style.display = 'none';
});

// Mouse event listeners for moving shapes
function onMouseMove(event) {
    if (isMoving) {
        const mousePosition = { x: event.clientX, y: event.clientY };
        const bodies = Matter.Composite.allBodies(world);
        const clickedBody = bodies.find(body => Matter.Bounds.contains(body.bounds, mousePosition));

        if (clickedBody) {
            Matter.Body.setPosition(clickedBody, mousePosition);
        }
    }
}

function onMouseUp() {
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
}

// Run the engine and renderer
Engine.run(engine);
Render.run(render);
