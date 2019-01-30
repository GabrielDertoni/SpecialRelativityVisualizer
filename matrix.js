/**
 * Matrix class, hadles all matrix math
 * @param {number[][]} [matrixArray] - 2D array with data for the matrix.
 */
class Matrix {
    constructor (matrixArray) {
        if (Matrix.checkArray(matrixArray)) {
            this.matrixArray = matrixArray;
        } else {
            console.warn('An error has occured, creating empty array instead.')
            this.matrixArray = [[]];
        }
    }

    /**
     * Calculates the dot product of two matrices and stores the result directly in this.matrixArray
     * @param {(Matrix|p5.Vector|number[][])} [other] - Matrix to make the dot product with.
     */
    dot (other) {
        this.arr = Matrix.dot(this, other).arr;
    }

    /**
     * Returns the matrix transpose.
     * @returns {Matrix} A new matrix equal to the transpose of this matrix.
     */
    get transpose () {
        let newArray = Array(this.shape[1]);

        for (let j = 0; j < this.shape[1]; j++) {
            newArray[j] = [];
            for (let i = 0; i < this.shape[0]; i++) {
                newArray[j].push(this.matrixArray[i][j]);
            }
        }
        return new Matrix(newArray);
    }

    /**
     * Sets the this.matrixArray
     * @param {number[][]} [new_arr] - New array to set this.matrixArray to.
     */
    set arr (new_arr) {
        this.matrixArray = new_arr;
    }

    /**
     * Same as transpose()
     */
    get T () {
        return this.transpose;
    }

    /**
     * Calculates shape of the matrix and stores it in an array.
     * @returns {number[]} The dimentions of the matrix.
     */
    get shape () {
        return [this.matrixArray.length, this.matrixArray[0].length];
    }

    /**
     * Gets the this.matrixArray
     * @returns {number[][]} The this.matrixArray
     */
    get arr () {
        return this.matrixArray;
    }

    /**
     * Calculates the dot product between two matrices.
     * @param {(Matrix|p5.Vector|number[][])} [mat1] - First matrix.
     * @param {(Matrix|p5.Vector|number[][])} [mat2] - Second matrix.
     * @param {boolean} [print_error=true] - Whether or not to print the error messages.
     * @returns {Matrix} The resulting dot product matrix.
     */
    static dot (mat1, mat2, print_error=true) {
        if (mat2 instanceof p5.Vector) {

            return Matrix.dot(mat1, new Matrix([[mat2.x], [mat2.y]]))

        } else if (mat1 instanceof p5.Vector) {

            return Matrix.dot(new Matrix([[mat1.x], [mat1.y]]), mat2);

        } else if (Matrix.checkArray(mat2, false)) {

            return Matrix.dot(mat1, new Matrix(mat2));

        } else if (Matrix.checkArray(mat1, false)) {

            return Matrix.dot(new Matrix(mat1), mat2);
            
        } else if (mat2 instanceof Matrix) {
            if (Matrix.checkDot(mat1, mat2, print_error))  {

                let result_matrix = Array(mat1.shape[0]);

                for (let i = 0; i < mat1.shape[0]; i++) {
                    result_matrix[i] = Array(mat2.shape[1]);
                    
                    for (let j = 0; j < mat2.shape[1]; j++) {
                        result_matrix[i][j] = 0

                        for (let c = 0; c < mat2.shape[0]; c++) {

                            result_matrix[i][j] += mat1.matrixArray[i][c] * mat2.matrixArray[c][j];
                        }
                    }
                }
                return new Matrix(result_matrix);
            }
            return false;
        } else {
            if (print_error) { console.error(""); }
            return false;
        }
    }

    /**
     * Joins all vectors into a single matrix.
     * @param {(...p5.Vector|p5.Vector[])} [vector_arr] - The array of vectors to join.
     * @returns {Matrix} The resulting matrix.
     */
    static joinVectors (vector_arr) {
        if (arguments.length > 1) { vector_arr = arguments; }
        let resultingArr = [Array(0), Array(0)];
        for (let j = 0; j < vector_arr.length; j++) {
            for (let i = 0; i < 2; i ++) {
                let vector_value = i === 0 ? vector_arr[j].x : vector_arr[j].y ;
                resultingArr[i].push(vector_value);
            }
        }
        return resultingArr;
    }

    /**
     * Cheks if array is suitable for making up a matrix.
     * @param {*} [arr] - Term to check if is a suitable array
     * @param {boolean} [print_error=true] - Whether or not to print the error messages.
     * @returns {boolean} True if array is suitable, false otherwise
     */
    static checkArray (arr, print_error=true) {
        if (arr.length === undefined || typeof(arr) !== "object") {
            if (print_error) { console.error('Error: Not an array.'); }
            return false;
        }
        if (arr.length <= 0)  {
            if (print_error) { console.error('Error: Array is completelly empty, it should have at least one other array insede of it like "[[]]"'); }
            return false;
        }
        if (arr[0].length === undefined || typeof(arr[0]) !== "object") {
            if (print_error) { console.error('Error: Array first item not another array.'); }
            return false;
        }
        let shape = [arr.length, arr[0].length];
        for (let i = 0; i < shape[0]; i++) {
            if (arr[i].length !== shape[1]) {
                if (print_error) { console.error('Error: Array does not have all columns of equal length.'); }
                return false;
            }
            for (let j = 0; j < shape[1]; j++) {
                if (typeof(arr[i][j]) !== "number") {
                    if (print_error) { console.error('Error: Array does not have all elements of type "number".'); }
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Checks if the right shapse match to make dot products possible
     * @param {Matrix} [mat1] - First matrix
     * @param {Matrix} [mat2] - Second matrix
     */
    static checkDot (mat1, mat2) {
        if (mat1.shape[1] === mat2.shape[0])
            return true;
        else
            return false;
    }
    static blankWithShape (shape) {
        let blancArr = Array(shape[0]);
        for (let i = 0; i < blankArr.length; i++) { blancArr[i] = Array(shape[1]) }
        return blancArr;
    }
}



