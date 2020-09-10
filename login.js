const puppeteer = require('puppeteer')

async function getPageAndBrowser() {

    // const browser = await puppeteer.launch({slowMo: 250, headless: false})
    const browser = await puppeteer.launch({slowMo: 0, headless: true})

    const page = await browser.newPage()
    await page.goto('http://china.caixin.com')
    await Promise.all([
        page.click('#showLoginId > li:nth-child(1) > a'),
        page.waitForNavigation(),

    ])
    await Promise.all([
        page.click('#phone > li.phone'),
        page.waitForNavigation(),
        // 13830685687  密码：13830685687xy
    ])
    await page.type('#phone-login > p:nth-child(1) > input[type=text]', '13830685687')
    await page.type('#password_pc', '13830685687xy')
    await Promise.all([
        page.click('#loginBt'),
        page.waitForNavigation(),

    ])
    await page.goto('https://search.caixin.com/search/search.jsp', {waitUntil: "domcontentloaded"})


    await Promise.all([
        page.click('body > div.searchMain > div.searchbox > div.searchboxCon > div.searchboxL > div > div:nth-child(4) > ul > li:nth-child(2) > a'),
        page.waitForNavigation(),
    ])
    await page.click('#tbd > div')

    await page.focus('#starttime1')
    await page.select('#calendarMonth','0')
    await page.click('#calendarTable > tbody > tr:nth-child(2) > td:nth-child(4)')
    await page.click('#endtime1')
    await page.click('#calendarToday')
    await Promise.all([
        page.click('#tbd > div > form > div.content > ul > li:nth-child(6) > input'),
        page.waitForNavigation()
    ])



    return Promise.resolve({page, browser})
}


module.exports = getPageAndBrowser

