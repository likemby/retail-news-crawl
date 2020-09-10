let getPageAndBrowser = require('./login')
const {getData,processData} = require('./api')
const fs = require('fs')
;(async () => {
    const {page, browser} = await getPageAndBrowser()
    // const keywords = ['超市', '百货', '品牌', '餐饮', '生鲜电商'].map(value => '零售 ' + value)
    const keywords = ['超市',  '餐饮', '生鲜电商'].map(value => '零售 ' + value)

    for (let key of keywords) {
        await page.waitForSelector('body > div.searchMain > div.searchInput > form > div.search_txt > input')
        await page.$eval('body > div.searchMain > div.searchInput > form > div.search_txt > input',element => element.value='')
        await page.type('body > div.searchMain > div.searchInput > form > div.search_txt > input', key)
        await Promise.all([
            page.click('body > div.searchMain > div.searchInput > form > div.search_bt'),
            page.waitForNavigation()
        ])

        const content = await getData(page)

        const newPage=await browser.newPage()
        const processedData=await processData(content,newPage)
        await fs.writeFile('./json/'+key+'.json', JSON.stringify(processedData), 'utf8', (err) => {
            if (err) throw err;
            console.log(key+'文件已被保存');
        })
        await  newPage.close()
    }
    await browser.close()
})
()

