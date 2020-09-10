function arrayPlus(arr1, arr2) {
    if(!!arr1 && !!arr2) return [0,0,0,0,0,0,0,0,0,0]
    if(!+arr1 &&  !!arr2) return arr2
    if(!+arr2 && !!arr1) return arr1

    let temp = []
    for (let i = 0; i < arr1.length; i++) {
        temp[i] = arr1[i] + arr2[i]
    }
    return temp
}
let a=[1,2]
let b
console.log(!!b,arrayPlus(a,b))
