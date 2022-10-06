import { minify } from 'minify'
import fs from 'fs'

async function main() {
    const template = `
<!DOCTYPE html>
<html>
    <header>
    </header>
    <body>
        <svg id="2d" width="400" height="400"></svg>
        <canvas id="3d" width="400" height="400"></canvas>
        <script src="{{INSERT_CODE}}"></script>
    </body>
</html>
`
    
    console.log( 'MINIFY & BASE64 ENCODING' )

    console.log( '> Load JS.')
    const js = fs.readFileSync( config['path']['from'], 'utf-8' )
    const minifiedJs = await minify.js( js, config['minify_options'] )

    const minifiedJs_size = Math.floor( ( new TextEncoder().encode( minifiedJs).length / 1000 ) ) + " kb"
    console.log( `> Size after minifying:      ${minifiedJs_size}`)

    const minifiedJs_buffer = Buffer.from( minifiedJs ).toString( 'base64' )

    const sizeBase64_size = Math.floor( ( new TextEncoder().encode( minifiedJs_buffer ).length / 1000 ) ) + " kb"
    console.log( `> Size after base64:         ${sizeBase64_size}`)

    const dataUrl = `data:text/html;base64,${minifiedJs_buffer}`
    const htmlScript = template.replace( /{{INSERT_CODE}}/, js )

    const htmlScript_buffer = Buffer.from( htmlScript ).toString( 'base64' )
    const htmlScript_size = Math.floor( ( new TextEncoder().encode( htmlScript_buffer ).length / 1000 ) ) + " kb"
    console.log( `> Size with Html:            ${htmlScript_size}`)

    const dataUrl1 = `data:text/html;base64,${htmlScript_buffer}`
    const html2 = template.replace( /{{INSERT_CODE}}/, dataUrl1 )
    const html_buffer = Buffer.from( html2 ).toString( 'base64' )
    const dataUrl2 = `data:text/html;base64,${html_buffer}`

    const html_size = Math.floor( ( new TextEncoder().encode( html_buffer ).length / 1000 ) ) + " kb"
    console.log( `> Size full html:            ${html_size}`)

    fs.writeFileSync( config['path']['to_encoded'], dataUrl2, 'utf-8' )
    fs.writeFileSync( config['path']['to_readable'], html2, 'utf-8' )
    return true
}

const config = {
    'path': {
        'from': './version/7-class/index-class.js',
        'to_encoded': './convert/result-encoded.html',
        'to_readable': './convert/result-readable.html'
    },
    'minify_options': {
        removeComments: true,
        removeCommentsFromCDATA: true,
        removeCDATASectionsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeEmptyElements: false,
        removeOptionalTags: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true,
        js: {
            compress: {
                booleans_as_integers: true,
            }
        },
        html: {
            removeOptionalTags: false,
        }
    }
}

main()
    .then( a => console.log( a ) )
    .catch( e => console.log( e ) )