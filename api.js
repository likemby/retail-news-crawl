const moment = require('moment')

function getState(dateStr) {
    let temp = moment(dateStr)
    if (temp.isSameOrBefore('2020-01-23'))
        return '疫情知晓前'
    if (temp.isSameOrAfter('2020-01-24') && temp.isSameOrBefore('2020-05-09'))
        return '疫情被普遍知晓'
    if (temp.isAfter('2020-05-09'))
        return '疫情防控逐渐常态化'
}

function getScore(content) {
    let score = 0
    //1.targeted market
    if (/市场不断扩大/ig.test(content)) score += 4
    else if (/市场扩大/ig.test(content)) score += 3
    else score += 1

    //2.digital capacity
    if (/基础设施建设/ig.test(content)) score += 5
    else score += 1

    //3.online retail
    if (/销售额上|销售额增/ig.test(content)) score += 4


    //4.live broadcast, short video, community
    if (/(直播|社群|短视频|视频)/ig.test(content)) score += 4

    //5.cost control
    if (/新市场/ig.test(content)) score += 4
    else if (/成本存在/ig.test(content)) score += 3

    //6. unmanned retail
    if (/无人零售/ig.test(content) && /技术|成本/ig.test(content)) score += 4

    //7. contactless experience
    if (/无接触/ig.test(content) && /技术|成本/ig.test(content)) score += 4

    //8 platform integration
    if (/平台化整合/ig.test(content) && /中小企业/ig.test(content)) score += 3

    //9. operational capability
    if (/合作伙伴/ig.test(content) && /运营能力/ig.test(content)) score += 3

    return score
}


async function processData(data, page) {
    for (let obj of data) {
        obj.state = getState(obj.time)
        obj.score = getScore(obj.content)
        obj.content = await getArticle(obj.url, page).catch(() => '') || obj.content
        // console.log('获取内容长度为'+obj.content.length)
    }
    return Promise.resolve(data)
}

async function getArticle(url, page) {
    const flag = await page.goto(url, {waitUntil: 'domcontentloaded'}).catch(() => false)
    if (!flag) return Promise.resolve('')
    // return Promise.resolve(article)
    const article = await page.$eval('#the_content', el => el.innerText).catch(() => {
        return ''
    }) || await page.$eval('#content', el => el.innerText).catch(() => {
        return ''
    })
    // await page.goBack({waitUntil:'domcontentloaded'})
    console.log('获取文章长度为' + article.length)
    return Promise.resolve(article)


}

//number string boolean null undefined object symbol
async function getData(page) {
    const count = parseInt(await page.$eval('#pagingIndex', element => element.innerText.split('/')[1]))
    let content = []
    for (let i = 1; i <= count; i++) {
        content = content.concat(await page.$$eval('body > div.searchMain > div.searchbox > div.searchboxCon > div.searchboxR > div.searchtext > ul >li',
            (elements) => {

                let _ = []
                for (let li of elements) {
                    let obj = {}
                    obj.title = li.firstElementChild.children[0].innerText
                    obj.url = li.firstElementChild.children[0].getAttribute('href')
                    obj.time = li.firstElementChild.children[1].innerText.replace(/[\[\]]/ig, '')
                    obj.content = li.firstElementChild.children[2].innerText

                    _.push(obj)
                }
                return _
            }
        ))
        await page.waitForSelector('body > div.searchMain > div.searchbox > div.searchboxCon > div.searchboxR > div.pageNav > a.pageNavBtn2')
        await Promise.all([
            page.click('body > div.searchMain > div.searchbox > div.searchboxCon > div.searchboxR > div.pageNav > a.pageNavBtn2'),
            // page.waitForNavigation({waitUntil:'domcontentloaded'}),
            page.waitFor(2000)
        ])
    }
    console.log(content.length)
    return Promise.resolve(content)
}

