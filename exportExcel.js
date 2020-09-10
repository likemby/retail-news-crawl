var json2xls = require('json2xls');
const fs = require('fs')
const {getScore,getPartStatistics} = require('./api')
const filesList = fs.readdirSync('./json').map(s => s.split('.')[0])
const mapT={
    '零售 百货':'department_store',
    '零售 品牌':'brand',
    '零售 生鲜电商':'fresh_food_E-commerce',
    '零售 超市':'supermarket',
    '零售 餐饮':'catering',

}

for (let file of filesList) {
    let rawData = fs.readFileSync('./json/' + file + '.json', {encoding: 'utf-8'})
    let ls = (JSON.parse(rawData)).map(o => {
        o['category']=file.split(' ')[1]
        o.score = getScore(o.content)
        o.statisticList=getPartStatistics(o.content)
        o['k_target_market']=o.statisticList[0]
        o['k_digital_capability']=o.statisticList[1]
        o['k_online_retail']=o.statisticList[2]
        o['k_video']=o.statisticList[3]
        o['k_online_sales']=o.statisticList[4]
        o['k_cost_control']=o.statisticList[5]
        o['k_unmanned_retail']=o.statisticList[6]
        o['k_contactless_experience']=o.statisticList[7]
        o['k_platform_integration']=o.statisticList[8]
        o['k_partner_network']=o.statisticList[9]
        delete o.statisticList

        return o
    })
    // console.log(file+''+ls.length+' '+ls.filter(o=>o.state.length===5).length+' '+ls.filter(o=>o.state.length===7).length+' '+ls.filter(o=>o.state.length===9).length)
    fs.writeFileSync('./excel/' + file + ' item.xlsx', json2xls(ls), 'binary')
    // fs.writeFileSync('./excel/items.xlsx', json2xls(ls), 'binary')

}
