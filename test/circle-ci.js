const fs = require( 'fs' )
const puppeteer = require( 'puppeteer' )

try {
  async function test() {
    let js = fs.readFileSync( 
        './src/render-engine-v4.js',
        { encoding: 'utf8' } 
    )

    js = js.replace( "'elapse_time': 0.03", "'elapse_time': 0.00" )
    js = js.replace( "'load_from_file': true", "'load_from_file': false" )

    const template = fs.readFileSync( 
        './test/files/template.html',
        { encoding: 'utf8' } 
    )
    const htmls = template
        .split( '//insert renderengine' )
    htmls.splice( 1, 0, js )
    const html = htmls.join( '' )

    const browser = await puppeteer.launch( { headless: true } )
    const page = await browser.newPage()

    const buff = new Buffer.from( html )
    const base64data = buff.toString( 'base64' )
    const data_str = `data:text/html;base64,${base64data}`

/*
    page
    .on('console', message =>
        console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
    page
    .on('console', message =>
        console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
    .on('pageerror', ({ message }) => console.log(message))
    .on('response', response =>
        console.log(`${response.status()} ${response.url()}`))
    .on('requestfailed', request =>
        console.log(`${request.failure().errorText} ${request.url()}`))
*/

    await page.goto(
        data_str, 
        { waitUntil: [ 'load', 'networkidle0' ] }
    )

    const test = await page.evaluate( () => {
        return document
            .getElementById( '2d' )
            .getElementsByTagName( 'polygon' )
            .length
    } )

    await browser.close()

    if( test > 0 ) {
        console.log( 'Test passed.' )
        process.exit( 0 )
    } else {
        console.log( 'Test not passed.' )
        process.exit( 1 )
    }
  }
  test()
} catch {
    console.log( `An error occurred.` )
    process.exit( 1 )
}