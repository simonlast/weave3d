let threadSize;
let zoomSlider;

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    zoomSlider = select('#zoom-slider');
    zoomSlider.input(updateZoom);
    
    threadSize = int(zoomSlider.value());
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function updateZoom() {
    threadSize = int(zoomSlider.value());
}

function draw() {
    background(240);
    
    // Calculate how many threads fit on screen with some extra for seamless tiling
    let warpCount = ceil(width / threadSize) + 2;
    let weftCount = ceil(height / threadSize) + 2;
    
    // Draw the weave pattern
    stroke(0);
    strokeWeight(3);
    
    for (let row = 0; row < weftCount; row++) {
        for (let col = 0; col < warpCount; col++) {
            // Plain weave: alternating over/under pattern
            if ((row + col) % 2 === 0) {
                // Warp thread (vertical) goes over weft thread (horizontal)
                // Draw weft thread segments
                line(col * threadSize, row * threadSize + threadSize/2, 
                     col * threadSize + threadSize/3, row * threadSize + threadSize/2);
                line(col * threadSize + 2*threadSize/3, row * threadSize + threadSize/2, 
                     (col + 1) * threadSize, row * threadSize + threadSize/2);
                
                // Draw full warp thread
                line(col * threadSize + threadSize/2, row * threadSize, 
                     col * threadSize + threadSize/2, (row + 1) * threadSize);
            } else {
                // Weft thread (horizontal) goes over warp thread (vertical)
                // Draw warp thread segments
                line(col * threadSize + threadSize/2, row * threadSize, 
                     col * threadSize + threadSize/2, row * threadSize + threadSize/3);
                line(col * threadSize + threadSize/2, row * threadSize + 2*threadSize/3, 
                     col * threadSize + threadSize/2, (row + 1) * threadSize);
                
                // Draw full weft thread
                line(col * threadSize, row * threadSize + threadSize/2, 
                     (col + 1) * threadSize, row * threadSize + threadSize/2);
            }
        }
    }
}