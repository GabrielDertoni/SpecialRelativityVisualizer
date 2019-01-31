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
     * Calculates the detarminant of this matrix.
     * @returns {number} The determinant.
     */
    determinant () {
        return Matrix.determinant(this);
    }

    /**
     * Calculates the detarminant of this matrix.
     * @returns {number} The determinant.
     */
    det () {
        return this.determinant();
    }

    /**
     * Multiplies this matrix with another.
     * @param {(Matrix|p5.Vector|number[][])} other 
     */
    multiply (other) {
        this.arr = Matrix.multiply(this, other);
    }

    /**
    * Multiplies this matrix with another.
    * @param {(Matrix|p5.Vector|number[][])} other 
    */
    mult (other) {
        this.multiply(other);
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
     * Calculates the determinant of a matrix.
     * @param {Matrix|p5.Vector|number[][]} [mat] - Matrix to calculate the determinant.
     * @param {boolean} [print_error=true] - Whether or not to print the error messages.
     * @return {number} The determinant of the matrix.
     */
    static determinant (mat, print_error=true) {
        mat = Matrix.toMatrix(mat, print_error);
        if (mat.shape[0] === mat.shape[1]) {
            if (mat.shape[0] === 2) {
                return (mat.arr[0][0] * mat.arr[1][1]) - (mat.arr[0][1] * mat.arr[1][0]);
            } else {
                let sum = 0;
                for (let j = 0; j < mat.shape[0]; j++) {
                    let submatrix = Matrix.concatenate(
                        mat.slice([[1, mat.shape[0]], [0, j]]),
                        mat.slice([[1, mat.shape[0]], [j+1, mat.shape[1]]])
                    );
                    sum += pow(-1, j + 2) * mat.arr[0][j] * Matrix.determinant(submatrix);
                }
                return sum;
            }
        } else { return null }
    }

    /**
     * Calculates the dot product between two matrices.
     * @param {(Matrix|p5.Vector|number[][])} [mat1] - First matrix.
     * @param {(Matrix|p5.Vector|number[][])} [mat2] - Second matrix.
     * @param {boolean} [print_error=true] - Whether or not to print the error messages.
     * @returns {Matrix} The resulting dot product matrix.
     */
    static dot (mat1, mat2, print_error=true) {
        mat1 = Matrix.toMatrix(mat1);
        mat2 = Matrix.toMatrix(mat2);

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
    }

    /**
     * Calculates the product between two matrices.
     * @param {(Matrix|p5.Vector|number[][]|number)} [mat1] - First matrix or number.
     * @param {(Matrix|p5.Vector|number[][]|number)} [mat2] - Second matrix or number.
     * @param {boolean} [print_error=true] - Whether or not to print the error messages.
     * @returns {Matrix} The resulting product matrix.
     */
    static multiply (mat1, mat2, print_error=true) {
        if (typeof(mat1) === "number") {
            if (typeof(mat2) === "number") {
                if (print_error) { console.warn('Both arguments are numbers.'); }
                return mat1 * mat2;
            }
            // Invert which is number and which is array.
            buff = mat1;
            mat1 = mat2;
            mat2 = buff;
        }
        mat1 = Matrix.toMatrix(mat1);

        if (typeof(mat2) === "number") {
            let result = Array(mat1.shape[0]);
            for (let i in mat1.arr) {
                result[i] = [];
                for (let j in mat1.arr[i]) {
                    result[i].push(mat1.arr[i][j] * mat2);
                }
            }
            return new Matrix(result);
        }

        mat2 = Matrix.toMatrix(mat2);

        if (mat1.shape[0] === mat2.shape[0] && mat1.shape[1] === mat2.shape[1]) {
            let result = Array(mat1.shape[0]);
            for (let i in mat1.arr) {
                result[i] = [];
                for (let j in mat1.arr[i]) {
                    result[i].push(mat1.arr[i][j] * mat2.arr[i][j]);
                }
            }
            return new Matrix(result);
        } else if (print_error) { console.error('Error: Matrices neet to have same shape.') }
        return null;
    }

    /**
     * Slices the matrix in a smaller one.
     * @param {(Matrix|p5.Vector|number[][])} [mat] - Matrix to slice.
     * @param {int[][]|string[]} [cut] - Where to slice in each dimention.
     * @param {boolean} [print_error] - Wheter or not to print the error messages.
     * @returns {Matrix} The resulting sliced matrix.
     */
    static slice (mat, cut, print_error=true) {
        // Parse cuts.
        // ["1:3", "4:7"] -> [[1, 3], [4, 7]]
        let parsed_cut = Array(cut.length);
        for (let i in cut) {
            if (typeof(cut[i] === "string")) {
                parsed_cut[i] = cut[i].split(':');
                for (let j = 0; j < 2; j++) {
                    if (parsed_cut[i][j] === "") {
                        if (j === 0) {
                            parsed_cut[i][j] = 0;
                        } else {
                            parsed_cut[i][j] = mat.shape[i];
                        }
                    } else {
                        parsed_cut[i][j] = int(parsed_cut[i][j]);
                    }
                }
            } else { parsed_cut[i] = cut[i] }
        }

        // Matrix.checkSlice(parsed_cut, print_error);

        // Create array containing the slice
        let slice_arr = Array(parsed_cut[0][1] - parsed_cut[0][0]);
        for (let i = parsed_cut[0][0]; i < parsed_cut[0][1]; i++) {
            slice_arr[i] = mat.arr[i].slice(parsed_cut[1][0], parsed_cut[1][1]);
        }
        return new Matrix(slice_arr);
    }

    /**
     * Joins several matrices.
     * @param {(...Matrix|Matrix[]|...p5.Vector|p5.Vector[]|...number[][]|number[][][])} [matrices] - All matrices to concatenate
     * @param {boolean} [print_error=true] - Whether or not to print the error messages.
     * @returns Single matrix which is a concatenation of all input matrices.
     */
    static concatenate (matrices, print_error=true) {
        if (arguments.length > 1) { matrices = arguments; print_error = true; }

        // Turn all inputs to Matrices.
        for (let i in matrices) {
            matrices[i] = Matrix.toMatrix(matrices[i], print_error);
        }

        let row_length = Matrix.checkEqualRowLength(matrices, print_error);
        if (row_length) {
            let jointArray = Array(row_length);
            for (let i = 0; i < row_length; i++) {
                jointArray[i] = [];
                for (let j = 0; j < matrices.length; j++) {
                    jointArray[i] = jointArray[i].concat(matrices[j].arr[i]);
                }
            }
            return new Matrix(jointArray);
        }
        return null;
    }

    /**
     * Takes one of three types and returs a Matrix type object.
     * @param {(Matrix|p5.Vector|number[][])} [mat] - Object to turn into array
     * @param {boolean} [print_error] - Whether or not to print errors.
     * @returns {Matrix} Matrix, if mat is already a Matrix object, return it.
     */
    static toMatrix (mat, print_error=true) {
        if (mat instanceof Matrix) {
            return mat;
        } else if (mat instanceof p5.Vector) {
            return new Matrix(
                [
                    [ mat.x ],
                    [ mat.y ]
                ]
            );
        } else if (Matrix.checkArray(mat, print_error)) {
            return new Matrix(mat);
        } else if (print_error) {
            console.error('Error: "mat" not a Matrix, p5.Vector or number[][].');
        }
        return null;
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

    /**
     * Checks if all matrices have the same shape[0];
     * @param {Matrix[]} [mats] - The list of matrices to check.
     * @param {boolean} [print_error=true] - Wheter or not to print the error messages.
     */
    static checkEqualRowLength (mats, print_error=true) {
        let row_length = mats[0].shape[0];
        for (let i = 1; i < mats.length; i++) {
            if (mats[i].shape[0] !== row_length) {
                if (print_error) { console.error('Error: All matrices need to be the same size.'); }
                return false;
            }
        }
        return row_length;
    }

    static blankWithShape (shape) {
        let blancArr = Array(shape[0]);
        for (let i = 0; i < blankArr.length; i++) { blancArr[i] = Array(shape[1]) }
        return blancArr;
    }
}



