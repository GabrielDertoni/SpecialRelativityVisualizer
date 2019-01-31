class Point {

    /**
     * Instantiates the point object.
     * @param {p5.Vector|Matrix|number[]|...number} position 
     */
    constructor (position) {
        if (arguments.length > 1) { position = arguments; }

        this.pos_mat = Point.posMat(position);

        this.orig_pos_mat = this.pos_mat;

        this.x = this.pos_mat.arr[0][0];
        this.y = this.pos_mat.arr[1][0];
    }

    transform (matrix) {
        this.pos_mat = Point.transform(this.orig_pos_mat, matrix).pos_mat;
        this.update_xy();
    }

    draw () {
        point(this.x, this.y);
    }

    update_xy () {
        this.x = this.pos_mat.arr[0][0];
        this.y = this.pos_mat.arr[1][0];
    }

    get time () {
        return this.x;
    }
    get space () {
        return this.y;
    }
    static transform (point, matrix) {
        if (point instanceof Point) {
            point = point.pos_mat;
        } else {
            point = Point.posMat(point);
        }

        return new Point(Matrix.dot(matrix, point));
    }
    static posMat (position) {
        // If is a 1D array, make it 2D
        if (typeof(position) === "object" && position.length !== undefined) { position = [position]; }

        let pos_mat = Matrix.toMatrix(position);

        // If horizontal ( [[item, item]] ), make it vertical ( [[item], [item]] ).
        if (pos_mat.shape[0] === 1 && pos_mat.shape[1] === 2) {
            pos_mat = pos_mat.T;
        }
        return pos_mat
    }
}