class Vector3 {
    constructor( x, y, z ) {
        this.x = x
        this.y = y
        this.z = z
    }
}
 

class Triangle {
    constructor( p0x, p0y, p0z, p1x, p1y, p1z, p2x, p2y, p2z ) {
        this.p0 = new Vector3( p0x, p0y, p0z )
        this.p1 = new Vector3( p1x, p1y, p1z )
        this.p2 = new Vector3( p2x, p2y, p2z )
        this.color = 0
    }
}


class Mesh {
    constructor( group ) {
        this.tris = []
        group.forEach( p => {
            let tmp = new Triangle( p[ 0 ], p[ 1 ], p[ 2 ], p[ 3 ], p[ 4 ], p[ 5 ], p[ 6 ], p[ 7 ], p[ 8 ] )
            this.tris.push( tmp )
        } )
    }
}


class Mat4x4 {
    constructor() {
        this.m = new Array( 4 ).fill( 0 ).map( () => new Array( 4 ).fill( 0 ) )
    }
}


function multiplyMatrixVector( i, m ) {
    const o = new Vector3()
    o.x = i.x * m.m[ 0 ][ 0 ] + i.y * m.m[ 1 ][ 0 ] + i.z * m.m[ 2 ][ 0 ] + m.m[ 3 ][ 0 ]
    o.y = i.x * m.m[ 0 ][ 1 ] + i.y * m.m[ 1 ][ 1 ] + i.z * m.m[ 2 ][ 1 ] + m.m[ 3 ][ 1 ]
    o.z = i.x * m.m[ 0 ][ 2 ] + i.y * m.m[ 1 ][ 2 ] + i.z * m.m[ 2 ][ 2 ] + m.m[ 3 ][ 2 ]
    const w = i.x * m.m[ 0 ][ 3 ] + i.y * m.m[ 1 ][ 3 ] + i.z * m.m[ 2 ][ 3 ] + m.m[ 3 ][ 3 ]

    //console.log( `w: ${w}, o: ${o}`)
    if(w !== 0.0 ) {
        o.x = o.x / w
        o.y = o.y / w 
        o.z = o.z / w
    }
    return o
}

function drawTriangle( tri ) {
    // console.log( `p0.x: ${p0.x}, p0.y: ${p0.y}, p1.x: ${p1.x}, p1.y: ${p1.y}, p2.x: ${p2.x}, p2.y: ${p2.y}`)
    
   // let region = new Path2D();
   ctx.beginPath()
    ctx.moveTo( tri.p0.x, tri.p0.y )
    ctx.lineTo( tri.p1.x, tri.p1.y )
    ctx.lineTo( tri.p2.x, tri.p2.y )
    ctx.lineTo( tri.p0.x, tri.p0.y )
    ctx.closePath()

    ctx.fillStyle = `rgb(${tri.color},${tri.color},${tri.color})`
    ctx.stroke()
    ctx.fill( )
}

function drawTriangleSVG( tri ) {
    return `<polygon points="${tri.p0.x},${tri.p0.y} ${tri.p1.x},${tri.p1.y} ${tri.p2.x},${tri.p2.y}" stroke="${config['style']['stroke']['color']}" fill="rgb(${tri.color}, ${tri.color}, ${tri.color})" stroke-width="${config['style']['stroke']['width']}"
    stroke-linecap="butt" stroke-linejoin="round" class="triangle" />`
}


