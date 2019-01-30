// Global grid size (in pixels)
grid_size = 20;

// Global origin point.
origin = undefined;

// Global scale factor
alpha = 1.

// X base vector
i_hat = undefined;

// Y base vector
j_hat = undefined;

/**
 * Runs only once, when the page loads.
 */
function setup() {
    let margin = 10;
    cnv = createCanvas(window.innerWidth-margin, window.innerHeight-margin);
    cnv.parent('canvas-container')

    origin = createVector(0, cnv.height / 2);

    j_hat = createVector(1, 1);
    i_hat = createVector(1, -1);
}

/**
 * Runs every frame
 */
function draw() {
    background(255);
    translate(origin.x, origin.y);

    // Draw grid
    stroke(230);
    strokeWeight(0.75)
    draw_grid(grid_size);

    // Draw reference line
    stroke(255, 122, 122);
    strokeWeight(1.75)
    draw_reference_line();

    // Draw diagonal lines
    stroke(255, 255, 0);
    strokeWeight(2);
    draw_light_line()
}

/**
 * Translates the points according to the base vectors i_hat and j_hat
 * @param {Matrix[]} points 
 */
function transform_points (points) {
    let transform_matrix = get_transform_matrix();
    let points_matrix = Matrix.joinVectors(points);
    return Matrix.dot(transform_matrix, points_matrix);
}


function inverse_transform_points (points) {
    let inverse_transform_matrix = get_inverse_transform_matrix();
    let points_matrix = Matrix.joinVectors(points);
    return Matrix.dot(inverse_transform_matrix, points_matrix);
}

/**
 * Creates the transformation matrix.
 * @returns {Matrix} The transformation matrix.
 */
function get_transform_matrix () {
    return Matrix.joinVectors([i_hat, j_hat])
}

/**
 * Creates the inverse of the transformation matrix.
 * @returns {Matrix} The transformation matrix.
 */
function get_inverse_transform_matrix () {
    let transform_matrix = get_transform_matrix();
    return new Matrix([[transform_matrix.arr[1][1], -transform_matrix.arr[0][1]], [transform_matrix.arr[1][1], transform_matrix.arr[1][1]]]);
}

/**
 * Draws the grid
 * @param {int} [size] - The size of the grid (width and height).
 */
function draw_grid (size) {
    let screenTop = -origin.y;
    let screenBottom = cnv.height - origin.y;
    let screenLeft = -origin.x;
    let screenRight = cnv.width - origin.x;

    // Horizontal pass, draws vertical lines.
    for (let i = round(screenLeft / size); i < round(screenRight / size); i++) {
        let startPoint = createVector(i*size, screenTop);
        let endPoint = createVector(i*size, screenBottom);

        get_transform_matrix

        line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    }
    // Vertical pass, draws horizontal lines.
    for (let i = round(screenTop / size); i < round(screenBottom / size); i++) {
        let startPoint = createVector(screenLeft, i*size);
        let endPoint = createVector(screenRight, i*size);
        line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    }
}

/**
 * Draws the line that represents the path of the current frame of reference.
 */
function draw_reference_line () {
    line(0, 0, cnv.width, 0);
}

/**
 * Draws the line that represents the path that light would take from the origin
 */
function draw_light_line () {
    let length = 1000;
    let endline_i = p5.Vector.mult(i_hat, length)
    let endline_j = p5.Vector.mult(j_hat, length)
    line(0, 0, endline_i.x, endline_i.y);
    line(0, 0, endline_j.x, endline_j.y);
}

/**
 * Updates base vectors based on the scale.
 */
function update_base_vectors () {
    i_hat.mult(alpha);
    j_hat.mult(alpha);
}