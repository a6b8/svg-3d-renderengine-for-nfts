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
        group
            .forEach( p => {
                let tmp = new Triangle( 
                    p[ 0 ], p[ 1 ], p[ 2 ], 
                    p[ 3 ], p[ 4 ], p[ 5 ], 
                    p[ 6 ], p[ 7 ], p[ 8 ] 
                )
                this.tris.push( tmp )
            } )
    }
}


class Mat4x4 {
    constructor() {
        this.m = new Array( 4 )
            .fill( 0 )
            .map( () => new Array( 4 ).fill( 0 ) )
    }
}


class Vector {
    add( v1, v2 ) {
        return new Vector3( v1.x + v2.x, v1.y + v2.y, v1.z + v2.z )
    }
    
    sub( v1, v2 ) {
        return new Vector3( v1.x - v2.x, v1.y - v2.y, v1.z - v2.z )
    }
    
    mul( v1, k ) {
        return new Vector3( v1.x * k, v1.y * k, v1.z * k )
    }
    
    div( v1, k ) {
        return new Vector3( v1.x / k, v1.y / k, v1.z / k )
    }
    
    dotProduct( v1, v2 ) {
        return ( v1.x * v2.x + v1.y * v2.y + v1.z * v2.z )
    }
    
    length( v ) {
        return Math.sqrt( this.dotProduct( v, v ) )
    }
    
    normalise( v ) {
        const l = this.length( v )
        return new Vector3( v.x / l, v.y / l, v.z / l )
    }
    
    crossProduct( v1, v2 ) {
        const v = new Vector3(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x
        )
        return v
    }
    
    intersectPlane( plane_p, plane_n, lineStart, lineEnd ) {
        plane_n = vc.normalise( plane_n )
        const plane_d = -dotProduct( plane_n, plane_p )
        const ad = dotProduct( lineStart, plane_n )
        const bd = dotProduct( lineEnd, plane_n )
        const t = ( -plane_d - ad ) / ( bd - ad )
        const lineStartToEnd = vc.sub( lineEnd, lineStart )
        const lineToIntersect =  vc.mul( lineStartToEnd, t )
        return vc.add( lineStart, lineToIntersect )
    }
}


class Matrix {
    constructor() {
        this.vc = new Vector()
    }

    multiplyVector( m, i ) {
        const v = new Vector3
        v.x = i.x * m.m[ 0 ][ 0 ] + i.y * m.m[ 1 ][ 0 ] + i.z * m.m[ 2 ][ 0 ] + i.w * m.m[ 3 ][ 0 ]
        v.y = i.x * m.m[ 0 ][ 1 ] + i.y * m.m[ 1 ][ 1 ] + i.z * m.m[ 2 ][ 1 ] + i.w * m.m[ 3 ][ 1 ]
        v.z = i.x * m.m[ 0 ][ 2 ] + i.y * m.m[ 1 ][ 2 ] + i.z * m.m[ 2 ][ 2 ] + i.w * m.m[ 3 ][ 2 ]
        v.w = i.x * m.m[ 0 ][ 3 ] + i.y * m.m[ 1 ][ 3 ] + i.z * m.m[ 2 ][ 3 ] + i.w * m.m[ 3 ][ 3 ]
        return v
    }