function meshCube() {
    let result = [
        [ 0.0, 0.0, 0.0,    0.0, 1.0, 0.0,    1.0, 1.0, 0.0 ],
        [ 0.0, 0.0, 0.0,    1.0, 1.0, 0.0,    1.0, 0.0, 0.0 ],

        // EAST                                                      
        [ 1.0, 0.0, 0.0,    1.0, 1.0, 0.0,    1.0, 1.0, 1.0 ],
        [ 1.0, 0.0, 0.0,    1.0, 1.0, 1.0,    1.0, 0.0, 1.0 ],

        // NORTH                                                     
        [ 1.0, 0.0, 1.0,    1.0, 1.0, 1.0,    0.0, 1.0, 1.0 ],
        [ 1.0, 0.0, 1.0,    0.0, 1.0, 1.0,    0.0, 0.0, 1.0 ],

        // WEST                                                      
        [ 0.0, 0.0, 1.0,    0.0, 1.0, 1.0,    0.0, 1.0, 0.0 ],
        [ 0.0, 0.0, 1.0,    0.0, 1.0, 0.0,    0.0, 0.0, 0.0 ],

        // TOP                                                       
        [ 0.0, 1.0, 0.0,    0.0, 1.0, 1.0,    1.0, 1.0, 1.0 ],
        [ 0.0, 1.0, 0.0,    1.0, 1.0, 1.0,    1.0, 1.0, 0.0 ],

        // BOTTOM                                                    
        [ 1.0, 0.0, 1.0,    0.0, 0.0, 1.0,    0.0, 0.0, 0.0 ],
        [ 1.0, 0.0, 1.0,    0.0, 0.0, 0.0,    1.0, 0.0, 0.0 ]
    ]

    return result
}


function meshLoader( str ) {
    let lines = str.split( "\n" )
    let points = []
    let faces = []

    lines.forEach( ( line ) => {
        if( line.startsWith( 'v ' ) ) {
            let a = line.split( ' ' )
            a.shift()
            a = a.map( n => parseFloat( n ) )
            points.push( a )
        }

        if( line.startsWith( 'f ' ) ) {
            let a = line.split( ' ' )
            a.shift()
            a = a.map( n => parseFloat( n ) )
            // console.log( a )
            faces.push( a )
        }
    } )

    let norm = {
        'x' : {
            'a': points.map( p => p[ 0 ] ),
            'min': null,
            'max': null,
            'delta': null
        },
        'y' : {
            'a': points.map( p => p[ 1 ] ),
            'min': null,
            'max': null,
            'delta': null
        },
        'z': {
            'a': points.map( p => p[ 2 ] ),
            'min': null,
            'max': null,
            'delta': null
        }
    }

    let t = [ [ 'x', 'y', 'z' ], [ 'min', 'max' ] ]
    t[ 0 ].forEach( ( pos ) => {
        t[ 1 ].forEach( ( type ) => {
            switch( type ) {
                case 'min':
                    norm[ pos ][ type ] = Math.min( ...norm[ pos ]['a'] )
                    break;
                case 'max':
                    norm[ pos ][ type ] = Math.max( ...norm[ pos ]['a'] )
                    break;
            }
        } )
        norm[ pos ]['delta'] = norm[ pos ]['max'] - norm[ pos ]['min']
    } )

    for( let i = 0; i < points.length; i++ ) {
        points[ i ][ 0 ] = ( points[ i ][ 0 ] - norm['x']['min'] ) / norm['x']['delta']
        points[ i ][ 1 ] = ( points[ i ][ 1 ] - norm['y']['min'] ) / norm['y']['delta']
        points[ i ][ 2 ] = ( points[ i ][ 2 ] - norm['z']['min'] ) / norm['z']['delta']

        //  console.log( points[ i ][ 0 ])
        //  points[ i ][ 0 ] = points[ i ][ 0 ].toFixed(8)
        //  points[ i ][ 1 ] = points[ i ][ 1 ].toFixed(8)
        //  points[ i ][ 2 ] = points[ i ][ 2 ].toFixed(8)
        //  console.log( points[ i ][ 0 ])
    }


    let result = faces.map( face => {
        return [ 
            points[ face[ 0 ]-1 ][ 0 ], points[ face[ 0 ]-1 ][ 1 ], points[ face[ 0 ]-1 ][ 2 ], 
            points[ face[ 1 ]-1 ][ 0 ], points[ face[ 1 ]-1 ][ 1 ], points[ face[ 1 ]-1 ][ 2 ], 
            points[ face[ 2 ]-1 ][ 0 ], points[ face[ 2 ]-1 ][ 1 ], points[ face[ 2 ]-1 ][ 2 ]
        ]
    } )

    console.log( result[ 0 ])

    return result
}


