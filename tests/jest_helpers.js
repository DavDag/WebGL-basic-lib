/** @author: Davide Risaliti davdag24@gmail.com */

function ArrArrCompare (arr1, arr2) {
    return arr1.length === arr2.length
        && arr1.every((v, ind) => arr2[ind] === v);
}

function VecF32ArrCompare (vec, arr) {
    return ArrArrCompare(vec.values, arr);
}

function VecArrCompare (vec, arr) {
    return VecF32ArrCompare(vec, new Float32Array(arr));
}

function VecVecCompare (vec1, vec2) {
    return ArrArrCompare(vec1.values, vec2.values);
}

function MatF32ArrCompare (mat, arr) {
    return ArrArrCompare(mat.values, arr);
}

function MatArrCompare (mat, arr) {
    return MatF32ArrCompare(mat, new Float32Array(arr));
}

function MatMatCompare (mat1, mat2) {
    return ArrArrCompare(mat1.values, mat2.values);
}

global.CmpArrToArr = ArrArrCompare;
global.CmpVecToArr = VecArrCompare;
global.CmpVecToVec = VecVecCompare;
global.CmpMatToArr = MatArrCompare;
global.CmpMatToMat = MatMatCompare;
