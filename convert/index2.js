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
        <script>{{INSERT_CODE}}</script>
    </body>
</html>
`
    
    console.log( 'MINIFY & BASE64 ENCODING' )

    console.log( '> Load JS.')
    let j = fs.readFileSync( config['path']['from'], 'utf-8' )
    j = j.replace( "'load_from_file': true,", "'load_from_file': false,")


    const types = [ 'with_replace', 'without_replace' ]
        .forEach( async( _type, index ) => {
            let js = j
            if( _type === 'with_replace' ) {
                replaces
                    .forEach( ( r, index ) => {
                        js = js.replaceAll( r, `__${index}` )
                    } )
            }

            const minifiedJs = await minify.js( js, config['minify_options'] )

            const html = template.replace( /{{INSERT_CODE}}/, minifiedJs )
        
            const html_buffer = Buffer.from( html ).toString( 'base64' )
            const html_size = Math.floor( ( new TextEncoder().encode( html_buffer ).length / 1000 ) ) + ' kb'
            console.log( `> Size after minifying:      ${html_size}`)
        
            const dataUrl = `data:text/html;base64,${html_buffer}`
        
        
            fs.writeFileSync( `${config['path']['to_encoded']}-${_type}`, dataUrl, 'utf-8' )
            fs.writeFileSync( `${config['path']['to_readable']}-${_type}`, html, 'utf-8' )
        })



    return true
}

const config = {
    'path': {
        'from': './version/7-class/index-class.js',
        'to_encoded': './convert/result/result-encoded.html',
        'to_readable': './convert/result/result-readable.html'
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

const replaces = [
    'Vector3',
    'Triangle',
    'Mesh',
    'Mat4x4',
    'Vector',
    'dotProduct',
    'normalise',
    'crossProduct',
    'intersectPlane',
    'multiplyVector',
    'makeIdentity',
    'makeRotationX',
    'makeRotationY',
    'makeRotationZ',
    'makeTranslation',
    'makeProjection',
    'multiplyMatrix',
    'fFovDegrees',
    'fAspectRatio',
    'fAngleRad',
    'plane_p',
    'plane_n',
    'lineStart',
    'lineEnd',
    'pointAt',
    'quickInverse',
    'Triangle_ClipAgainstPlane',
    'RenderEngine',
    'initCamera',
    'initEventListener',
    'points',
    'onUserCreate',
    'onUserUpdate',
    'screenHeight',
    'screenWidth',
    'matProj',
    'MeshCube',
    'fElapsedTime',
    'screenWidth',
    'screenHeight',
    'matWorld',
    'drawTriangleSVG',
    'renderScreen',
    'initRender',
    'config'
]


main()
    .then( a => console.log( a ) )
    .catch( e => console.log( e ) )