const puppeteer = require('puppeteer');
let fbUrl = 'https://fb.com';
(async () => {
    const browser = await puppeteer.launch({ // Một số setup giúp theo dõi được tiến trình, full screen...
        headless: false,
        defaultViewport: null,
        args: ['--start-fullscreen']
    });

    const page = await browser.newPage();
    await page.goto(fbUrl);
    const login = async () => {
        await page.type('#email', "tài khoản")
        await page.type('#pass', "mật khẩu")
        await page.click('#u_0_b') //click button đăng nhập
        await page.waitForSelector('.mzan44vs')
        // Tới đây chúng ta đã login thành công vào hệ thống.
        // Theo đường dẫn để có thể tìm ra những bài post có hastag là 10yearschallenge_gostack
        await page.goto('https://www.facebook.com/hashtag/SVMC_OPEN_DAY_2019_04')
        // await page.waitFor(2000)
        await page.click('._6s5d') // Giả lập click chuột vào màn hình để tắt đi cái "notifications"
    }
    const clear = async () => {
        await page.evaluate(async () => {
            document.querySelectorAll('div[role="banner"]')[0].style.display = 'none'
            document.querySelectorAll('.dsne8k7f')[0].style.display = 'none'
            document.querySelectorAll('.dsne8k7f')[1].style.display = 'none'
            window.i = 0
        })
    }
    const screenshotFn = async () => {
        // Xác định vùng bao quanh element đang muốn chụp bao gồm: toạ độ (x, y) kích thước (w, h)
        const boundingBoxElement = await page.evaluate(async () => {
            // List bài post chính là danh sách children của wrapper aghb5jc5 
            const listData = document.querySelectorAll('.aghb5jc5')[0].children
            if (window.i !== 0)
                listData[window.i - 1].style.display = 'none'
            // Đưa bài post cần lấy vào vị trí thuận lợi nhất để có thể screenshot.
            await listData[window.i].scrollIntoView()
            // Trả về vùng bao quanh
            const {
                x,y,width,height } = await listData[window.i++].getBoundingClientRect()
            return {
               x, y, width, height
            }
        })
        // Thực hiện screenshot sau khi đã có đầy đủ thông tin.
        await page.waitFor(1000)
        await page.screenshot({
            path: `picture_${i++}.png`,
            clip: {
                x: boundingBoxElement.x,
                y: 73, // Mình cố tình ẩn những element trước đó đi nên y luôn là 73 - vị trí đắc địa cho screenshot
                width: boundingBoxElement.width,
                height: boundingBoxElement.height,
            },
        });
    }

    await login()
    await clear()
    let i = 0
    for (let j = 0; j < 10; j++) {
        await screenshotFn()
    }
})();