function onUserUpdate( { MeshCube, fElapsedTime, screenWidth, screenHeight } ) {
    const fNear = config['camera']['fNear']
    const fFar = config['camera']['fFar']
    const fFov = config['camera']['fFov']
    const fAspectRatio = screenHeight / screenWidth
    const fFovRad = 1.0 / Math.tan( fFov * 0.5 / 180.0 * 3.14159 )
    const fTheta = 1.0 * fElapsedTime

    const matRotZ = new Mat4x4()
    matRotZ.m[ 0 ][ 0 ] = Math.cos( fTheta )
    matRotZ.m[ 0 ][ 1 ] = Math.sin( fTheta )
    matRotZ.m[ 1 ][ 0 ] = -Math.sin( fTheta )
    matRotZ.m[ 1 ][ 1 ] = Math.cos( fTheta )
    matRotZ.m[ 2 ][ 2 ] = 1;
    matRotZ.m[ 3 ][ 3 ] = 1;

    const matRotX = new Mat4x4()
    matRotX.m[ 0 ][ 0 ] = 1;
    matRotX.m[ 1 ][ 1 ] = Math.cos( fTheta * 0.5 )
    matRotX.m[ 1 ][ 2 ] = Math.sin( fTheta * 0.5 )
    matRotX.m[ 2 ][ 1 ] = -Math.sin( fTheta * 0.5 )
    matRotX.m[ 2 ][ 2 ] = Math.cos( fTheta * 0.5 );
    matRotX.m[ 3 ][ 3 ] = 1;

    const matProj = new Mat4x4()
    matProj.m[ 0 ][ 0 ] = fAspectRatio * fFovRad
    matProj.m[ 1 ][ 1 ] = fFovRad
    matProj.m[ 2 ][ 2 ] = fFar / ( fFar - fNear )
    matProj.m[ 3 ][ 2 ] = ( -fFar * fNear ) / ( fFar - fNear )
    matProj.m[ 2 ][ 3 ] = 1.0
    matProj.m[ 3 ][ 3 ] = 0.0

    let svgs = []
    MeshCube.tris.forEach( tri => {
        const triTranslated = new Triangle()
        const triProjected = new Triangle()
        const triRotatedZ = new Triangle()
        const triRotatedZX = new Triangle()

        // Rotate in Z-Axis
        triRotatedZ.p0 = multiplyMatrixVector( tri.p0, matRotZ )
        triRotatedZ.p1 = multiplyMatrixVector( tri.p1, matRotZ )
        triRotatedZ.p2 = multiplyMatrixVector( tri.p2, matRotZ )

        // Rotate in X-Axis
        triRotatedZX.p0 = multiplyMatrixVector( triRotatedZ.p0, matRotX )
        triRotatedZX.p1 = multiplyMatrixVector( triRotatedZ.p1, matRotX )
        triRotatedZX.p2 = multiplyMatrixVector( triRotatedZ.p2, matRotX )

        // Translate
        triTranslated.p0 = triRotatedZX.p0
        triTranslated.p1 = triRotatedZX.p1
        triTranslated.p2 = triRotatedZX.p2

        triTranslated.p0.z = tri.p0.z + 3.0
        triTranslated.p1.z = tri.p1.z + 3.0
        triTranslated.p2.z = tri.p2.z + 3.0

        const normal = new Vector3()
        const line1 = new Vector3()
        const line2 = new Vector3()

        line1.x = triTranslated.p1.x - triTranslated.p0.x
        line1.y = triTranslated.p1.y - triTranslated.p0.y
        line1.z = triTranslated.p1.z - triTranslated.p0.z

        line2.x = triTranslated.p2.x - triTranslated.p0.x
        line2.y = triTranslated.p2.y - triTranslated.p0.y
        line2.z = triTranslated.p2.z - triTranslated.p0.z

        normal.x = line1.y * line2.z - line1.z * line2.y
        normal.y = line1.z * line2.x - line1.x * line2.z
        normal.z = line1.x * line2.y - line1.y * line2.x

        const l = Math.sqrt( normal.x * normal.x + normal.y * normal.y + normal.z * normal.z )
        normal.x /= l
        normal.y /= l 
        normal.z /= l

        //if( normal.z < 0 ) {
        if( 
            normal.x * ( triTranslated.p0.x - vCamera.x ) +
            normal.y * ( triTranslated.p0.y - vCamera.y ) +
            normal.z * ( triTranslated.p0.z - vCamera.z ) < 0.0
        ) {
            const light_direction = new Vector3( 0.0, 0.0, -1.0 )
            const l1 = Math.sqrt( light_direction.x * light_direction.x + light_direction.y * light_direction.y + light_direction.z * light_direction.z )
            light_direction.x /= l1
            light_direction.y /= l1
            light_direction.z /= l1
            const dp = normal.x * light_direction.x + normal.y * light_direction.y + normal.z * light_direction.z
            triProjected.color  = Math.floor( dp * config['style']['shadow']['range'] )

            triProjected.p0 = multiplyMatrixVector( triTranslated.p0, matProj )
            triProjected.p1 = multiplyMatrixVector( triTranslated.p1, matProj )
            triProjected.p2 = multiplyMatrixVector( triTranslated.p2, matProj )
    
            triProjected.p0.x += 1.0; triProjected.p0.y += 1.0
            triProjected.p1.x += 1.0; triProjected.p1.y += 1.0
            triProjected.p2.x += 1.0; triProjected.p2.y += 1.0
    
            triProjected.p0.x *= (config['mesh']['scale'] * screenWidth).toFixed(8)
            triProjected.p0.y *= (config['mesh']['scale'] * screenHeight).toFixed(8)
            triProjected.p1.x *= (config['mesh']['scale'] * screenWidth).toFixed(8)
            triProjected.p1.y *= (config['mesh']['scale'] * screenHeight).toFixed(8)
            triProjected.p2.x *= (config['mesh']['scale'] * screenWidth).toFixed(8)
            triProjected.p2.y *= (config['mesh']['scale'] * screenHeight).toFixed(8)
    
            drawTriangle( triProjected )
            svgs.push ( drawTriangleSVG( triProjected ) )
        }

    } ) 
    return svgs
}



