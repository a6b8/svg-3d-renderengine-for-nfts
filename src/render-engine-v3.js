class Vector3 {
    constructor( x, y, z ) {
        this.x = x
        this.y = y
        this.z = z
        this.w = 1
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


function Matrix_MultiplyVector( m, i ) {
    const v = new Vector3
    v.x = i.x * m.m[ 0 ][ 0 ] + i.y * m.m[ 1 ][ 0 ] + i.z * m.m[ 2 ][ 0 ] + i.w * m.m[ 3 ][ 0 ]
    v.y = i.x * m.m[ 0 ][ 1 ] + i.y * m.m[ 1 ][ 1 ] + i.z * m.m[ 2 ][ 1 ] + i.w * m.m[ 3 ][ 1 ]
    v.z = i.x * m.m[ 0 ][ 2 ] + i.y * m.m[ 1 ][ 2 ] + i.z * m.m[ 2 ][ 2 ] + i.w * m.m[ 3 ][ 2 ]
    v.w = i.x * m.m[ 0 ][ 3 ] + i.y * m.m[ 1 ][ 3 ] + i.z * m.m[ 2 ][ 3 ] + i.w * m.m[ 3 ][ 3 ]
    return v
}


function Matrix_MakeIdentity() {
    const matrix = new Mat4x4()
    matrix.m[ 0 ][ 0 ] = 1.0
    matrix.m[ 1 ][ 1 ] = 1.0
    matrix.m[ 2 ][ 2 ] = 1.0
    matrix.m[ 3 ][ 3 ] = 1.0
    return matrix
}


function Matrix_MakeRotationX( fAngleRad ) {
    const matrix = new Mat4x4()
    matrix.m[ 0 ][ 0 ] = 1.0
    matrix.m[ 1 ][ 1 ] = Math.cos( fAngleRad )
    matrix.m[ 1 ][ 2 ] = Math.sin( fAngleRad )
    matrix.m[ 2 ][ 1 ] = -Math.sin( fAngleRad )
    matrix.m[ 2 ][ 2 ] = Math.cos( fAngleRad )
    matrix.m[ 3 ][ 3 ] = 1.0
    return matrix;
}


function Matrix_MakeRotationY( fAngleRad ) {
    const matrix = new Mat4x4()
    matrix.m[ 0 ][ 0 ] = Math.cos( fAngleRad )
    matrix.m[ 0 ][ 2 ] = Math.sin( fAngleRad )
    matrix.m[ 2 ][ 0 ] = -Math.sin( fAngleRad )
    matrix.m[ 1 ][ 1 ] = 1.0
    matrix.m[ 2 ][ 2 ] = Math.cos( fAngleRad )
    matrix.m[ 3 ][ 3 ] = 1.0
    return matrix
}


function Matrix_MakeRotationZ( fAngleRad ) {
    const matrix = new Mat4x4()
    matrix.m[ 0 ][ 0 ] = Math.cos( fAngleRad )
    matrix.m[ 0 ][ 1 ] = Math.sin( fAngleRad )
    matrix.m[ 1 ][ 0 ] = -Math.sin( fAngleRad )
    matrix.m[ 1 ][ 1 ] = Math.cos( fAngleRad )
    matrix.m[ 2 ][ 2 ] = 1.0
    matrix.m[ 3 ][ 3 ] = 1.0
    return matrix
}


function Matrix_MakeTranslation( x, y, z ) {
    const matrix = new Mat4x4()
    matrix.m[ 0 ][ 0 ] = 1.0
    matrix.m[ 1 ][ 1 ] = 1.0
    matrix.m[ 2 ][ 2 ] = 1.0
    matrix.m[ 3 ][ 3 ] = 1.0
    matrix.m[ 3 ][ 0 ] = x
    matrix.m[ 3 ][ 1 ] = y
    matrix.m[ 3 ][ 2 ] = z
    return matrix
}


function Matrix_MakeProjection( fFovDegrees, fAspectRatio, fNear, fFar) {
    const fFovRad = 1.0 / Math.tan( fFovDegrees * 0.5 / 180.0 * 3.14159 )
    const matrix = new Mat4x4()
    matrix.m[ 0 ][ 0 ] = fAspectRatio * fFovRad
    matrix.m[ 1 ][ 1 ] = fFovRad
    matrix.m[ 2 ][ 2 ] = fFar / ( fFar - fNear )
    matrix.m[ 3 ][ 2 ] = ( -fFar * fNear) / ( fFar - fNear )
    matrix.m[ 2 ][ 3 ] = 1.0
    matrix.m[ 3 ][ 3 ] = 0.0
    return matrix
}


function Matrix_MultiplyMatrix( m1, m2 ) {
    const matrix = new Mat4x4()
    for( let c = 0; c < 4; c++ ) {
        for( let r = 0; r < 4; r++ ) {
            matrix.m[ r ][ c ] = m1.m[ r ][ 0 ] * m2.m[ 0 ][ c ] + m1.m[ r ][ 1 ] * m2.m[ 1 ][ c ] + m1.m[ r ][ 2 ] * m2.m[ 2 ][ c ] + m1.m[ r ][ 3 ] * m2.m[ 3 ][ c ]
        }
    }
    return matrix
}


function Matrix_PointAt( pos, target, up ) {
    const newForward = Vector_Sub( target, pos )
    newForward = Vector_Normalise( newForward )
    const a = Vector_Mul( newForward, Vector_DotProduct( up, newForward ) )
    let newUp = Vector_Sub( up, a )
    newUp = Vector_Normalise( newUp )

    const newRight = Vector_CrossProduct( newUp, newForward )
    const matrix = new Mat4x4()
    matrix.m[ 0 ][ 0 ] = newRight.x; matrix.m[ 0 ][ 1 ] = newRight.y; matrix.m[ 0 ][ 2 ] = newRight.z; matrix.m[ 0 ][ 3 ] = 0.0;
    matrix.m[ 1 ][ 0 ] = newUp.x; matrix.m[ 1 ][ 1 ] = newUp.y;	matrix.m[ 1 ][ 2 ] = newUp.z; matrix.m[ 1 ][ 3 ] = 0.0;
    matrix.m[ 2 ][ 0 ] = newForward.x; matrix.m[ 2 ][ 1 ] = newForward.y; matrix.m[ 2 ][ 2 ] = newForward.z; matrix.m[ 2 ][ 3 ] = 0.0;
    matrix.m[ 3 ][ 0 ] = pos.x;	matrix.m[ 3 ][ 1 ] = pos.y;	
    return matrix
}


function Matrix_QuickInverse( m ) {
    const matrix = new Mat4x4()
    matrix.m[ 0 ][ 0 ] = m.m[ 0 ][ 0 ]; matrix.m[ 0 ][ 1 ] = m.m[ 1 ][ 0 ]; matrix.m[ 0 ][ 2 ] = m.m[ 2 ][ 0 ]; matrix.m[ 0 ][ 3 ] = 0.0
    matrix.m[ 1 ][ 0 ] = m.m[ 0 ][ 1 ]; matrix.m[ 1 ][ 1 ] = m.m[ 1 ][ 1 ]; matrix.m[ 1 ][ 2 ] = m.m[ 2 ][ 1 ]; matrix.m[ 1 ][ 3 ] = 0.0
    matrix.m[ 2 ][ 0 ] = m.m[ 0 ][ 2 ]; matrix.m[ 2 ][ 1 ] = m.m[ 1 ][ 2 ]; matrix.m[ 2 ][ 2 ] = m.m[ 2 ][ 2 ]; matrix.m[ 2 ][ 3 ] = 0.0
    matrix.m[ 3 ][ 0 ] = -( m.m[ 3 ][ 0 ] * matrix.m[ 0 ][ 0 ] + m.m[ 3 ][ 1 ] * matrix.m[ 1 ][ 0 ] + m.m[ 3 ][ 2 ] * matrix.m[ 2 ][ 0 ] )
    matrix.m[ 3 ][ 1 ] = -( m.m[ 3 ][ 0 ] * matrix.m[ 0 ][ 1 ] + m.m[ 3 ][ 1 ] * matrix.m[ 1 ][ 1 ] + m.m[ 3 ][ 2 ] * matrix.m[ 2 ][ 1 ] )
    matrix.m[ 3 ][ 2 ] = -( m.m[ 3 ][ 0 ] * matrix.m[ 0 ][ 2 ] + m.m[ 3 ][ 1 ] * matrix.m[ 1 ][ 2 ] + m.m[ 3 ][ 2 ] * matrix.m[ 2 ][ 2 ] )
    matrix.m[ 3 ][ 3 ] = 1.0
    return matrix
}

function Vector_Add( v1, v2 ) {
    return new Vector3( v1.x + v2.x, v1.y + v2.y, v1.z + v2.z )
}

function Vector_Sub( v1, v2 ) {
    return new Vector3( v1.x - v2.x, v1.y - v2.y, v1.z - v2.z )
}

function Vector_Mul( v1, k ) {
    return new Vector3( v1.x * k, v1.y * k, v1.z * k )
}

function Vector_Div( v1, k ) {
    return new Vector3( v1.x / k, v1.y / k, v1.z / k )
}

function Vector_DotProduct( v1, v2 ) {
    return ( v1.x * v2.x + v1.y * v2.y + v1.z * v2.z )
}

function Vector_Length( v ) {
    return Math.sqrt( Vector_DotProduct( v, v ) )
}

function Vector_Normalise( v ) {
    const l = Vector_Length( v )
    return new Vector3( v.x / l, v.y / l, v.z / l )
}

function Vector_CrossProduct( v1, v2 ) {
    const v = new Vector3(
        v1.y * v2.z - v1.z * v2.y,
        v1.z * v2.x - v1.x * v2.z,
        v1.x * v2.y - v1.y * v2.x
    )
    return v
}

function Vector_IntersectPlane( plane_p, plane_n, lineStart, lineEnd ) {
    plane_n = Vector_Normalise( plane_n )
    const plane_d = -Vector_DotProduct( plane_n, plane_p )
    const ad = Vector_DotProduct( lineStart, plane_n )
    const bd = Vector_DotProduct( lineEnd, plane_n )
    const t = ( -plane_d - ad ) / ( bd - ad )
    const lineStartToEnd = Vector_Sub( lineEnd, lineStart )
    const lineToIntersect =  Vector_Mul( lineStartToEnd, t )
    return Vector_Add( lineStart, lineToIntersect )
}


function Triangle_ClipAgainstPlane( plane_p, plane_n, in_tri, out_tri1, out_tri2 ) {
    function dist( p ) {
        const n = Vector_Normalise( p )
        return ( plane_n.x * p.x + plane_n.y * p.y + plane_n.z * p.z - Vector_DotProduct( plane_n, plane_p ) )
    }

    plane_n = Vector_Normalise( plane_n )
    let inside_points = new Array( 3 )
    let nInsidePointCount = 0
    let outside_points = new Array( 3 )
    let nOutsidePointCount = 0

    const d0 = dist( in_tri.p0 )
    const d1 = dist( in_tri.p1 )
    const d2 = dist( in_tri.p2 )

    if( d0 >= 0 ) { inside_points[ nInsidePointCount++ ] = in_tri.p0 }
    else { outside_points[ nOutsidePointCount++ ] = in_tri.p0 }

    if( d1 >= 0 ) { inside_points[ nInsidePointCount++ ] = in_tri.p1 }
    else { outside_points[ nOutsidePointCount++ ] = in_tri.p1 }

    if( d2 >= 0) { inside_points[ nInsidePointCount++ ] = in_tri.p2 }
    else { outside_points[ nOutsidePointCount++ ] = in_tri.p2 }

    if( nInsidePointCount == 0 ) { return 0 }

    if( nInsidePointCount == 3 ) { 
        out_tri1 = in_tri
        return 1
    }

    if( nInsidePointCount == 1 && nOutsidePointCount == 2 ) {
        out_tri1.color =  in_tri.color
        out_tri1.p0 = inside_points[ 0 ]

        out_tri1.p1 = Vector_IntersectPlane( plane_p, plane_n, inside_points[ 0 ], outside_points[ 0 ] )
        out_tri1.p2 = Vector_IntersectPlane( plane_p, plane_n, inside_points[ 0 ], outside_points[ 1 ] )
        return 1
    }

    if (nInsidePointCount == 2 && nOutsidePointCount == 1) {
        out_tri1.color =  in_tri.color
        out_tri2.color =  in_tri.color

        out_tri1.p0 = inside_points[ 0 ]
		out_tri1.p1 = inside_points[ 1 ]

        out_tri1.p2 = Vector_IntersectPlane( plane_p, plane_n, inside_points[ 0 ], outside_points[ 0 ] )
        out_tri2.p0 = inside_points[ 1 ]
        out_tri2.p1 = out_tri1.p2
        out_tri2.p2 = Vector_IntersectPlane( plane_p, plane_n, inside_points[ 1 ], outside_points[ 0 ] )
        return 2
    }
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

function onUserCreate( { screenHeight, screenWidth } ) {
    const matProj = Matrix_MakeProjection(
        90.0, 
        screenHeight / screenWidth, 
        0.1, 
        1000.0
    )
    return matProj
}


function onUserUpdate( { matProj, MeshCube, fElapsedTime, screenWidth, screenHeight } ) {
    const fTheta = 1.0 //* fElapsedTime
    const matRotZ = Matrix_MakeRotationZ( fTheta * 0.5 )
    const matRotX = Matrix_MakeRotationX( fTheta )

    const matTrans = Matrix_MakeTranslation( 0.0, 0.0, 5.0 )

    let matWorld = new Mat4x4()
    matWorld = Matrix_MakeIdentity()
    matWorld = Matrix_MultiplyMatrix( matRotZ, matRotX )
    matWorld = Matrix_MultiplyMatrix( matWorld, matTrans )

   // vLookDir.x = 0; vLookDir.y = 0; vLookDir.z = 1;  
   // const vUp = new Vector3( 0, 1, 0 )
   // const vTarget = Vector_Add( vCamera, vLookDir )

   // const matCamera = Matrix_PointAt( vCamera, vTarget, vUp )
   // const matView = Matrix_QuickInverse( matCamera )

    let svgs = []
    MeshCube.tris.forEach( tri => {
        const triProjected = new Triangle()
        const triTransformed = new Triangle()
        const triViewed = new Triangle()

        triTransformed.p0 = Matrix_MultiplyVector( matWorld, tri.p0 )
        triTransformed.p1 = Matrix_MultiplyVector( matWorld, tri.p1 )
        triTransformed.p2 = Matrix_MultiplyVector( matWorld, tri.p2 )

        const line1 = Vector_Sub( triTransformed.p1, triTransformed.p0 )
        const line2 = Vector_Sub( triTransformed.p2, triTransformed.p0 )
        let normal = Vector_CrossProduct( line1, line2 )
        normal = Vector_Normalise( normal )

        const vCameraRay = Vector_Sub( triTransformed.p0, vCamera )
        if( Vector_DotProduct( normal, vCameraRay ) < 0.0 ) {

            let light_direction = new Vector3( 0.0, 1.0, -1.0 )
            light_direction = Vector_Normalise( light_direction )
            
            const dp = Math.max( 0.1, Vector_DotProduct( light_direction, normal ) )

            triTransformed.color  = Math.floor( dp * config['style']['shadow']['range'] )

            triProjected.p0 = Matrix_MultiplyVector( matProj, triTransformed.p0 )
            triProjected.p1 = Matrix_MultiplyVector( matProj, triTransformed.p1 )
            triProjected.p2 = Matrix_MultiplyVector( matProj, triTransformed.p2 )
            triProjected.color = triTransformed.color

    
            triProjected.p0 = Vector_Div( triProjected.p0, triProjected.p0.w )
            triProjected.p1 = Vector_Div( triProjected.p1, triProjected.p1.w )
            triProjected.p2 = Vector_Div( triProjected.p2, triProjected.p2.w )


            const vOffsetView = new Vector3( 1, 1, 0 )

            triProjected.p0 = Vector_Add( triProjected.p0, vOffsetView )
            triProjected.p1 = Vector_Add( triProjected.p1, vOffsetView )
            triProjected.p2 = Vector_Add( triProjected.p2, vOffsetView )

            triProjected.p0.x *= config['mesh']['scale'] * screenWidth
            triProjected.p0.y *= config['mesh']['scale'] * screenHeight
            triProjected.p1.x *= config['mesh']['scale'] * screenWidth
            triProjected.p1.y *= config['mesh']['scale'] * screenHeight
            triProjected.p2.x *= config['mesh']['scale'] * screenWidth
            triProjected.p2.y *= config['mesh']['scale'] * screenHeight
    
            let t = [ [ 'p0', 'p1', 'p2' ], [ 'x', 'y', 'z' ] ]
            t[ 0 ].forEach( tri => {
                t[ 1 ].forEach( pos => {
                    triProjected[ tri ][ pos ] = Number
                        .parseFloat( triProjected[ tri ][ pos ] )
                        .toFixed( config['mesh']['float_size'] )
                } )
            } )

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
        'file': 'assets/convert/polyhedron.obj',
        'load_from_file': true,
        'scale': 0.7,
        'float_size': 0
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
            'background': 'lightGrey',
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

var vLookDir = new Vector3()

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
    const matProj = onUserCreate( { 
        screenHeight: config['canvas']['height'], 
        screenWidth: config['canvas']['width'] 
    } )

    const interval = window.setInterval( () => { 
            elapsedTime += config['render']['elapse_time']
            //ctx.clearRect( 0, 0, config['canvas']['width'], config['canvas']['height'] )
            ctx.fillStyle = config['style']['color']['background']
            ctx.fillRect( 0, 0, config['canvas']['width'], config['canvas']['height']);
            let svgs = onUserUpdate( {
                'matProj': matProj,
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