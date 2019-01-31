class Point {

    /**
     * Instantiates the point object.
     * @param {p5.Vector|Matrix|number[]|...number} position 
     */
    constructor (position) {
        if (arguments.length > 1) { position = arguments; }

        this.pos_mat = Point.posMat(position);

        this.orig_pos_mat = this.pos_mat.copy();
    }

    transform (matrix) {
        this.pos_mat = Point.transform(this.pos_mat, matrix).pos_mat;
    }

    translate (coordinates) {
        this.pos_mat = Point.translate(this.pos_mat, coordinates).pos_mat;
    }

    draw () {
        point(this.x, this.y);
    }
    copy () {
        return new Point(this.pos_mat.copy());
    }

    get time () {
        return this.x;
    }
    get space () {
        return this.y;
    }
    get x () {
        return this.pos_mat.arr[0][0]
    }
    get y () {
        return this.pos_mat.arr[1][0];
    }
    set x (value) {
        this.pos_mat.arr[0][0] = value;
    }
    set y (value) {
        this.pos_mat.arr[1][0] = value;
    }
    static transform (point, matrix) {
        if (point instanceof Point) {
            point = point.pos_mat;
        } else {
            point = Point.posMat(point);
        }

        return new Point(Matrix.dot(matrix, point));
    }
    static translate (point, coordinates) {
        point = Point.posMat(point);
        coordinates = Point.posMat(coordinates);

        return new Point(Matrix.add(point, coordinates));
    }
    static sub (p1, p2) {
        p1 = Point.posMat(p1);
        p2 = Point.posMat(p2);

        return new Point(Matrix.subtract(p1, p2))
    }
    static posMat (position) {
        // If position is a point.
        if (position instanceof Point) { return position.pos_mat; }

        // If is a 1D array, make it 2D
        if (typeof(position) === "object" && position.length !== undefined && position[0].length === undefined) { position = [position]; }

        let pos_mat = Matrix.toMatrix(position);

        // If horizontal ( [[item, item]] ), make it vertical ( [[item], [item]] ).
        if (pos_mat.shape[0] === 1 && pos_mat.shape[1] === 2) {
            pos_mat = pos_mat.T;
        }
        return pos_mat
    }
}