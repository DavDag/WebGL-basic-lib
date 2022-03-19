/** @author: Davide Risaliti davdag24@gmail.com */

function F32ArrF32ArrCompare (arr1, arr2) {
    return arr1.length === arr2.length
        && arr1.every((v, ind) => arr2[ind] === v);
}

function VecF32ArrCompare (vec, arr) {
    return F32ArrF32ArrCompare(vec.values, arr);
}

function VecArrCompare (vec, arr) {
    return VecF32ArrCompare(vec, new Float32Array(arr));
}

function MatF32ArrCompare (mat, arr) {
    return F32ArrF32ArrCompare(mat.values, arr);
}

function MatArrCompare (mat, arr) {
    return MatF32ArrCompare(mat, new Float32Array(arr));
}

global.CmpVecToArr = VecArrCompare;
global.CmpVecToF32Arr = VecF32ArrCompare;
global.CmpMatToArr = MatArrCompare;
global.CmpMatToF32Arr = MatF32ArrCompare;