    makeIdentity() {
        const matrix = new Mat4x4()
        matrix.m[ 0 ][ 0 ] = 1.0
        matrix.m[ 1 ][ 1 ] = 1.0
        matrix.m[ 2 ][ 2 ] = 1.0
        matrix.m[ 3 ][ 3 ] = 1.0
        return matrix
    }
    
    
    makeRotationX( fAngleRad ) {
        const matrix = new Mat4x4()
        matrix.m[ 0 ][ 0 ] = 1.0
        matrix.m[ 1 ][ 1 ] = Math.cos( fAngleRad )
        matrix.m[ 1 ][ 2 ] = Math.sin( fAngleRad )
        matrix.m[ 2 ][ 1 ] = -Math.sin( fAngleRad )
        matrix.m[ 2 ][ 2 ] = Math.cos( fAngleRad )
        matrix.m[ 3 ][ 3 ] = 1.0
        return matrix;
    }
    
    
    makeRotationY( fAngleRad ) {
        const matrix = new Mat4x4()
        matrix.m[ 0 ][ 0 ] = Math.cos( fAngleRad )
        matrix.m[ 0 ][ 2 ] = Math.sin( fAngleRad )
        matrix.m[ 2 ][ 0 ] = -Math.sin( fAngleRad )
        matrix.m[ 1 ][ 1 ] = 1.0
        matrix.m[ 2 ][ 2 ] = Math.cos( fAngleRad )
        matrix.m[ 3 ][ 3 ] = 1.0
        return matrix
    }
    
    
    makeRotationZ( fAngleRad ) {
        const matrix = new Mat4x4()
        matrix.m[ 0 ][ 0 ] = Math.cos( fAngleRad )
        matrix.m[ 0 ][ 1 ] = Math.sin( fAngleRad )
        matrix.m[ 1 ][ 0 ] = -Math.sin( fAngleRad )
        matrix.m[ 1 ][ 1 ] = Math.cos( fAngleRad )
        matrix.m[ 2 ][ 2 ] = 1.0
        matrix.m[ 3 ][ 3 ] = 1.0
        return matrix
    }
    
    
    makeTranslation( x, y, z ) {
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
    
    
    makeProjection( fFovDegrees, fAspectRatio, fNear, fFar) {
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
    
    
    multiplyMatrix( m1, m2 ) {
        const matrix = new Mat4x4()
        for( let c = 0; c < 4; c++ ) {
            for( let r = 0; r < 4; r++ ) {
                matrix.m[ r ][ c ] = m1.m[ r ][ 0 ] * m2.m[ 0 ][ c ] + m1.m[ r ][ 1 ] * m2.m[ 1 ][ c ] + m1.m[ r ][ 2 ] * m2.m[ 2 ][ c ] + m1.m[ r ][ 3 ] * m2.m[ 3 ][ c ]
            }
        }
        return matrix
    }
    
    
    pointAt( pos, target, up ) {
        let newForward = this.vc.sub( target, pos )
        newForward = this.vc.normalise( newForward )
        const a = this.vc.mul( newForward, this.vc.dotProduct( up, newForward ) )
        let newUp = this.vc.sub( up, a )
        newUp = this.vc.normalise( newUp )
    
        const newRight = this.vc.crossProduct( newUp, newForward )
        const matrix = new Mat4x4()
        matrix.m[ 0 ][ 0 ] = newRight.x; matrix.m[ 0 ][ 1 ] = newRight.y; matrix.m[ 0 ][ 2 ] = newRight.z; matrix.m[ 0 ][ 3 ] = 0.0;
        matrix.m[ 1 ][ 0 ] = newUp.x; matrix.m[ 1 ][ 1 ] = newUp.y;	matrix.m[ 1 ][ 2 ] = newUp.z; matrix.m[ 1 ][ 3 ] = 0.0;
        matrix.m[ 2 ][ 0 ] = newForward.x; matrix.m[ 2 ][ 1 ] = newForward.y; matrix.m[ 2 ][ 2 ] = newForward.z; matrix.m[ 2 ][ 3 ] = 0.0;
        matrix.m[ 3 ][ 0 ] = pos.x;	matrix.m[ 3 ][ 1 ] = pos.y;	
        return matrix
    }
    
    
    quickInverse( m ) {
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
}


function Triangle_ClipAgainstPlane( plane_p, plane_n, in_tri, out_tri1, out_tri2 ) {
    function dist( p ) {
        const n = vc.normalise( p )
        const r =  ( plane_n.x * p.x + plane_n.y * p.y + plane_n.z * p.z - vc.dotProduct( plane_n, plane_p ) )
        return r
    }

    const vc = new Vector()
    plane_n = vc.normalise( plane_n )
    let inside_points = new Array( 3 ).fill( new Vector3() )
    let nInsidePointCount = 0
    let outside_points = new Array( 3 ).fill( new Vector3() )
    let nOutsidePointCount = 0

    const d0 = dist( in_tri.p0 )
    const d1 = dist( in_tri.p1 )
    const d2 = dist( in_tri.p2 )

    if( d0 >= 0 ) { 
        nInsidePointCount++
        inside_points[ nInsidePointCount ] = in_tri.p0 
    } else { 
        nOutsidePointCount++
        outside_points[ nOutsidePointCount ] = in_tri.p0 
    }

    if( d1 >= 0 ) { 
        nInsidePointCount++
        inside_points[ nInsidePointCount ] = in_tri.p1 
    } else { 
        nOutsidePointCount++
        outside_points[ nOutsidePointCount ] = in_tri.p1
    }

    if( d2 >= 0 ) { 
        nInsidePointCount++ 
        inside_points[ nInsidePointCount ] = in_tri.p2 
    } else { 
        nOutsidePointCount++
        outside_points[ nOutsidePointCount ] = in_tri.p2 
    }

    if( nInsidePointCount == 0 ) { return 0 }

    if( nInsidePointCount == 3 ) { 
        out_tri1 = in_tri
        return 1
    }

    if( nInsidePointCount == 1 && nOutsidePointCount == 2 ) {
        out_tri1.color =  in_tri.color
        out_tri1.p0 = inside_points[ 0 ]

        out_tri1.p1 = vc.intersectPlane( plane_p, plane_n, inside_points[ 0 ], outside_points[ 0 ] )
        out_tri1.p2 = vc.intersectPlane( plane_p, plane_n, inside_points[ 0 ], outside_points[ 1 ] )
        return 1
    }

    if( nInsidePointCount == 2 && nOutsidePointCount == 1 ) {
        out_tri1.color =  in_tri.color
        out_tri2.color =  in_tri.color

        out_tri1.p0 = inside_points[ 0 ]
		out_tri1.p1 = inside_points[ 1 ]

        out_tri1.p2 = vc.intersectPlane( plane_p, plane_n, inside_points[ 0 ], outside_points[ 0 ] )
        out_tri2.p0 = inside_points[ 1 ]
        out_tri2.p1 = out_tri1.p2
        out_tri2.p2 = vc.intersectPlane( plane_p, plane_n, inside_points[ 1 ], outside_points[ 0 ] )
        return 2
    }
}







const RenderEngine = class RenderEngine {
    constructor() {
        this.config = {
            'render': {
                'loop': true,
                'animate': 10,
                'elapse_time': 0.03 
            },
            'mesh': {
                'file': './version/7-class/polyhedron.obj',
                'load_from_file': true,
                'scale': 0.85,
                'float_size': 0
            },
            'canvas': {
                'width': 400,
                'height': 400
            },
            'camera': {
                'position': {
                    'x': 2.5,
                    'y': 2.0,
                    'z': 0.0
                },
                'look_at': {
                    'yaw': 0,
                    'distance': ''
                }
                // ,
                // 'fNear': 0.1,
                // 'fFar': 1000.0,
                // 'fFov': 300.0
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

        this.vCamera
        this.elapsedTime 
        this.vLookDir
        this.canvas
        this.svg
        this.ctx
    }


    initCamera() {
        this.vCamera = new Vector3( 
            this.config['camera']['position']['x'], 
            this.config['camera']['position']['y'], 
            this.config['camera']['position']['z'] 
        )
        this.elapsedTime = 0.0
        this.vLookDir = new Vector3()
    }


    initDom() {
        const generate = [ 
            [ 'svg', '2d' ], 
            [ 'canvas', '3d' ] 
        ]
            .forEach( a => {
                let dom = document.createElement( a[ 0 ] )
                dom.id = a[ 1 ]
                dom.setAttribute( 'width', this.config['canvas']['width'] )
                dom.setAttribute( 'height', this.config['canvas']['height'] )
                document.body.appendChild( dom )
                var svg = document.getElementById( a[ 1 ] )
            } )
        
        this.canvas = document.getElementById( '3d' )
        this.svg = document.getElementById( '2d' )
        this.ctx = this.canvas.getContext( '2d' )
        this.ctx.fillStyle = this.config['style']['color']['background']
        this.ctx.fillRect( 0, 0, this.config['canvas']['width'], this.config['canvas']['height'] )
        this.ctx.lineWidth = this.config['style']['stroke']['width']
        this.ctx.strokeStyle = this.config['style']['stroke']['color']
    }


    initEventListener() {
        window.addEventListener( 'keydown', event => {
            if( event.defaultPrevented ) {
              return
            }
          
            let change = false
            switch( event.key ) {
                case 'ArrowDown':
                    this.config['camera']['position']['y'] -= 1.0
                    change = true
                    break
                case 'ArrowUp':
                    this.config['camera']['position']['y'] += 1.0
                    change = true
                    break
                case 'ArrowLeft':
                    this.config['camera']['position']['x'] += 1.0
                    change = true
                    break
                case 'ArrowRight':
                    this.config['camera']['position']['x'] -= 1.0
                    change = true
                    break
                case 'w':
                    this.config['camera']['look_at']['distance'] = 'forward'
                    change = true
                    break
                case 'a':
                    this.config['camera']['look_at']['yaw'] -= -0.1
                    change = true
                    break
                case 's':
                    this.config['camera']['look_at']['distance'] = 'backward'
                    change = true
                    break
                case 'd':
                    this.config['camera']['look_at']['yaw'] += -0.1
                    change = true
                    break
                default:
                return
            }
          
            if( !this.config['render']['loop'] && change === true ) {
                this.renderScreen( { matProj: matProj, mesh: mesh } )
            }
        
            event.preventDefault()
        }, true )
    }


    meshCube() {
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


    meshLoader( str ) {
        let lines = str.split( "\n" )
        let points = []
        let faces = []
    
        lines
            .forEach( ( line ) => {
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

        t[ 0 ]
            .forEach( ( pos ) => {
                t[ 1 ]
                    .forEach( ( type ) => {
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
        }
    
        let result = faces
            .map( face => {
                return [ 
                    points[ face[ 0 ]-1 ][ 0 ], points[ face[ 0 ]-1 ][ 1 ], points[ face[ 0 ]-1 ][ 2 ], 
                    points[ face[ 1 ]-1 ][ 0 ], points[ face[ 1 ]-1 ][ 1 ], points[ face[ 1 ]-1 ][ 2 ], 
                    points[ face[ 2 ]-1 ][ 0 ], points[ face[ 2 ]-1 ][ 1 ], points[ face[ 2 ]-1 ][ 2 ]
                ]
            } )
    
    
    
        return result
    }


    onUserCreate( { screenHeight, screenWidth } ) {
        const mx = new Matrix()
        const matProj = mx.makeProjection(
            90.0, 
            screenHeight / screenWidth, 
            0.1, 
            1000.0
        )
        return matProj
    }


    onUserUpdate( { matProj, MeshCube, fElapsedTime, screenWidth, screenHeight } ) {
        const mx = new Matrix()
        const vc = new Vector()

        const vForward = vc.mul( this.vLookDir, 8.0 * fElapsedTime )
        switch( this.config['camera']['look_at']['distance'] ) {
            case 'forward':
                this.vCamera = vc.add( this.vCamera, vForward )
                this.config['camera']['look_at']['distance'] = ''
                break;
            case 'backward':
                this.vCamera = vc.sub( this.vCamera, vForward )
                this.config['camera']['look_at']['distance'] = ''
                break
        }
    
        const fTheta = 1.0 * fElapsedTime
        const matRotZ = mx.makeRotationZ( fTheta * 0.5 )
        const matRotX = mx.makeRotationX( fTheta )
    
        //vCamera.x = this.config['camera']['look_at']['x']
        this.vCamera.x = this.config['camera']['position']['x']
        this.vCamera.y = this.config['camera']['position']['y']
    
        const matTrans = mx.makeTranslation( 0.0, 0.0, 5.0 )
    
        let matWorld = new Mat4x4()
        matWorld = mx.makeIdentity()
        matWorld = mx.multiplyMatrix( matRotZ, matRotX )
        matWorld = mx.multiplyMatrix( matWorld, matTrans )
    
        // vLookDir.x = 0; vLookDir.y = 0; vLookDir.z = 1;  
        const vUp = new Vector3( 0, 1, 0 )
        let vTarget = new Vector3( 0, 0, 1 ) //vc.add( vCamera, vLookDir )
        const matCameraRot = mx.makeRotationY( this.config['camera']['look_at']['yaw'] )
        this.vLookDir = mx.multiplyVector( matCameraRot, vTarget )
        vTarget = vc.add( this.vCamera, this.vLookDir )
    
        const matCamera = mx.pointAt( this.vCamera, vTarget, vUp )
        const matView = mx.quickInverse( matCamera ) 
     
        let svgs = []
        MeshCube.tris
            .forEach( tri => {
                const triProjected = new Triangle()
                const triTransformed = new Triangle()
                const triViewed = new Triangle()
        
                triTransformed.p0 = mx.multiplyVector( matWorld, tri.p0 )
                triTransformed.p1 = mx.multiplyVector( matWorld, tri.p1 )
                triTransformed.p2 = mx.multiplyVector( matWorld, tri.p2 )
        
                const line1 = vc.sub( triTransformed.p1, triTransformed.p0 )
                const line2 = vc.sub( triTransformed.p2, triTransformed.p0 )
                let normal = vc.crossProduct( line1, line2 )
                normal = vc.normalise( normal )
        
                const vCameraRay = vc.sub( triTransformed.p0, this.vCamera )
                if( vc.dotProduct( normal, vCameraRay ) < 0.0 ) {
        
                    let light_direction = new Vector3( 0.0, 1.0, -1.0 )
                    light_direction = vc.normalise( light_direction )
                    
                    const dp = Math.max( 0.1, vc.dotProduct( light_direction, normal ) )
        
                    triTransformed.color  = Math.floor( dp * this.config['style']['shadow']['range'] )
        
                    triViewed.p0 = mx.multiplyVector( matView, triTransformed.p0 )
                    triViewed.p1 = mx.multiplyVector( matView, triTransformed.p1 )
                    triViewed.p2 = mx.multiplyVector( matView, triTransformed.p2 )
                    triViewed.color = triTransformed.color
        
                    const plane_p = new Vector3( 0.0, 0.0, 0.1 )
                    const plane_n = new Vector3( 0.0, 0.0, 1.0 )
                    const clipped = new Array( 2 ).fill( new Triangle() )
                    const nClippedTriangles = Triangle_ClipAgainstPlane( plane_p, plane_n, triViewed, clipped[ 0 ], clipped[ 1 ] )
        
                    for( let i = 0; i < nClippedTriangles; i++ ) {
///  ?
                    }
        
                    triProjected.p0 = mx.multiplyVector( matProj, triViewed.p0 )
                    triProjected.p1 = mx.multiplyVector( matProj, triViewed.p1 )
                    triProjected.p2 = mx.multiplyVector( matProj, triViewed.p2 )
                    triProjected.color = triTransformed.color
        
                    triProjected.p0 = vc.div( triProjected.p0, triProjected.p0.w )
                    triProjected.p1 = vc.div( triProjected.p1, triProjected.p1.w )
                    triProjected.p2 = vc.div( triProjected.p2, triProjected.p2.w )
        
                    const vOffsetView = new Vector3( 1, 1, 0 )
        
                    triProjected.p0 = vc.add( triProjected.p0, vOffsetView )
                    triProjected.p1 = vc.add( triProjected.p1, vOffsetView )
                    triProjected.p2 = vc.add( triProjected.p2, vOffsetView )
        
                    triProjected.p0.x *= this.config['mesh']['scale'] * screenWidth
                    triProjected.p0.y *= this.config['mesh']['scale'] * screenHeight
                    triProjected.p1.x *= this.config['mesh']['scale'] * screenWidth
                    triProjected.p1.y *= this.config['mesh']['scale'] * screenHeight
                    triProjected.p2.x *= this.config['mesh']['scale'] * screenWidth
                    triProjected.p2.y *= this.config['mesh']['scale'] * screenHeight
            
                    let t = [ [ 'p0', 'p1', 'p2' ], [ 'x', 'y', 'z' ] ]
                    t[ 0 ].forEach( tri => {
                        t[ 1 ].forEach( pos => {
                            triProjected[ tri ][ pos ] = Number
                                .parseFloat( triProjected[ tri ][ pos ] )
                                .toFixed( this.config['mesh']['float_size'] )
                        } )
                    } )
        
                    svgs.push ( this.drawTriangleSVG( triProjected ) )
                }
            } ) 
        return svgs
    }


    drawTriangleSVG( tri ) {
        this.ctx.beginPath()
        this.ctx.moveTo( tri.p0.x, tri.p0.y )
        this.ctx.lineTo( tri.p1.x, tri.p1.y )
        this.ctx.lineTo( tri.p2.x, tri.p2.y )
        this.ctx.lineTo( tri.p0.x, tri.p0.y )
        this.ctx.closePath()
    
        this.ctx.fillStyle = `rgb(${tri.color},${tri.color},${tri.color})`
        this.ctx.stroke()
        this.ctx.fill( )

        return `<polygon points="${tri.p0.x},${tri.p0.y} ${tri.p1.x},${tri.p1.y} ${tri.p2.x},${tri.p2.y}" stroke="${this.config['style']['stroke']['color']}" fill="rgb(${tri.color}, ${tri.color}, ${tri.color})" stroke-width="${this.config['style']['stroke']['width']}"
        stroke-linecap="butt" stroke-linejoin="round" class="triangle" />`
    }


    renderScreen( { matProj, mesh } ) {
        this.elapsedTime += this.config['render']['elapse_time']
        // ctx.clearRect( 0, 0, this.config['canvas']['width'], this.config['canvas']['height'] )
        this.ctx.fillStyle = this.config['style']['color']['background']
        this.ctx.fillRect( 0, 0, this.config['canvas']['width'], this.config['canvas']['height']);
        let svgs = this.onUserUpdate( {
            'matProj': matProj,
            'MeshCube': mesh,
            'fElapsedTime': this.elapsedTime,
            'screenWidth': this.config['canvas']['width'],
            'screenHeight': this.config['canvas']['height']
        } ) 
        this.svg.innerHTML = svgs.join( "\n" )
    }


    async initRender() {
        let cordinats = null

        if( this.config['mesh']['load_from_file'] ) {
            const raw = await fetch( this.config['mesh']['file'] )
            const file = await raw.text()
            cordinats = this.meshLoader( file )
        } else {
            cordinats = this.meshCube()
        }
        const mesh = new Mesh( cordinats )
    
        const matProj = this.onUserCreate( { 
            screenHeight: this.config['canvas']['height'], 
            screenWidth: this.config['canvas']['width'] 
        } )
    
        this.renderScreen( { matProj: matProj, mesh: mesh } )
    
        if( this.config['render']['loop'] ) {
            const interval = window
                .setInterval( () => { 
                    this.renderScreen( { matProj: matProj, mesh: mesh } ) }, 
                    this.config['render']['animate']
                )
        }
    }


    async start() {
        this.initCamera()
        this.initDom()
        this.initEventListener()
        await this.initRender()
    }
}


document.addEventListener(
    'DOMContentLoaded', 
    async( event ) => {
        const renderEngine = new RenderEngine()
        await renderEngine.start()
    }
)