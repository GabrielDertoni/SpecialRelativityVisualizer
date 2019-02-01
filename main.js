///// Auto global variables /////
_roll_time = false;
_start_time = undefined;

// Global grid size (in pixels)
grid_size = 20;
// grid_space_ratio = undefined;
grid_time_ratio = 1./(365*24*3600);

// Global time ratio
time_ratio = (grid_size/grid_time_ratio)/(365*24*3600*1000);

// Global origin point.
origin = undefined;

// Global scale factor
gamma = 1;

// X base vector
i_hat = undefined;

// Y base vector
j_hat = undefined;

// Original transform matrix.
transform_root = undefined;

// Original inverse transform matrix.
inverse_transform_root = undefined;

// Original origin.
root_origin = undefined;

// Global test point
p_test = new Point(300, 100);
p_test2 = undefined;

points = Array(12);

next_point = undefined;

/**
 * Runs only once, when the page loads.
 */
function setup() {
    let datetime = new Date();
    _start_time = datetime.getTime();

    let margin = 10;
    cnv = createCanvas(window.innerWidth-margin, window.innerHeight-margin);
    cnv.parent('canvas-container')

    ////////////////// Define all vectors //////////////////

    origin = new Point(createVector(200, cnv.height / 2));

    // j_hat = createVector(1, 1);
    // i_hat = createVector(1, -1);

    j_hat = createVector(sqrt(1/2), sqrt(1/2));
    i_hat = createVector(sqrt(1/2), -sqrt(1/2));

    transform_root = get_transform_matrix();
    inverse_transform_root = get_inverse_transform_matrix();
    root_origin = origin.copy();

    p_test2 = new Point(Matrix.dot(get_inverse_transform_matrix(), p_test.pos_mat));

    inverse_transform_matrix = get_inverse_transform_matrix();
    points[0] = Point.transform([0, 0], inverse_transform_matrix);
    points[1] = Point.transform([50, 0], inverse_transform_matrix);
    points[2] = Point.transform([100, 0], inverse_transform_matrix);
    points[3] = Point.transform([150, 0], inverse_transform_matrix);
    points[4] = Point.transform([200, 10], inverse_transform_matrix);
    points[5] = Point.transform([250, 30], inverse_transform_matrix);
    points[6] = Point.transform([300, 50], inverse_transform_matrix);
    points[7] = Point.transform([350, 50], inverse_transform_matrix);
    points[8] = Point.transform([400, 30], inverse_transform_matrix);
    points[9] = Point.transform([450, 10], inverse_transform_matrix);
    points[10] = Point.transform([500, 0], inverse_transform_matrix);
    points[11] = Point.transform([550, 0], inverse_transform_matrix);

    next_point = get_next_point(new Point(0, 0), points);
}

/**
 * Runs every frame
 */
function draw() {
    let start_time = get_time();

    background(255);
    translate(origin.x, origin.y);
    update_base_vectors();

    let delta_translation = Point.sub(origin.orig_pos_mat, origin.pos_mat)

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
    stroke(0, 255, 0);
    strokeWeight(10);
    p_test2.pos_mat = Matrix.dot(get_transform_matrix(), p_test2.orig_pos_mat);
    p_test2.draw();
    strokeWeight(1);
    line(0, 0, p_test2.x, p_test2.y);

    // let transform_matrix = get_transform_matrix();
    // p_test.transform(transform_matrix);
    // p_test2.transform(transform_matrix);

    // Calculate transformations of the path points
    let transform_matrix = get_transform_matrix();
    for (let i in points) {
        i = int(i);

        points[i].transform(transform_matrix);
        // points[i].translate(delta_origin);
    }

    // Draw points and lines
    for (let i in points) {
        i = int(i);
        
        stroke(0, 200, 0);
        strokeWeight(2);
        if (i-1 >= 0) {
            // line(points[i].x, points[i].y, points[i-1].x, points[i-1].y);
            let begin_control_point = undefined;
            let end_control_point = undefined;
            if (i-2 >= 0) {
                begin_control_point = points[i-2];
            } else {
                begin_control_point = new Point(points[i-1].x-50, points[i-1].y);
            }
            if (i+1 < points.length) {
                end_control_point = points[i+1];
            } else {
                end_control_point = new Point(points[i].x+50, points[i].y);
            }
            curve(
                begin_control_point.x,
                begin_control_point.y,
                points[i-1].x,
                points[i-1].y,
                points[i].x,
                points[i].y,
                end_control_point.x,
                end_control_point.y
            );
        }

        stroke(0);
        strokeWeight(5);
        points[i].draw();
    }

    if (next_point) {
        // Draw next point (debugging)
        stroke(0);
        strokeWeight(10);
        point(next_point.x, next_point.y);

        // Define next point
        if (delta_translation.x > next_point.x) {
            // console.log('Getting next point');
            next_point = get_next_point(delta_translation, points);
            if (!next_point) { stop_time(); }
        }
    }

    let frame_time = get_time() - start_time;
    // console.log(frame_time);

    if (_roll_time) { origin.x -= (frame_time * time_ratio); }
    // origin.x = -100;

    // Clear all transformations
    for (let i in points) {
        points[i].pos_mat = points[i].orig_pos_mat;

    }
}

/**
 * Makes time stop.
 */
function stop_time () {
    _roll_time = false;
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
 * Returns the closest point whithin an array that has x value grater than the reference point.
 * @param {Point} [reference_point] - The point used to get the next.
 * @param {Point[]} [point_arr] - Array of points.
 * @returns {Point} The next point.
 */
function get_next_point(reference_point, point_arr) {
    for (let i in point_arr) {
        if (point_arr[i].x > reference_point.x) { return point_arr[i] }
    }
    return null;
}

/**
 * Creates the transformation matrix.
 * @returns {Matrix} The transformation matrix.
 */
function get_transform_matrix () {
    return Matrix.concatenate([i_hat, j_hat]);
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

function apply_extra_transformation (matrix) {
    return Matrix.dot(matrix, get_transform_matrix());
}

function get_beta (x, y, y_prime) {
    return (y_prime + sqrt(pow(y_prime, 2) + 4*x*y)) / (2 * x);
}

/**
 * Calculates the time dilation for a specific ammount of time ia a certain velocity.
 * @param {number} [time] - The time in which the body was in the velocity.
 * @param {number} [slope] - Velocity relative to the speed of light.
 * @returns {number} Dilated time.
 */
function time_dilation (time, slope) {
    return time * sqrt(1 - slope);
}

/**
 * Calculates the slope between two points.
 * @param {Point} [p1] - First point.
 * @param {Point} [p2] - Second point.
 * @returns {number} The slope between p1 and p2.
 */
function slope (p1, p2) {
    let delta_x = p2.x - p1.x;
    let delta_y = p2.y - p1.y;
    return delta_y / delta_x;
}

/**
 * Calculates the time in milliseconds since the start of the program.
 * @returns {int} Number in milliseconds
 */
function get_time () {
    let datetime = new Date();
    return datetime.getTime() - _start_time;
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
    line(0, 0, cnv.width - origin.x, 0);
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
    i_hat.x = gamma*sqrt(1/2);
    i_hat.y = -gamma*sqrt(1/2);

    j_hat.x = sqrt(1/2)/gamma;
    j_hat.y = sqrt(1/2)/gamma;

    // i_hat.x = gamma;
    // i_hat.y = -gamma;

    // j_hat.x = 1/gamma;
    // j_hat.y = 1/gamma;
}