var json2xls = require('json2xls');
const fs = require('fs')
const {getScoreList, getPartStatistics} = require('./api')
const filesList = fs.readdirSync('./json').map(s => s.split('.')[0])


for (let file of filesList) {
    let rawData = fs.readFileSync('./json/' + file + '.json', {encoding: 'utf-8'})
    let ls = (JSON.parse(rawData)).map(o => {
        o['category'] = file.split(' ')[1]
        o.scoreList=getScoreList(o.content).scoreList
        return o
    })
    function isEmptyArray(arr){
        return Array.isArray(arr) && arr.length===0
    }
    function arrayPlus(arr1, arr2) {
        if(isEmptyArray(arr1) && isEmptyArray(arr2)) return [0,0,0,0,0,0,0,0,0,0]
        if(isEmptyArray(arr1) && !isEmptyArray(arr2))  return arr2
        if(isEmptyArray(arr2) && !isEmptyArray(arr1))  return arr1

        let temp = []
        for (let i = 0; i < arr1.length; i++) {
            temp[i] = arr1[i] + arr2[i]
        }
        return temp
    }

    let obj1 = ls.filter(o => o.state.length === 5).reduce((cn, el) => {
        let _= arrayPlus(cn[el.state]||[], el.scoreList)
        cn[el.state] =_
        return cn
    }, {})
    let obj2 = ls.filter(o => o.state.length === 7).reduce((cn, el) => {

        cn[el.state] = arrayPlus(cn[el.state] ||[], el.scoreList)
        return cn
    }, {})
    let obj3 = ls.filter(o => o.state.length === 9).reduce((cn, el) => {

        cn[el.state] = arrayPlus(cn[el.state] ||[], el.scoreList)
        return cn
    }, {})
    Object.assign({},obj1,obj2,obj3)
    // console.log(file+''+ls.length+' '+.length+' '+.length+' '+.length)
    fs.writeFileSync('./excel/' + file + ' score.xlsx', json2xls( Object.assign({},obj1,obj2,obj3)), 'binary')
    // fs.writeFileSync('./excel/items.xlsx', json2xls(ls), 'binary')

}
