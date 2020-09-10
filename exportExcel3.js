var json2xls = require('json2xls');
const fs = require('fs')
const {getScoreList, getPartStatistics} = require('./api')
const filesList = fs.readdirSync('./json').map(s => s.split('.')[0])
let scLs = []
let n = 1
for (let file of filesList) {
    let rawData = fs.readFileSync('./json/' + file + '.json', {encoding: 'utf-8'})
    let ls = (JSON.parse(rawData)).map(o => {
        o['category'] = file.split(' ')[1]
        const {score, scoreList} = getScoreList(o.content)
        o.id = n++
        o.score = score
        o['s_target_market'] = scoreList[0]
        o['s_digital_capability'] = scoreList[1]
        o['s_online_retail'] = scoreList[2]
        o['s_video'] = scoreList[3]
        o['s_online_sales'] = scoreList[4]
        o['s_cost_control'] = scoreList[5]
        o['s_unmanned_retail'] = scoreList[6]
        o['s_contactless_experience'] = scoreList[7]
        o['s_platform_integration'] = scoreList[8]
        o['s_partner_network'] = scoreList[9]
        return o
    })
    scLs = scLs.concat(ls)
    console.log(ls.length)
}
fs.writeFileSync('./excel/scoreList.xlsx', json2xls(scLs), 'binary')