// https://www.youtube.com/watch?v=XgMWc6LumG4

const config = {
    'render': {
        'animate': 10,
        'elapse_time': 0.01
    },
    'mesh': {
        'file': 'assets/convert/connector.obj',
        'load_from_file': true,
        'scale': 0.7
    },
    'canvas': {
        'width': null,
        'height': null
    },
    'camera': {
        'position': {
            'x': 0.0,
            'y': 0.0,
            'z': 0.0
        },
        'fNear': 0.45,
        'fFar': 100.0,
        'fFov': 300.0
    },
    'style': {
        'color': {
            'background': 'white',
        },
        'stroke': {
            'width': 1,
            'color': 'black'
        },
        'shadow': {
            'range': 200
        }
    }
}



var vCamera = new Vector3( 
    config['camera']['position']['x'], 
    config['camera']['position']['y'], 
    config['camera']['position']['z'] 
)

var canvas = document.getElementById( '3d' )
config['canvas']['width'] = canvas.width
config['canvas']['height'] = canvas.height

var svg = document.getElementById( '2d' )
var ctx = canvas.getContext( '2d' )


fetch( config['mesh']['file'] )
.then( response => response.text() )
.then( file => {
    let a = null
    config['mesh']['load_from_file'] ? a = meshLoader( file ) : a = meshCube()
    const mesh = new Mesh( a )
    return Promise.resolve( mesh )
} )
.then( mesh => {
    
    ctx.fillStyle = config['style']['color']['background']
    ctx.fillRect( 0, 0, config['canvas']['width'], config['canvas']['height'] )
    ctx.lineWidth = config['style']['stroke']['width']
    ctx.strokeStyle = config['style']['stroke']['color']
    
    let elapsedTime = 0.0
    const interval = window.setInterval( () => { 
            elapsedTime += config['render']['elapse_time']
            //ctx.clearRect( 0, 0, config['canvas']['width'], config['canvas']['height'] )
            ctx.fillStyle = config['style']['color']['background']
            ctx.fillRect( 0, 0, config['canvas']['width'], config['canvas']['height']);
            let svgs = onUserUpdate( {
                'MeshCube': mesh,
                'fElapsedTime': elapsedTime,
                'screenWidth': config['canvas']['width'],
                'screenHeight': config['canvas']['height']
            } ) 
            svg.innerHTML = svgs.join( "\n" )
        }, 
        config['render']['animate'] 
    )
} )