function getScoreList(content) {
    let scoreList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    // 1. market expanding
    if (/市场不断扩大/ig.test(content))
        scoreList[0] += 5 * Math.max(content.match(/市场不断扩大/ig).length | 0)
    else if (/市场扩大/ig.test(content)) scoreList[0] += 3 * Math.max(content.match(/市场扩大/ig).length | 0)
    else scoreList[0] += 1

    //2.digital capacity
    if (/基础设施建设/ig.test(content))
        scoreList[1] += 5 * Math.max(content.match(/基础设施建设/ig).length | 0)
    else scoreList[1] += 1

    //3.online retail
    if (/零售/ig.test(content) && /线上/ig.test(content))
        scoreList[2] += 4 * Math.max(content.match(/零售/ig).length | 0)

    //4.live broadcast, short video, community
    if (/(直播|社群|短视频|视频)/ig.test(content))
        scoreList[3] += 4 * Math.max(content.match(/(直播|社群|短视频|视频)/ig).length | 0)
    //5.
    if (/销售额增|销售额长|销售额上/ig.test(content) && /线上/ig.test(content))
        scoreList[4] += 4 * Math.max(content.match(/销售额增|销售额长|销售额上/ig).length | 0)
    //6.cost control
    if (/新市场/ig.test(content))
        scoreList[5] += 4 * Math.max(content.match(/新市场/ig).length | 0)
    else if (/成本存在/ig.test(content))
        scoreList[5] += 4 * Math.max(content.match(/成本存在/ig).length | 0)

    //7. unmanned retail
    if (/无人零售/ig.test(content) && /技术|成本/ig.test(content))
        scoreList[6] += 4 * Math.max(content.match(/无人零售/ig).length | 0, content.match(/技术|成本/ig).length | 0)


    //8. contactless experience
    if (/无接触/ig.test(content) && /技术|成本/ig.test(content))
        scoreList[7] += 4 * Math.max(content.match(/无接触/ig).length | 0, content.match(/技术|成本/ig).length | 0)


    //9. platform integration
    if (/平台/ig.test(content) && /整合/ig.test(content)&& /企业/ig.test(content)) {
        scoreList[8] += 3 * Math.max(content.match(/平台/ig).length | 0, content.match(/整合/ig).length | 0)
    }

    //10. operational capability
    if (/合作/ig.test(content) && /运营/ig.test(content)&& /伙伴/ig.test(content)) {

        scoreList[9] += 3 * Math.max(content.match(/合作/ig).length | 0, content.match(/运营/ig).length | 0)
    }
    let score = scoreList.reduce((cn, el) => {
        cn += el
        return cn
    }, 0)
    return {score, scoreList}

}

function getPartStatistics(content) {
    let statisticsList = []
    statisticsList.push(content.match(/目标市场/ig) ? content.match(/目标市场/ig).length : 0)
    statisticsList.push(content.match(/数字化能力/ig) ? content.match(/数字化能力/ig).length : 0)
    statisticsList.push(content.match(/线上零售/ig) ? content.match(/线上零售/ig).length : 0)
    statisticsList.push(content.match(/直播|社群|短视频|视频/ig) ? content.match(/直播|社群|短视频|视频/ig).length : 0)
    statisticsList.push(content.match(/线上销售额/ig) ? content.match(/线上销售额/ig).length : 0)
    statisticsList.push(content.match(/成本控制/ig) ? content.match(/成本控制/ig).length : 0)
    statisticsList.push(content.match(/无人零售/ig) ? content.match(/无人零售/ig).length : 0)
    statisticsList.push(content.match(/无接触体验/ig) ? content.match(/无接触体验/ig).length : 0)
    statisticsList.push(content.match(/平台化整合/ig) ? content.match(/平台化整合/ig).length : 0)
    statisticsList.push(content.match(/合作网络伙伴/ig) ? content.match(/合作网络伙伴/ig).length : 0)


    return statisticsList
}

module.exports.getData = getData
module.exports.processData = processData

// module.exports.getState = getState
module.exports.getScore = getScore
module.exports.getScoreList = getScoreList
module.exports.getPartStatistics = getPartStatistics

