// Global grid size (in pixels)
grid_size = 20;

// Global origin point.
origin = undefined;

// Global scale factor
gamma = 1

// X base vector
i_hat = undefined;

// Y base vector
j_hat = undefined;

// Original transform matrix.
transform_root = undefined;

// Original inverse transform matrix.
inverse_transform_root = undefined;

// Global test point
p_test = new Point(300, 0);
p_test2 = undefined;

points = Array(10);

/**
 * Runs only once, when the page loads.
 */
function setup() {
    let margin = 10;
    cnv = createCanvas(window.innerWidth-margin, window.innerHeight-margin);
    cnv.parent('canvas-container')

    ////////////////// Define all vectors //////////////////

    origin = createVector(0, cnv.height / 2);

    j_hat = createVector(1, 1);
    i_hat = createVector(1, -1);

    transform_root = get_transform_matrix();
    inverse_transform_root = get_inverse_transform_matrix();

    p_test2 = new Point(Matrix.dot(get_inverse_transform_matrix(), p_test.orig_pos_mat));

    inverse_transform_matrix = get_inverse_transform_matrix();
    points[0] = Point.transform([50, 0], inverse_transform_matrix);
    points[1] = Point.transform([100, 0], inverse_transform_matrix);
    points[2] = Point.transform([150, 0], inverse_transform_matrix);
    points[3] = Point.transform([200, 10], inverse_transform_matrix);
    points[4] = Point.transform([250, 30], inverse_transform_matrix);
    points[5] = Point.transform([300, 50], inverse_transform_matrix);
    points[6] = Point.transform([350, 50], inverse_transform_matrix);
    points[7] = Point.transform([400, 30], inverse_transform_matrix);
    points[8] = Point.transform([450, 10], inverse_transform_matrix);
    points[9] = Point.transform([500, 0], inverse_transform_matrix);
}

/**
 * Runs every frame
 */
function draw() {
    background(255);
    translate(origin.x, origin.y);
    update_base_vectors();

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

    // Draw point
    // stroke(0, 0, 255);
    // strokeWeight(10);
    // p_test.draw();

    // // Draw point2
    // stroke(0, 255, 0);
    // strokeWeight(10);
    // p_test2.draw()

    // let transform_matrix = get_transform_matrix();
    // p_test.transform(transform_matrix);
    // p_test2.transform(transform_matrix);

    // Draw path points
    let transform_matrix = get_transform_matrix();
    for (let i in points) {
        points[i].transform(transform_matrix);

        stroke(0);
        strokeWeight(5);
        points[i].draw();

    }
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
    return Matrix.concatenate([i_hat, j_hat])
}

/**
 * Creates the inverse of the transformation matrix.
 * @returns {Matrix} The transformation matrix.
 */
function get_inverse_transform_matrix () {
    let transform_matrix = get_transform_matrix();
    return Matrix.multiply(
        [
            [  transform_matrix.arr[1][1], -transform_matrix.arr[0][1] ],
            [ -transform_matrix.arr[1][0],  transform_matrix.arr[0][0] ]
        ],
        1 / transform_matrix.det());
}

/**
 * Draws the grid
 * @param {int} [size] - The size of the grid (width and height).
 */
function draw_grid (size) {
    // console.log(transformed_origin);
    let extra_length = 1000;
    let screenTop = -origin.y - extra_length;
    let screenBottom = cnv.height - origin.y + extra_length;
    let screenLeft = -origin.x - extra_length;
    let screenRight = cnv.width - origin.x + extra_length;

    transform_matrix = get_transform_matrix();

    // Horizontal pass, draws vertical lines.
    for (let i = round(screenLeft / size); i < round(screenRight / size); i++) {
        let startPoint = createVector(i*size, screenTop);
        let endPoint = createVector(i*size, screenBottom);

        startPoint = Point.transform(startPoint, inverse_transform_root);
        endPoint = Point.transform(endPoint, inverse_transform_root);

        startPoint = Point.transform(startPoint, transform_matrix);
        endPoint = Point.transform(endPoint, transform_matrix);

        line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    }
    // Vertical pass, draws horizontal lines.
    for (let i = round(screenTop / size); i < round(screenBottom / size); i++) {
        let startPoint = createVector(screenLeft, i*size);
        let endPoint = createVector(screenRight, i*size);

        startPoint = Point.transform(startPoint, inverse_transform_root);
        endPoint = Point.transform(endPoint, inverse_transform_root);

        startPoint = Point.transform(startPoint, transform_matrix);
        endPoint = Point.transform(endPoint, transform_matrix);

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
    i_hat.x = gamma;
    i_hat.y = -gamma;

    j_hat.x = 1./gamma;
    j_hat.y = 1./gamma;
}