/**
*
*   FILTER.js Plugins
*   @version: 0.7.2
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Plugins)
*   https://github.com/foo123/FILTER.js
*
**/!function ( root, name, deps, factory ) {
    "use strict";
    
    //
    // export the module umd-style (with deps bundled-in or external)
    
    // Get current filename/path
    function getPath( isNode, isWebWorker, isAMD, isBrowser, amdMod ) 
    {
        var f;
        if (isNode) return {file:__filename, path:__dirname};
        else if (isWebWorker) return {file:(f=self.location.href), path:f.split('/').slice(0, -1).join('/')};
        else if (isAMD&&amdMod&&amdMod.uri)  return {file:(f=amdMod.uri), path:f.split('/').slice(0, -1).join('/')};
        else if (isBrowser&&(f=document.getElementsByTagName('script'))&&f.length) return {file:(f=f[f.length - 1].src), path:f.split('/').slice(0, -1).join('/')};
        return {file:null,  path:null};
    }
    function getDeps( names, paths, deps, depsType, require/*offset*/ )
    {
        //offset = offset || 0;
        var i, dl = names.length, mods = new Array( dl );
        for (i=0; i<dl; i++) 
            mods[ i ] = (1 === depsType)
                    ? /* node */ (deps[ names[ i ] ] || require( paths[ i ] )) 
                    : (2 === depsType ? /* amd args */ /*(deps[ i + offset ])*/ (require( names[ i ] )) : /* globals */ (deps[ names[ i ] ]))
                ;
        return mods;
    }
    // load javascript(s) (a)sync using <script> tags if browser, or importScripts if worker
    function loadScripts( scope, base, names, paths, callback, imported )
    {
        var dl = names.length, i, rel, t, load, next, head, link;
        if ( imported )
        {
            for (i=0; i<dl; i++) if ( !(names[ i ] in scope) ) importScripts( base + paths[ i ] );
            return callback( );
        }
        head = document.getElementsByTagName("head")[ 0 ]; link = document.createElement( 'a' );
        rel = /^\./; t = 0; i = 0;
        load = function( url, cb ) {
            var done = 0, script = document.createElement('script');
            script.type = 'text/javascript'; script.language = 'javascript';
            script.onload = script.onreadystatechange = function( ) {
                if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete'))
                {
                    done = 1; script.onload = script.onreadystatechange = null;
                    cb( );
                    head.removeChild( script ); script = null;
                }
            }
            if ( rel.test( url ) ) 
            {
                // http://stackoverflow.com/a/14781678/3591273
                // let the browser generate abs path
                link.href = base + url;
                url = link.protocol + "//" + link.host + link.pathname + link.search + link.hash;
            }
            // load it
            script.src = url; head.appendChild( script );
        };
        next = function( ) {
            if ( names[ i ] in scope )
            {
                if ( ++i >= dl ) callback( );
                else if ( names[ i ] in scope ) next( ); 
                else load( paths[ i ], next );
            }
            else if ( ++t < 30 ) { setTimeout( next, 30 ); }
            else { t = 0; i++; next( ); }
        };
        while ( i < dl && (names[ i ] in scope) ) i++;
        if ( i < dl ) load( paths[ i ], next );
        else callback( );
    }
    
    deps = deps || [[],[]];
    
    var isNode = ("undefined" !== typeof global) && ("[object global]" === {}.toString.call(global)),
        isBrowser = !isNode && ("undefined" !== typeof navigator), 
        isWebWorker = !isNode && ("function" === typeof importScripts) && (navigator instanceof WorkerNavigator),
        isAMD = ("function" === typeof define) && define.amd,
        isCommonJS = isNode && ("object" === typeof module) && module.exports,
        currentGlobal = isWebWorker ? self : root, currentPath = getPath( isNode, isWebWorker, isAMD, isBrowser ), m,
        names = [].concat(deps[0]), paths = [].concat(deps[1]), dl = names.length, i, requireJSPath, ext_js = /\.js$/i
    ;
    
    // commonjs, node, etc..
    if ( isCommonJS ) 
    {
        module.$deps = module.$deps || {};
        module.exports = module.$deps[ name ] = factory.apply( root, [{NODE:module}].concat(getDeps( names, paths, module.$deps, 1, require )) ) || 1;
    }
    
    // amd, requirejs, etc..
    else if ( isAMD && ("function" === typeof require) && ("function" === typeof require.specified) &&
        require.specified(name) ) 
    {
        if ( !require.defined(name) )
        {
            requireJSPath = { };
            for (i=0; i<dl; i++) 
                require.specified( names[ i ] ) || (requireJSPath[ names[ i ] ] = paths[ i ].replace(ext_js, ''));
            //requireJSPath[ name ] = currentPath.file.replace(ext_js, '');
            require.config({ paths: requireJSPath });
            // named modules, require the module by name given
            define( name, ["require", "exports", "module"].concat( names ), function( require, exports, module ) {
                return factory.apply( root, [{AMD:module}].concat(getDeps( names, paths, arguments, 2, require )) );
            });
        }
    }
    
    // browser, web worker, other loaders, etc.. + AMD optional
    else if ( !(name in currentGlobal) )
    {
        loadScripts( currentGlobal, currentPath.path + '/', names, paths, function( ){ 
            m = factory.apply( root, [{}].concat(getDeps( names, paths, currentGlobal )) ); 
            isAMD && define( name, ["require"], function( ){ return m; } );
        }, isWebWorker);
    }


}(  /* current root */          this, 
    /* module name */           "FILTER_PLUGINS",
    /* module dependencies */   [ ['FILTER'], ['./filter.js'] ], 
    /* module factory */        function( exports, FILTER ) {
        
    /* main code starts here */

/**
*
*   FILTER.js Plugins
*   @version: 0.7.2
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Plugins)
*   https://github.com/foo123/FILTER.js
*
**/
exports['FILTER_PLUGINS'] = FILTER;

/**
*
* Noise Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp=FILTER._notSupportClamp, rand=Math.random;

// a sample noise filter
// used for illustration purposes on how to create a plugin filter
FILTER.Create({
    name: "NoiseFilter"
    
    // parameters
    ,min: -127
    ,max: 127
    
    // this is the filter constructor
    ,init: function( min, max ) {
        var self = this;
        self.min = min||-127;
        self.max = max||127;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                min: self.min
                ,max: self.max
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.min = params.min;
            self.max = params.max;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var range=self.max-self.min, m=self.min,
            i, l=im.length, n, r, g, b, t0, t1, t2;
        
        // add noise
        if (notSupportClamp)
        {   
            for (i=0; i<l; i+=4)
            { 
                r = im[i]; g = im[i+1]; b = im[i+2];
                n = range*rand()+m;
                t0 = r+n; t1 = g+n; t2 = b+n; 
                // clamp them manually
                if (t0<0) t0=0;
                else if (t0>255) t0=255;
                if (t1<0) t1=0;
                else if (t1>255) t1=255;
                if (t2<0) t2=0;
                else if (t2>255) t2=255;
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            { 
                r = im[i]; g = im[i+1]; b = im[i+2];
                n = range*rand()+m;
                t0 = r+n; t1 = g+n; t2 = b+n; 
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Perlin Noise Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var FLOOR = Math.floor, sin = Math.sin, cos = Math.cos, PI2 = FILTER.CONSTANTS.PI2;
 
// adapted from:

// https://github.com/kev009/craftd/blob/master/plugins/survival/mapgen/noise/simplexnoise1234.c
/* SimplexNoise1234, Simplex noise with true analytic
 * derivative in 1D to 4D.
 *
 * Author: Stefan Gustavson, 2003-2005
 * Contact: stegu@itn.liu.se
 *
 * This code was GPL licensed until February 2011.
 * As the original author of this code, I hereby
 * release it into the public domain.
 * Please feel free to use it for whatever you want.
 * Credit is appreciated where appropriate, and I also
 * appreciate being told where this code finds any use,
 * but you may do as you like.
 */

 // https://github.com/kev009/craftd/blob/master/plugins/survival/mapgen/noise/noise1234.c
/* noise1234
 *
 * Author: Stefan Gustavson, 2003-2005
 * Contact: stegu@itn.liu.se
 *
 * This code was GPL licensed until February 2011.
 * As the original author of this code, I hereby
 * release it into the public domain.
 * Please feel free to use it for whatever you want.
 * Credit is appreciated where appropriate, and I also
 * appreciate being told where this code finds any use,
 * but you may do as you like.
 */

/*
 * Permutation table. This is just a random jumble of all numbers 0-255,
 * repeated twice to avoid wrapping the index at 255 for each lookup.
 * This needs to be exactly the same for all instances on all platforms,
 * so it's easiest to just keep it as static explicit data.
 * This also removes the need for any initialisation of this class.
 *
 * Note that making this an int[] instead of a char[] might make the
 * code run faster on platforms with a high penalty for unaligned single
 * byte addressing. Intel x86 is generally single-byte-friendly, but
 * some other CPUs are faster with 4-aligned reads.
 * However, a char[] is smaller, which avoids cache trashing, and that
 * is probably the most important aspect on most architectures.
 * This array is accessed a *lot* by the noise functions.
 * A vector-valued noise over 3D accesses it 96 times, and a
 * float-valued 4D noise 64 times. We want this to fit in the cache!
 */
var p = new FILTER.Array8U([151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180,
  151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180 
]), perm = new FILTER.Array8U(p); // copy it initially

// This isn't a very good seeding function, but it works ok. It supports 2^16
// different seed values. Write something better if you need more seeds.
function seed( seed ) 
{
    var v, i;
    // Scale the seed out
    if ( seed > 0 && seed < 1 ) seed *= 65536;

    seed = FLOOR( seed );
    if ( seed < 256 ) seed |= seed << 8;
    for (i = 0; i < 256; i++) 
    {
        v = ( i & 1 ) ? (p[i] ^ (seed & 255)) : (p[i] ^ ((seed>>8) & 255));
        perm[i] = perm[i + 256] = v;
    }
}
//seed(0);

/*
 * Helper functions to compute gradients-dot-residualvectors (1D to 4D)
 * Note that these generate gradients of more than unit length. To make
 * a close match with the value range of classic Perlin noise, the final
 * noise values need to be rescaled to fit nicely within [-1,1].
 * (The simplex noise functions as such also have different scaling.)
 * Note also that these noise functions are the most practical and useful
 * signed version of Perlin noise. To return values according to the
 * RenderMan specification from the SL noise() and pnoise() functions,
 * the noise values need to be scaled and offset to [0,1], like this:
 * float SLnoise = (noise(x,y,z) + 1.0) * 0.5;
 */

function grad1( hash, x ) 
{
    var h = hash & 15;
    var grad = 1.0 + (h & 7);   // Gradient value 1.0, 2.0, ..., 8.0
    if (h&8) grad = -grad;         // Set a random sign for the gradient
    return ( grad * x );           // Multiply the gradient with the distance
}

function grad2( hash, x, y ) 
{
    var h = hash & 7;      // Convert low 3 bits of hash code
    var u = h<4 ? x : y;  // into 8 simple gradient directions,
    var v = h<4 ? y : x;  // and compute the dot product with (x,y).
    return ((h&1)? -u : u) + ((h&2)? -2.0*v : 2.0*v);
}

function grad3( hash, x, y, z ) 
{
    var h = hash & 15;     // Convert low 4 bits of hash code into 12 simple
    var u = h<8 ? x : y; // gradient directions, and compute dot product.
    var v = h<4 ? y : h==12||h==14 ? x : z; // Fix repeats at h = 12 to 15
    return ((h&1)? -u : u) + ((h&2)? -v : v);
}

function grad4( hash, x, y, z, t ) 
{
    var h = hash & 31;      // Convert low 5 bits of hash code into 32 simple
    var u = h<24 ? x : y; // gradient directions, and compute dot product.
    var v = h<16 ? y : z;
    var w = h<8 ? z : t;
    return ((h&1)? -u : u) + ((h&2)? -v : v) + ((h&4)? -w : w);
}

// A lookup table to traverse the simplex around a given point in 4D.
// Details can be found where this table is used, in the 4D noise method.
/* TODO: This should not be required, backport it from Bill's GLSL code! */
var simplex = [
[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],
[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],
[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],
[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],
[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],
[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]
];

// 2D simplex noise
function simplex2( x, y ) 
{
    var F2 = 0.366025403; // F2 = 0.5*(sqrt(3.0)-1.0)
    var G2 = 0.211324865; // G2 = (3.0-Math.sqrt(3.0))/6.0
    
    var n0, n1, n2; // Noise contributions from the three corners

    // Skew the input space to determine which simplex cell we're in
    var s = (x+y)*F2; // Hairy factor for 2D
    var xs = x + s;
    var ys = y + s;
    var i = FLOOR(xs);
    var j = FLOOR(ys);

    var t = (i+j)*G2;
    var X0 = i-t; // Unskew the cell origin back to (x,y) space
    var Y0 = j-t;
    var x0 = x-X0; // The x,y distances from the cell origin
    var y0 = y-Y0;

    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if ( x0>y0 ) {i1=1; j1=0;} // lower triangle, XY order: (0,0)->(1,0)->(1,1)
    else {i1=0; j1=1;}      // upper triangle, YX order: (0,0)->(0,1)->(1,1)

    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6

    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1.0 + 2.0 * G2;

    // Wrap the integer indices at 256, to avoid indexing perm[] out of bounds
    var ii = i & 0xff;
    var jj = j & 0xff;

    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0*x0-y0*y0;
    if ( t0 < 0.0 ) n0 = 0.0;
    else 
    {
        t0 *= t0;
        n0 = t0 * t0 * grad2(perm[ii+perm[jj]], x0, y0); 
    }

    var t1 = 0.5 - x1*x1-y1*y1;
    if (t1 < 0.0) n1 = 0.0;
    else 
    {
        t1 *= t1;
        n1 = t1 * t1 * grad2(perm[ii+i1+perm[jj+j1]], x1, y1);
    }

    var t2 = 0.5 - x2*x2-y2*y2;
    if(t2 < 0.0) n2 = 0.0;
    else 
    {
        t2 *= t2;
        n2 = t2 * t2 * grad2(perm[ii+1+perm[jj+1]], x2, y2);
    }

    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 40.0 * (n0 + n1 + n2); // TODO: The scale factor is preliminary!
}

// This is the new and improved, C(2) continuous interpolant
function FADE(t) { return t * t * t * ( t * ( t * 6 - 15 ) + 10 ); }
function LERP(t, a, b) { return a + t*(b-a); }

// 2D float Perlin noise.
function perlin2( x, y )
{
    var ix0, iy0, ix1, iy1;
    var fx0, fy0, fx1, fy1;
    var s, t, nx0, nx1, n0, n1;

    ix0 = FLOOR( x ); // Integer part of x
    iy0 = FLOOR( y ); // Integer part of y
    fx0 = x - ix0;        // Fractional part of x
    fy0 = y - iy0;        // Fractional part of y
    fx1 = fx0 - 1.0;
    fy1 = fy0 - 1.0;
    ix1 = (ix0 + 1) & 0xff;  // Wrap to 0..255
    iy1 = (iy0 + 1) & 0xff;
    ix0 = ix0 & 0xff;
    iy0 = iy0 & 0xff;
    
    t = FADE( fy0 );
    s = FADE( fx0 );

    nx0 = grad2(perm[ix0 + perm[iy0]], fx0, fy0);
    nx1 = grad2(perm[ix0 + perm[iy1]], fx0, fy1);
    n0 = LERP( t, nx0, nx1 );

    nx0 = grad2(perm[ix1 + perm[iy0]], fx1, fy0);
    nx1 = grad2(perm[ix1 + perm[iy1]], fx1, fy1);
    n1 = LERP(t, nx0, nx1);

    return 0.507 * ( LERP( s, n0, n1 ) );
}

// adapted from: http://www.java-gaming.org/index.php?topic=31637.0
function octaved(seamless, noise, x, y, w, h, ibx, iby, octaves, offsets, scale, roughness)
{
    var noiseSum = 0, layerFrequency = scale, layerWeight = 1, weightSum = 0, 
        octave, nx, ny, w2 = w>>>1, h2 = h>>>1;

    for (octave=0; octave<octaves; octave++) 
    {
        nx = (x + offsets[octave][0]) % w; ny = (y + offsets[octave][1]) % h;
        if ( seamless )
        {
            // simulate seamless stitching, i.e circular/tileable symmetry
            if ( nx > w2 ) nx = w-1-nx;
            if ( ny > h2 ) ny = h-1-ny;
        }
        noiseSum += noise( layerFrequency*nx*ibx, layerFrequency*ny*iby ) * layerWeight;
        layerFrequency *= 2;
        weightSum += layerWeight;
        layerWeight *= roughness;
    }
    return noiseSum / weightSum;
}
/*function turbulence()
{
}*/


// an efficient perlin noise and simplex noise plugin
// http://en.wikipedia.org/wiki/Perlin_noise
FILTER.Create({
    name: "PerlinNoiseFilter"
    
    // parameters
    ,_baseX: 1
    ,_baseY: 1
    ,_octaves: 1
    ,_offsets: null
    ,_colors: null
    ,_seed: 0
    ,_stitch: false
    ,_fractal: true
    ,_perlin: false
    
    // constructor
    ,init: function( baseX, baseY, octaves, stitch, fractal, offsets, colors, seed, perlin ) {
        var self = this;
        self._baseX = baseX || 1;
        self._baseY = baseY || 1;
        self.octaves( octaves||1, offsets );
        self.colors( colors || null );
        self._seed = seed || 0;
        self._stitch = !!stitch;
        self._fractal = false !== fractal;
        self._perlin = !!perlin;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,seed: function( randSeed ) {
        var self = this;
        seed( self._seed = randSeed || 0 );
        return self;
    }
    
    ,octaves: function( octaves, offsets ) {
        var self = this;
        self._octaves = octaves || 1;
        self._offsets = !offsets ? [] : offsets.slice(0);
        while (self._offsets.length < self._octaves) self._offsets.push([0,0]);
        return self;
    }
    
    ,colors: function( colors ) {
        var self = this;
        self._colors = colors || null;
        return self;
    }
    
    ,seamless: function( enabled ) {
        if ( !arguments.length ) enabled = true;
        this._stitch = !!enabled;
        return this;
    }
    
    ,turbulence: function( enabled ) {
        if ( !arguments.length ) enabled = true;
        this._fractal = !enabled;
        return this;
    }
    
    ,simplex: function( ) {
        this._perlin = false;
        return this;
    }
    
    ,perlin: function( ) {
        this._perlin = true;
        return this;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 _baseX: self._baseX
                ,_baseY: self._baseY
                ,_octaves: self._octaves
                ,_offsets: self._offsets
                ,_colors: self._colors
                ,_seed: self._seed
                ,_stitch: self._stitch
                ,_fractal: self._fractal
                ,_perlin: self._perlin
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._baseX = params._baseX;
            self._baseY = params._baseY;
            self._octaves = params._octaves;
            self._offsets = params._offsets;
            self._colors = params._colors;
            self._seed = params._seed;
            self._stitch = params._stitch;
            self._fractal = params._fractal;
            self._perlin = params._perlin;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this, baseX = self._baseX, baseY = self._baseY,
            invBaseX = 1/baseX, invBaseY = 1/baseY,
            octaves = self._octaves, offsets = self._offsets,
            colors = self._colors, is_grayscale = !colors || !colors.length,
            is_perlin = self._perlin, is_turbulence = !self._fractal, seamless = !!self._stitch, 
            i, l = im.length, x, y, n, c, noise
        ;
        
        noise = is_perlin ? perlin2 : simplex2;
        // avoid unnecesary re-seeding ??
        //if ( self._seed ) seed( self._seed );
        
        x=0; y=0;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            n = 0.5*octaved(seamless, noise, x, y, w, h, invBaseX, invBaseY, octaves, offsets, 1.0, 0.5)+0.5;
            if ( is_grayscale )
            {
                im[i] = im[i+1] = im[i+2] = ~~(255*n);
            }
            else
            {
                c = colors[FLOOR(n*(colors.length-1))];
                im[i] = c[0]; im[i+1] = c[1]; im[i+2] = c[2];
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Histogram Equalize Plugin, Histogram Equalize for grayscale images Plugin, RGB Histogram Equalize Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F,
    RGB2YCbCr=FILTER.Color.RGB2YCbCr, YCbCr2RGB=FILTER.Color.YCbCr2RGB
    ;

// a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
FILTER.Create({
    name : "HistogramEqualizeFilter"
    
    ,path: FILTER.getPath( exports.AMD )
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var r,g,b, rangeI,  maxI = 0, minI = 255,
            cdfI, accum = 0, t0, t1, t2,
            i, y, l=im.length, l2=l>>2, n=1.0/(l2), ycbcr, rgba
        ;
        
        // initialize the arrays
        cdfI = new A32F(256);
        for (i=0; i<256; i+=4)
        { 
            // partial loop unrolling
            cdfI[i]=0; 
            cdfI[i+1]=0; 
            cdfI[i+2]=0; 
            cdfI[i+3]=0; 
        }
        
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            //r = im[i]; g = im[i+1]; b = im[i+2];
            ycbcr = RGB2YCbCr(im.subarray(i,i+3));
            r = im[i] = ~~ycbcr[2]; g = im[i+1] = ~~ycbcr[0]; b = im[i+2] = ~~ycbcr[1];
            cdfI[ g ] += n;
            
            if ( g>maxI ) maxI=g;
            else if ( g<minI ) minI=g;
        }
        
        // compute cdf
        accum = 0;
        for (i=0; i<256; i+=4)
        { 
            // partial loop unrolling
            accum += cdfI[i]; cdfI[i] = accum;
            accum += cdfI[i+1]; cdfI[i+1] = accum;
            accum += cdfI[i+2]; cdfI[i+2] = accum;
            accum += cdfI[i+3]; cdfI[i+3] = accum;
        }
        
        // equalize only the intesity channel
        rangeI = maxI-minI;
        if (notSupportClamp)
        {   
            for (i=0; i<l; i+=4)
            { 
                ycbcr = [im[i+1], im[i+2], im[i]];
                ycbcr[0] = cdfI[ycbcr[0]]*rangeI + minI;
                rgba = YCbCr2RGB(ycbcr);
                t0 = rgba[0]; t1 = rgba[1]; t2 = rgba[2]; 
                // clamp them manually
                t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            { 
                ycbcr = [im[i+1], im[i+2], im[i]];
                ycbcr[0] = cdfI[ycbcr[0]]*rangeI + minI;
                rgba = YCbCr2RGB(ycbcr);
                im[i] = ~~rgba[0]; im[i+1] = ~~rgba[1]; im[i+2] = ~~rgba[2]; 
            }
        }
        
        // return the new image data
        return im;
    }
});

// a simple grayscale histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
FILTER.Create({
    name: "GrayscaleHistogramEqualizeFilter"
    
    ,path: FILTER.getPath( exports.AMD )
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var c, g, rangeI, maxI=0, minI=255,
            cdfI, accum=0, t0, t1, t2,
            i, l=im.length, l2=l>>2, n=1.0/(l2)
            ;
        
        // initialize the arrays
        cdfI = new A32F(256);
        for (i=0; i<256; i+=4)
        { 
            // partial loop unrolling
            cdfI[i]=0; 
            cdfI[i+1]=0; 
            cdfI[i+2]=0; 
            cdfI[i+3]=0; 
        }
        
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            c = im[i];  // image is already grayscale
            cdfI[c] += n;
            
            if (c>maxI) maxI=c;
            else if (c<minI) minI=c;
        }
        
        // compute cdf
        accum = 0;
        for (i=0; i<256; i+=4)
        { 
            // partial loop unrolling
            accum += cdfI[i]; cdfI[i] = accum;
            accum += cdfI[i+1]; cdfI[i+1] = accum;
            accum += cdfI[i+2]; cdfI[i+2] = accum;
            accum += cdfI[i+3]; cdfI[i+3] = accum;
        }
        
        // equalize the grayscale/intesity channels
        rangeI = maxI-minI;
        if (notSupportClamp)
        {   
            for (i=0; i<l; i+=4)
            { 
                c = im[i]; // grayscale image has same value in all channels
                g = cdfI[c]*rangeI + minI;
                // clamp them manually
                g = (g<0) ? 0 : ((g>255) ? 255 : g);
                g = ~~g;
                im[i] = g; im[i+1] = g; im[i+2] = g; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            { 
                c = im[i]; // grayscale image has same value in all channels
                g = ~~( cdfI[c]*rangeI + minI );
                im[i] = g; im[i+1] = g; im[i+2] = g; 
            }
        }
        
        // return the new image data
        return im;
    }
});

// a sample RGB histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
// not the best implementation
// used for illustration purposes on how to create a plugin filter
FILTER.Create({
    name: "RGBHistogramEqualizeFilter"
    
    ,path: FILTER.getPath( exports.AMD )
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var r,g,b, rangeR, rangeG, rangeB,
            maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
            cdfR, cdfG, cdfB,
            accumR, accumG, accumB, t0, t1, t2,
            i, l=im.length, l2=l>>2, n=1.0/(l2)
        ;
        
        // initialize the arrays
        cdfR=new A32F(256); cdfG=new A32F(256); cdfB=new A32F(256);
        for (i=0; i<256; i+=4)
        { 
            // partial loop unrolling
            cdfR[i]=0; cdfG[i]=0; cdfB[i]=0; 
            cdfR[i+1]=0; cdfG[i+1]=0; cdfB[i+1]=0; 
            cdfR[i+2]=0; cdfG[i+2]=0; cdfB[i+2]=0; 
            cdfR[i+3]=0; cdfG[i+3]=0; cdfB[i+3]=0; 
        }
        
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            r = im[i]; g = im[i+1]; b = im[i+2];
            cdfR[r] += n; cdfG[g] += n; cdfB[b] += n;
            
            if (r>maxR) maxR=r;
            else if (r<minR) minR=r;
            if (g>maxG) maxG=g;
            else if (g<minG) minG=g;
            if (b>maxB) maxB=b;
            else if (b<minB) minB=b;
        }
        
        // compute cdf
        accumR=accumG=accumB=0;
        for (i=0; i<256; i+=4)
        { 
            // partial loop unrolling
            accumR+=cdfR[i]; cdfR[i]=accumR; 
            accumG+=cdfG[i]; cdfG[i]=accumG; 
            accumB+=cdfB[i]; cdfB[i]=accumB; 
            accumR+=cdfR[i+1]; cdfR[i+1]=accumR; 
            accumG+=cdfG[i+1]; cdfG[i+1]=accumG; 
            accumB+=cdfB[i+1]; cdfB[i+1]=accumB; 
            accumR+=cdfR[i+2]; cdfR[i+2]=accumR; 
            accumG+=cdfG[i+2]; cdfG[i+2]=accumG; 
            accumB+=cdfB[i+2]; cdfB[i+2]=accumB; 
            accumR+=cdfR[i+3]; cdfR[i+3]=accumR; 
            accumG+=cdfG[i+3]; cdfG[i+3]=accumG; 
            accumB+=cdfB[i+3]; cdfB[i+3]=accumB; 
        }
        
        // equalize each channel separately
        rangeR=maxR-minR; rangeG=maxG-minG; rangeB=maxB-minB;
        if (notSupportClamp)
        {   
            for (i=0; i<l; i+=4)
            { 
                r = im[i]; g = im[i+1]; b = im[i+2]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                // clamp them manually
                t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            { 
                r = im[i]; g = im[i+1]; b = im[i+2]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Pixelate Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var Sqrt=Math.sqrt,
    notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F;


// a sample fast pixelate filter
FILTER.Create({
    name: "PixelateFilter"
    
    // parameters
    ,scale: 1
    
    // this is the filter constructor
    ,init: function( scale ) {
        var self = this;
        self.scale = scale || 1;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                scale: self.scale
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.scale = params.scale;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        var self = this;
        if (!self._isOn || self.scale<=1) return im;
        if (self.scale>100) self.scale=100;
        
        var imLen = im.length, imArea = (imLen>>>2),
            step, stepw, hstep, wstep, hstepw, wRem, hRem,
            inv_size, inv_size1, inv_size1w, inv_size1h, inv_size1hw, 
            inv_sizes, inv_sizew, inv_sizeh, inv_sizewh,
            integral, colR, colG, colB,
            rowLen = (w<<1) + w, imageIndicesX, imageIndicesY,
            i, j, x, y, yw, px, py, pyw, pi,
            xOff1, yOff1, xOff2, yOff2, 
            bx1, by1, bx2, by2, 
            p1, p2, p3, p4, r, g, b
        ;
        
        step = ~~(Sqrt(imArea)*self.scale*0.01);
        stepw = w*step; hstep = (h%step); wstep = (w%step); hstepw = (hstep-1)*w;
        inv_size1 = 1.0/(step*step); inv_size1w = 1.0/(wstep*step); inv_size1h = 1.0/(hstep*step); inv_size1hw = 1.0/(wstep*hstep);
        inv_sizes = inv_size1; inv_sizew = inv_size1w; inv_sizeh = inv_size1h; inv_sizewh = inv_size1hw;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        imageIndicesX = step-1; imageIndicesY = (step-1)*w;
        bx1=0; bx2=w-1; by1=0; by2=imArea-w;
        
        // compute integral image in one pass
        integral = new A32F(imArea*3);
        // first row
        i=0; j=0; x=0; colR=colG=colB=0;
        for (x=0; x<w; x++, i+=4, j+=3)
        {
            colR += im[i]; colG += im[i+1]; colB += im[i+2];
            integral[j] = colR; integral[j+1] = colG; integral[j+2] = colB;
        }
        // other rows
        j=0; x=0; colR=colG=colB=0;
        for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
        {
            if (x>=w) { x=0; colR=colG=colB=0; }
            colR += im[i]; colG += im[i+1]; colB += im[i+2];
            integral[j+rowLen] = integral[j] + colR; 
            integral[j+rowLen+1] = integral[j+1] + colG;  
            integral[j+rowLen+2] = integral[j+2] + colB;
        }
        
        // first block
        x=0; y=0; yw=0;
        // calculate the weighed sum of the source image pixels that
        // fall under the pixelate convolution matrix
        xOff1 = x; yOff1 = yw;  
        xOff2 = xOff1 + imageIndicesX; yOff2 = yOff1 + imageIndicesY;
        
        // fix borders
        xOff2 = (xOff2>bx2) ? bx2 : xOff2;
        yOff2 = (yOff2>by2) ? by2 : yOff2;
        
        // compute integral positions
        p1=(xOff1 + yOff1); p4=(xOff2+yOff2); p2=(xOff2 + yOff1); p3=(xOff1 + yOff2);
        p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
        
        // compute matrix sum of these elements
        // maybe using a gaussian average could be better (but more computational) ??
        inv_size = inv_sizes;
        r = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
        g = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
        b = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
        
        if (notSupportClamp)
        {   
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        r = ~~r;  g = ~~g;  b = ~~b; // alpha channel is not transformed
        
        // do direct pixelate convolution
        px=0; py=0; pyw=0;
        for (i=0; i<imLen; i+=4)
        {
            // output
            // replace the area equal to the given pixelate size
            // with the average color, computed in previous step
            pi = (px+x + pyw+yw)<<2;
            im[pi] = r;  im[pi+1] = g;  im[pi+2] = b; 
            
            // next pixel
            px++; if ( px+x >= w || px >= step ) { px=0; py++; pyw+=w; }
            
            // next block
            if (py+y >= h || py >= step)
            {
                // update image coordinates
                x+=step; if ( x>=w ) { x=0; y+=step; yw+=stepw; }
                px=0; py=0; pyw=0;
                
                // calculate the weighed sum of the source image pixels that
                // fall under the pixelate convolution matrix
                xOff1 = x; yOff1 = yw;  
                xOff2 = xOff1 + imageIndicesX; yOff2 = yOff1 + imageIndicesY;
                
                // fix borders
                xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                yOff2 = (yOff2>by2) ? by2 : yOff2;
                
                // compute integral positions
                p1=(xOff1 + yOff1); p4=(xOff2+yOff2); p2=(xOff2 + yOff1); p3=(xOff1 + yOff2);
                p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                
                // get correct area size
                wRem = (0==xOff2-xOff1-wstep+1);
                hRem = (0==yOff2-yOff1-hstepw);
                inv_size = (wRem && hRem) ? inv_sizewh : ((wRem) ? inv_sizew : ((hRem) ? inv_sizeh : inv_sizes));
                
                // compute matrix sum of these elements
                r = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                g = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                b = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                if (notSupportClamp)
                {   
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                r = ~~r;  g = ~~g;  b = ~~b; // alpha channel is not transformed
            }
        }
        
        // return the pixelated image data
        return im;
    }
});

}(FILTER);/**
*
* Triangular Pixelate Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var Sqrt = Math.sqrt, sqrt2 = Math.SQRT2, Min = Math.min,
    notSupportClamp = FILTER._notSupportClamp, A32F = FILTER.Array32F;

// a simple fast Triangular Pixelate filter
FILTER.Create({
    name: "TriangularPixelateFilter"
    
    // parameters
    ,scale: 1
    
    // this is the filter constructor
    ,init: function( scale ) {
        var self = this;
        self.scale = scale || 1;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                scale: self.scale
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.scale = params.scale;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        var self = this;
        if ( !self._isOn || self.scale <= 1 ) return im;
        if ( self.scale > 100 ) self.scale = 100;
        
        var imLen = im.length, imArea = (imLen>>>2), 
            step, step_2, step_1, stepw, hstep, wstep, hstepw, wRem, hRem,
            inv_size, inv_size1, inv_size1w, inv_size1h, inv_size1hw, 
            inv_sizes, inv_sizew, inv_sizeh, inv_sizewh,
            integral, colR, colG, colB,
            rowLen = (w<<1)+w, imageIndicesX, imageIndicesY,
            i, j, x, y, yw, px, py, pyw, pi,
            xOff1, yOff1, xOff2, yOff2, 
            bx1, by1, bx2, by2, 
            p1, p2, p3, p4, 
            r, g, b, r1, g1, b1, r2, g2, b2
        ;
        
    
        step = ~~(Sqrt(imArea)*self.scale*0.01);
        step_2 = step>>1; step_1 = step-1;
        stepw = w*step; hstep = (h%step); wstep = (w%step); hstepw = (hstep-1)*w;
        inv_size1 = 1.0/(step*step); inv_size1w = 1.0/(wstep*step); inv_size1h = 1.0/(hstep*step); inv_size1hw = 1.0/(wstep*hstep);
        inv_sizes = 2*inv_size1; inv_sizew = 2*inv_size1w; inv_sizeh = 2*inv_size1h; inv_sizewh = 2*inv_size1hw;
        
        // pre-compute indices, 
        imageIndicesX = step_1; imageIndicesY = step_1*w;
        // borders
        bx1=0; bx2=w-1; by1=0; by2=imArea-w;
        
        // compute integral image in one pass (enables fast pixelation in linear time)
        integral = new A32F(imArea*3);
        
        // first row
        i=0; j=0; x=0; colR=colG=colB=0;
        for (x=0; x<w; x++, i+=4, j+=3)
        {
            colR += im[i]; colG += im[i+1]; colB += im[i+2];
            integral[j] = colR; integral[j+1] = colG; integral[j+2] = colB;
        }
        // other rows
        j=0; x=0; colR=colG=colB=0;
        for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
        {
            if (x>=w) { x=0; colR=colG=colB=0; }
            colR += im[i]; colG += im[i+1]; colB += im[i+2];
            integral[j+rowLen] = integral[j] + colR; 
            integral[j+rowLen+1] = integral[j+1] + colG;  
            integral[j+rowLen+2] = integral[j+2] + colB;
        }
        
        // first block
        x = 0; y = 0; yw = 0;
        // calculate the weighed sum of the source image pixels that
        // fall under the pixelate convolution matrix
        
        // first triangle
        xOff1 = x; yOff1 = yw;
        xOff2 = x-step_2 + imageIndicesX; yOff2 = yw+imageIndicesY;
        
        // fix borders
        xOff2 = (xOff2>bx2) ? bx2 : xOff2;
        yOff2 = (yOff2>by2) ? by2 : yOff2;
        
        // compute integral positions
        p1 = (xOff1 + yOff1); p4 = (xOff2+yOff2); p2 = (xOff2 + yOff1); p3 = (xOff1 + yOff2);
        p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
        
        inv_size = inv_sizes;
        // compute matrix sum of these elements
        r1 = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
        g1 = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
        b1 = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
        
        // second triangle
        xOff1 = x+step_2;
        xOff2 = x+imageIndicesX;
        
        // fix borders
        xOff2 = (xOff2>bx2) ? bx2 : xOff2;
        
        // compute integral positions
        p1 = (xOff1 + yOff1); p4 = (xOff2+yOff2); p2 = (xOff2 + yOff1); p3 = (xOff1 + yOff2);
        p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
        
        // compute matrix sum of these elements
        r2 = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
        g2 = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
        b2 = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
        
        if (notSupportClamp)
        {   
            // clamp them manually
            r1 = (r1<0) ? 0 : ((r1>255) ? 255 : r1);
            g1 = (g1<0) ? 0 : ((g1>255) ? 255 : g1);
            b1 = (b1<0) ? 0 : ((b1>255) ? 255 : b1);
            r2 = (r2<0) ? 0 : ((r2>255) ? 255 : r2);
            g2 = (g2<0) ? 0 : ((g2>255) ? 255 : g2);
            b2 = (b2<0) ? 0 : ((b2>255) ? 255 : b2);
        }
        r1 = ~~r1;  g1 = ~~g1;  b1 = ~~b1; // alpha channel is not transformed
        r2 = ~~r2;  g2 = ~~g2;  b2 = ~~b2; // alpha channel is not transformed
        
        // render first triangle
        r = r1; g = g1; b = b1;
        
        // do direct pixelate convolution
        px = 0; py = 0; pyw = 0;
        for (i=0; i<imLen; i+=4)
        {
            // output
            // replace the area equal to the given pixelate size
            // with the average color, computed in previous step
            pi = (px+x + pyw+yw)<<2;
            im[pi] = r;  im[pi+1] = g;  im[pi+2] = b; 
            
            // next pixel
            px++; 
            if ( px+x >= w || px >= step ) 
            { 
                px=0; py++; pyw+=w; 
                // render first triangle, faster if put here
                r = r1; g = g1; b = b1;
            }
            // these edge conditions create the various triangular patterns
            if ( px > step_1-py ) 
            { 
                // render second triangle
                r = r2; g = g2; b = b2;
            }
            /*else
            {
                 // render first triangle
                r = r1; g = g1; b = b1;
            }*/
            
            
            // next block
            if (py + y >= h || py >= step)
            {
                // update image coordinates
                x += step; if (x >= w)  { x=0; y+=step; yw+=stepw; }
                px = 0; py = 0; pyw = 0;
                
                // calculate the weighed sum of the source image pixels that
                // fall under the pixelate convolution matrix
                
                // first triangle
                xOff1 = x; yOff1 = yw;  
                xOff2 = x - step_2 + imageIndicesX; yOff2 = yw + imageIndicesY;
                
                // fix borders
                xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                yOff2 = (yOff2>by2) ? by2 : yOff2;
                
                // compute integral positions
                p1 = (xOff1 + yOff1); p4 = (xOff2+yOff2); p2 = (xOff2 + yOff1); p3 = (xOff1 + yOff2);
                p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
                
                // get correct area size
                wRem = (0==xOff2-xOff1+step_2-wstep+1);
                hRem = (0==yOff2-yOff1-hstepw);
                inv_size = (wRem && hRem) ? inv_sizewh : ((wRem) ? inv_sizew : ((hRem) ? inv_sizeh : inv_sizes));
                
                // compute matrix sum of these elements
                r1 = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                g1 = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                b1 = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                
                // second triangle
                xOff1 = x + step_2;
                xOff2 = x + imageIndicesX;
                
                // fix borders
                xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                
                // compute integral positions
                p1 = (xOff1 + yOff1); p4 = (xOff2+yOff2); p2 = (xOff2 + yOff1); p3 = (xOff1 + yOff2);
                p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
                
                // get correct area size
                wRem = (0==xOff2-xOff1+step_2-wstep+1);
                inv_size = (wRem && hRem) ? inv_sizewh : ((wRem) ? inv_sizew : ((hRem) ? inv_sizeh : inv_sizes));
                
                // compute matrix sum of these elements
                r2 = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                g2 = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                b2 = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                
                if (notSupportClamp)
                {   
                    // clamp them manually
                    r1 = (r1<0) ? 0 : ((r1>255) ? 255 : r1);
                    g1 = (g1<0) ? 0 : ((g1>255) ? 255 : g1);
                    b1 = (b1<0) ? 0 : ((b1>255) ? 255 : b1);
                    r2 = (r2<0) ? 0 : ((r2>255) ? 255 : r2);
                    g2 = (g2<0) ? 0 : ((g2>255) ? 255 : g2);
                    b2 = (b2<0) ? 0 : ((b2>255) ? 255 : b2);
                }
                r1 = ~~r1;  g1 = ~~g1;  b1 = ~~b1; // alpha channel is not transformed
                r2 = ~~r2;  g2 = ~~g2;  b2 = ~~b2; // alpha channel is not transformed
                
                // render first triangle
                r = r1; g = g1; b = b1;
            }
        }
        
        // return the pixelated image data
        return im;
    }
});

}(FILTER);/**
*
* Halftone Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var f1 = 7/16, f2 = 3/16, f3 = 5/16, f4 = 1/16, 
    A32F = FILTER.Array32F, clamp = FILTER.Color.clamp,
    RGB2YCbCr = FILTER.Color.RGB2YCbCr, YCbCr2RGB = FILTER.Color.YCbCr2RGB;

// http://en.wikipedia.org/wiki/Halftone
// http://en.wikipedia.org/wiki/Error_diffusion
// http://www.visgraf.impa.br/Courses/ip00/proj/Dithering1/average_dithering.html
// http://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering
FILTER.Create({
    name: "HalftoneFilter"
    
    // parameters
    ,_threshold: 0.4
    ,_size: 1
    ,_grayscale: false
    
    // this is the filter constructor
    ,init: function( size, threshold, grayscale ) {
        var self = this;
        self._size = size || 1;
        self._threshold = clamp(undef === threshold ? 0.4 : threshold,0,1);
        self._grayscale = !!grayscale;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,size: function( s ) {
        this._size = s;
        return this;
    }
    
    ,threshold: function( t ) {
        this._threshold = clamp(t,0,1);
        return this;
    }
    
    ,grayscale: function( bool ) {
        if ( !arguments.length ) bool = true;
        this._grayscale = !!bool;
        return this;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _size: self._size
                ,_threshold: self._threshold
                ,_grayscale: self._grayscale
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._size = params._size;
            self._threshold = params._threshold;
            self._grayscale = params._grayscale;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this, l = im.length, imSize = l>>>2,
            err = new A32F(imSize*3), pixel, index, t, rgb, ycbcr,
            size = self._size, area = size*size, invarea = 1.0/area,
            threshold = 255*self._threshold, size2 = size2<<1,
            colored = !self._grayscale,
            x, y, yw, sw = size*w, i, j, jw, 
            sum_r, sum_g, sum_b, qr, qg, qb
            ,f11 = /*area**/f1, f22 = /*area**/f2
            ,f33 = /*area**/f3, f44 = /*area**/f4
        ;
        
        y=0; yw=0; x=0;
        while ( y < h )
        {
            sum_r = sum_g = sum_b = 0;
            i=0; j=0; jw=0;
            while ( j < size )
            {
                pixel = (x+yw+i+jw)<<2; index = (x+yw+i+jw)*3;
                sum_r += im[pixel] + err[index];
                sum_g += im[pixel+1] + err[index+1];
                sum_b += im[pixel+2] + err[index+2];
                i++;
                if ( i>=size ) {i=0; j++; jw+=w;}
            }
            sum_r *= invarea; sum_g *= invarea; sum_b *= invarea;
            ycbcr = colored ? RGB2YCbCr([sum_r, sum_g, sum_b]) : [sum_r, sum_g, sum_b];
            t = ycbcr[0];
            if ( t > threshold )
            {
                if ( colored ) 
                {
                    ycbcr[0] = /*255;*/clamp(~~t, 0, 255);
                    rgb = YCbCr2RGB(ycbcr);
                }
                else
                {                    
                    rgb = [255,255,255];
                }
            }
            else
            {                
                rgb = [0,0,0];
            }
            pixel = (x+yw)<<2;
            qr = im[pixel] - rgb[0];
            qg = im[pixel+1] - rgb[1];
            qb = im[pixel+2] - rgb[2];
            
            if ( x+size<w )
            {                
                i=size; j=0; jw=0;
                while ( j < size )
                {
                    index = (x+yw+i+jw)*3;
                    err[index] += f11*qr;
                    err[index+1] += f11*qg;
                    err[index+2] += f11*qb;
                    i++;
                    if ( i>=size2 ) {i=size; j++; jw+=w;}
                }
            }
            if ( y+size<h && x>size) 
            {
                i=-size; j=size; jw=0;
                while ( j < size2 )
                {
                    index = (x+yw+i+jw)*3;
                    err[index] += f22*qr;
                    err[index+1] += f22*qg;
                    err[index+2] += f22*qb;
                    i++;
                    if ( i>=0 ) {i=-size; j++; jw+=w;}
                }
            }
            if ( y+size<h ) 
            {
                i=0; j=size; jw=0;
                while ( j < size2 )
                {
                    index = (x+yw+i+jw)*3;
                    err[index] += f33*qr;
                    err[index+1] += f33*qg;
                    err[index+2] += f33*qb;
                    i++;
                    if ( i>=size ) {i=0; j++; jw+=w;}
                }
            }
            if ( y+size<h && x+size<w )
            {
                i=size; j=size; jw=0;
                while ( j < size2 )
                {
                    index = (x+yw+i+jw)*3;
                    err[index] += f44*qr;
                    err[index+1] += f44*qg;
                    err[index+2] += f44*qb;
                    i++;
                    if ( i>=size2 ) {i=size; j++; jw+=w;}
                }
            }
            
            i=0; j=0; jw=0;
            while ( j < size )
            {
                pixel = (x+yw+i+jw)<<2;
                im[pixel] = rgb[0];
                im[pixel+1] = rgb[1];
                im[pixel+2] = rgb[2];
                i++;
                if ( i>=size ) {i=0; j++; jw+=w;}
            }
            
            x+=size;
            if ( x>=w ) {x=0; y+=size; yw+=sw;}
        }
        return im;
    }
});

}(FILTER);/**
*
* Bokeh (Depth-of-Field) Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var Sqrt=Math.sqrt, Exp=Math.exp, Log=Math.log, 
    Abs=Math.abs, Floor=Math.floor,
    notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F;

// a simple bokeh (depth-of-field) filter
FILTER.Create({
    name: "BokehFilter"
    
    // parameters
    ,centerX: 0
    ,centerY: 0
    ,radius: 10
    ,amount: 10
    
    // this is the filter constructor
    ,init: function( centerX, centerY, radius, amount ) {
        var self = this;
        self.centerX = centerX || 0;
        self.centerY = centerY || 0;
        self.radius = radius || 10;
        self.amount = amount || 10;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                centerX: self.centerX
                ,centerY: self.centerY
                ,radius: self.radius
                ,amount: self.amount
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.centerX = params.centerX;
            self.centerY = params.centerY;
            self.radius = params.radius;
            self.amount = params.amount;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        var self = this;
        if ( !self._isOn ) return im;
        var imLen = im.length, imArea, 
            integral, integralLen, colR, colG, colB,
            rowLen, i, j, x , y, ty, 
            cX = self.centerX||0, cY = self.centerY||0, 
            r = self.radius, m = self.amount,
            d, dx, dy, blur, blurw, wt,
            xOff1, yOff1, xOff2, yOff2,
            p1, p2, p3, p4, t0, t1, t2,
            bx1, bx2, by1, by2
        ;
        
        if ( m<=0 ) return im;
        
        imArea = (imLen>>2);
        bx1=0; bx2=w-1; by1=0; by2=imArea-w;
        
        // make center relative
        cX = Floor(cX*(w-1));
        cY = Floor(cY*(h-1));
        
        integralLen = (imArea<<1)+imArea;  rowLen = (w<<1)+w;
        integral = new A32F(integralLen);
        
        // compute integral of image in one pass
        // first row
        i=0; j=0; x=0; colR=colG=colB=0;
        for (x=0; x<w; x++, i+=4, j+=3)
        {
            colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
            integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
        }
        // other rows
        i=rowLen+w; j=0; x=0; colR=colG=colB=0;
        for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
        {
            if (x>=w) { x=0; colR=colG=colB=0; }
            colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
            integral[j+rowLen]=integral[j]+colR; 
            integral[j+rowLen+1]=integral[j+1]+colG; 
            integral[j+rowLen+2]=integral[j+2]+colB;
        }
        
        
        // bokeh (depth-of-field) effect 
        // is a kind of adaptive blurring depending on distance from a center
        // like the camera/eye is focused on a specific area and everything else appears increasingly blurred
        
        x=0; y=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; y++; ty+=w; }
            
            // compute distance
            dx = x-cX; dy = y-cY;
            //d = Sqrt(dx*dx + dy*dy);
            d = Abs(dx) + Abs(dy);  // approximation
            
            // calculate amount(radius) of blurring 
            // depending on distance from focus center
            blur = (d>r) ? ~~Log((d-r)*m) : ~~(d/r+0.5); // smooth it a bit, around the radius edge condition
            
            if (blur>0)
            {
                 blurw = blur*w; wt = 0.25/(blur*blur);
                 
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                xOff1 = x - blur; yOff1 = ty - blurw;
                xOff2 = x + blur; yOff2 = ty + blurw;
                
                // fix borders
                if (xOff1<bx1) xOff1=bx1;
                else if (xOff2>bx2) xOff2=bx2;
                if (yOff1<by1) yOff1=by1;
                else if (yOff2>by2) yOff2=by2;
                
                // compute integral positions
                p1 = xOff1 + yOff1; p4 = xOff2 + yOff2; p2 = xOff2 + yOff1; p3 = xOff1 + yOff2;
                // arguably faster way to write p1*=3; etc..
                p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
                
                // apply a fast box-blur to these pixels
                // compute matrix sum of these elements 
                // (trying to avoid possible overflow in the process, order of summation can matter)
                t0 = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                t1 = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                t2 = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                
                // output
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                }
                im[i] = ~~t0;  im[i+1] = ~~t1;  im[i+2] = ~~t2;
                // alpha channel is not transformed
                //im[i+3] = im[i+3];
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Seamless Tile Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

// a plugin to create a seamless tileable pattern from an image
// adapted from: http://www.blitzbasic.com/Community/posts.php?topic=43846
FILTER.Create({
    name: "SeamlessTileFilter"
    
    ,type: 0 // 0 radial, 1 linear 1, 2 linear 2
    
    // constructor
    ,init: function( tiling_type ) {
        var self = this;
        self.type = tiling_type || 0;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                type: self.type
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.type = params.type;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    // adapted from: http://www.blitzbasic.com/Community/posts.php?topic=43846
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        var self = this, masktype = self.type,
            //needed arrays
            diagonal, tile, mask, a1, a2, a3, d, i, j, k, 
            index, N, N2, size, imSize;

        //find largest side of the image
        //and resize the image to become square
        if ( w !== h ) im = FILTER.Image.resize( im, w, h, N = w > h ? w : h, N );
        else  N = w; 
        N2 = Math.round(N/2);
        size = N*N; imSize = im.length;
        diagonal = new FILTER.ImArray(imSize);
        tile = new FILTER.ImArray(imSize);
        mask = new FILTER.Array8U(size);

        i = 0; j = 0;
        for (k=0; k<imSize; k+=4,i++)
        {
            if ( i >= N ) {i=0; j++;}
            index = ((i+N2)%N + ((j+N2)%N)*N)<<2;
            diagonal[ index   ] = im[ k ];
            diagonal[ index+1 ] = im[ k+1 ];
            diagonal[ index+2 ] = im[ k+2 ];
            diagonal[ index+3 ] = im[ k+3 ];
        }

        //try to make your own masktypes here
        //Create the mask
        for (i=0; i<=N2-1; i++)
        {
            for (j=0; j<=N2-1; j++)
            {
                switch(masktype)
                {
                    case 0://RADIAL
                    d = Math.sqrt((i-N2)*(i-N2) + (j-N2)*(j-N2)) / N2;
                    break;

                    case 1://LINEAR 1
                    if ( (N2-i) < (N2-j) )
                        d = (j-N2)/N2;

                    else //if ( (N2-i) >= (N2-j) )
                        d = (i-N/2)/N2;
                    break;

                    case 2://LINEAR 2
                    default:
                    if ( (N2-i) < (N2-j) )
                        d = Math.sqrt((j-N)*(j-N) + (i-N)*(i-N)) / (1.13*N);

                    else //if ( (N2-i)>=(N2-j) )
                        d = Math.sqrt((i-N)*(i-N) + (j-N)*(j-N)) / (1.13*N);
                    break;
                }
                //Scale d To range from 1 To 255
                d = 255 - (255 * d);
                if (d < 1) d = 1;
                else if (d > 255) d = 255;

                //Form the mask in Each quadrant
                mask [i     + j*N      ] = d;
                mask [i     + (N-1-j)*N] = d;
                mask [N-1-i + j*N      ] = d;
                mask [N-1-i + (N-1-j)*N] = d;
            }
        }

        //Create the tile
        for (j=0; j<=N-1; j++)
        {
            for (i=0; i<=N-1; i++)
            {
                index = i+j*N;
                a1 = mask[index]; a2 = mask[(i+N2) % N + ((j+N2) % N)*N];
                a3 = a1+a2; a1 /= a3; a2 /= a3; index <<= 2;
                tile[index  ] = ~~(a1*im[index]   + a2*diagonal[index]);
                tile[index+1] = ~~(a1*im[index+1] + a2*diagonal[index+1]);
                tile[index+2] = ~~(a1*im[index+2] + a2*diagonal[index+2]);
                tile[index+3] = im[index+3];
            }
        }

        //create the new tileable image
        //if it wasn't a square image, resize it back to the original scale
        if ( w !== h ) tile = FILTER.Image.resize( tile, N, N, w, h );

        // return the new image data
        return tile;
    }
});

}(FILTER);/**
*
* FloodFill Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

// a fast flood fill filter using scanline algorithm
// adapted from: A Seed Fill Algorithm, by Paul Heckbert from "Graphics Gems", Academic Press, 1990
// http://en.wikipedia.org/wiki/Flood_fill
// http://www.codeproject.com/Articles/6017/QuickFill-An-efficient-flood-fill-algorithm
// http://www.codeproject.com/Articles/16405/Queue-Linear-Flood-Fill-A-Fast-Flood-Fill-Algorith
FILTER.Create({
    name : "FloodFillFilter"
    ,x: 0
    ,y: 0
    ,color: null
    ,tolerance: 0.0
    
    ,path: FILTER.getPath( exports.AMD )
    
    ,init: function( x, y, color, tolerance ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.color = color || [0,0,0];
        self.tolerance = tolerance || 0.0;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 color: self.color
                ,x: self.x
                ,y: self.y
                ,tolerance: self.tolerance
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.color = params.color;
            self.x = params.x;
            self.y = params.y;
            self.tolerance = params.tolerance;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    /* adapted from:
     * A Seed Fill Algorithm
     * by Paul Heckbert
     * from "Graphics Gems", Academic Press, 1990
     */
    ,apply: function(im, w, h/*, image*/) {
        var self = this, 
            /* seems to have issues when tol is exactly 1.0*/
            tol = ~~(255*(self.tolerance>=1.0 ? 0.999 : self.tolerance)), 
            OC, NC = self.color, /*pix = 4,*/ dy = w<<2, 
            x0 = self.x, y0 = self.y, imSize = im.length, 
            ymin = 0, ymax = imSize-dy, xmin = 0, xmax = (w-1)<<2,
            l, i, x, x1, x2, yw, stack, segment, notdone, abs = Math.abs
        /*
         * Filled horizontal segment of scanline y for xl<=x<=xr.
         * Parent segment was on line y-dy.  dy=1 or -1
         */
        yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ||
            (im[x0+yw] === NC[0] && im[x0+yw+1] === NC[1] && im[x0+yw+2] === NC[2]) ) return im;
        
        // seed color is the image color at x0,y0 position
        OC = [im[x0+yw], im[x0+yw+1], im[x0+yw+2]];    
        stack = [];
        if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, x0, x0, dy]); /* needed in some cases */
        /*if ( yw >= ymin && yw <= ymax)*/ stack.push([yw+dy, x0, x0, -dy]); /* seed segment (popped 1st) */
        
        while ( stack.length ) 
        {
            /* pop segment off stack and fill a neighboring scan line */
            segment = stack.pop();
            yw = segment[0]+(dy=segment[3]); x1 = segment[1]; x2 = segment[2];
            
            /*
             * segment of scan line y-dy for x1<=x<=x2 was previously filled,
             * now explore adjacent pixels in scan line y
             */
            for (x=x1; x>=xmin; x-=4)
            {
                i = x+yw;
                if ( abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                }
                else
                {
                    break;
                }
            }
            if ( x >= x1 ) 
            {
                // goto skip:
                while ( x<=x2 && !(abs(OC[0]-im[x+yw])<=tol && abs(OC[1]-im[x+yw+1])<=tol && abs(OC[2]-im[x+yw+2])<=tol) ) 
                    x+=4;
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+4;
                if ( l < x1 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, l, x1-4, -dy]);  /* leak on left? */
                }
                x = x1+4;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                i = x+yw;
                while ( x<=xmax && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                    x+=4; i = x+yw;
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, l, x-4, dy]);
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, x2+4, x-4, -dy]);	/* leak on right? */
                }
    /*skip:*/   while ( x<=x2 && !(abs(OC[0]-im[x+yw])<=tol && abs(OC[1]-im[x+yw+1])<=tol && abs(OC[2]-im[x+yw+2])<=tol) ) 
                    x+=4;
                l = x;
                notdone = (x <= x2);
            }
        }
        
        // return the new image data
        return im;
    }
});

/*    
FILTER.Create({
    name : "PatternFillFilter"
    ,x: 0
    ,y: 0
    ,tolerance: 0.0
    ,pattern: null
    ,_pattern: null
    ,mode: 0 // 0 tile, 1 stretch
    
    ,path: FILTER.getPath( exports.AMD )
    
    ,init: function( x, y, pattern, mode, tolerance ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.setPattern( pattern );
        self.mode = mode || 0;
        self.tolerance = tolerance || 0.0;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.pattern = null;
        self._pattern = null;
        self.$super('dispose');
        return self;
    }
    
    ,setPattern( pattern ) {
        var self = this;
        if ( pattern instanceof FILTER.Image )
        {
            self.pattern = pattern;
            self._pattern = {data:pattern.getData(), width:pattern.width, height:pattern.height};
        }
        else
        {
            self.pattern = null;
            self._pattern = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 x: self.x
                ,y: self.y
                ,tolerance: self.tolerance
                ,mode: self.mode
                ,_pattern: self._pattern
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.x = params.x;
            self.y = params.y;
            self.tolerance = params.tolerance;
            self.mode = params.mode;
            self._pattern = params._pattern;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
         if ( !this._pattern ) return im;
        var self = this, 
            // seems to have issues when tol is exactly 1.0
            tol = ~~(255*(self.tolerance>=1.0 ? 0.999 : self.tolerance)), 
            OC, dy = w<<2, pattern = self._pattern.data,
            pw = self._pattern.width, ph = self._pattern.height, 
            x0 = self.x, y0 = self.y, imSize = im.length, 
            ymin = 0, ymax = imSize-dy, xmin = 0, xmax = (w-1)<<2,
            l, i, x, x1, x2, yw, stack, segment, notdone, abs = Math.abs

            yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ) return im;
        
        stack = [];
        if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, x0, x0, dy]); // needed in some cases 
        stack.push([yw+dy, x0, x0, -dy]); // seed segment (popped 1st)
        
        while ( stack.length ) 
        {
            // pop segment off stack and fill a neighboring scan line 
            segment = stack.pop();
            yw = segment[0]+(dy=segment[3]); x1 = segment[1]; x2 = segment[2];
            
            // segment of scan line y-dy for x1<=x<=x2 was previously filled,
            // now explore adjacent pixels in scan line y
            for (x=x1; x>=xmin; x-=4)
            {
                i = x+yw;
                if ( abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                }
                else
                {
                    break;
                }
            }
            if ( x >= x1 ) 
            {
                // goto skip:
                while ( x<=x2 && !(abs(OC[0]-im[x+yw])<=tol && abs(OC[1]-im[x+yw+1])<=tol && abs(OC[2]-im[x+yw+2])<=tol) ) 
                    x+=4;
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+4;
                if ( l < x1 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, l, x1-4, -dy]);  // leak on left?
                }
                x = x1+4;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                i = x+yw;
                while ( x<=xmax && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                    x+=4; i = x+yw;
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, l, x-4, dy]);
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, x2+4, x-4, -dy]);	// leak on right?
                }
    /*skip:* /   while ( x<=x2 && !(abs(OC[0]-im[x+yw])<=tol && abs(OC[1]-im[x+yw+1])<=tol && abs(OC[2]-im[x+yw+2])<=tol) ) 
                    x+=4;
                l = x;
                notdone = (x <= x2);
            }
        }
        
        // return the new image data
        return im;
    }
});
*/
}(FILTER);/**
*
* HSV Converter Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp=FILTER._notSupportClamp, RGB2HSV=FILTER.Color.RGB2HSV,                 
    toCol = 0.70833333333333333333333333333333 // 255/360
;

// a plugin to convert an RGB Image to an HSV Image
FILTER.Create({
    name: "HSVConverterFilter"
    
    ,path: FILTER.getPath( exports.AMD )
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var /*r,g,b,*/ i, l=im.length, hsv, t0, t1, t2;
        
        if ( notSupportClamp )
        {   
            for (i=0; i<l; i+=4)
            {
                //r = im[i]; g = im[i+1]; b = im[i+2];
                hsv = RGB2HSV(im.subarray(i,i+3));
                t0 = hsv[0]*toCol; t2 = hsv[1]*255; t1 = hsv[2];
                // clamp them manually
                if (t0<0) t0=0;
                else if (t0>255) t0=255;
                if (t1<0) t1=0;
                else if (t1>255) t1=255;
                if (t2<0) t2=0;
                else if (t2>255) t2=255;
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                //r = im[i]; g = im[i+1]; b = im[i+2];
                hsv = RGB2HSV(im.subarray(i,i+3));
                t0 = hsv[0]*toCol; t2 = hsv[1]*255; t1 = hsv[2];
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Threshold Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp=FILTER._notSupportClamp,
    RGBA2Color=FILTER.Color.RGBA2Color, Color2RGBA=FILTER.Color.Color2RGBA
    ;

// a plugin to apply a general threshold filtering to an image
FILTER.Create({
    name: "ThresholdFilter"
    
    // filter parameters
    ,thresholds: null
    // NOTE: quantizedColors should contain 1 more element than thresholds
    ,quantizedColors: null
    
    // constructor
    ,init: function( thresholds, quantizedColors ) {
        var self = this;
        self.thresholds = thresholds;
        self.quantizedColors = quantizedColors || null;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                thresholds: self.thresholds
                ,quantizedColors: self.quantizedColors
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.thresholds = params.thresholds;
            self.quantizedColors = params.quantizedColors;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if (!self._isOn || !self.thresholds || !self.thresholds.length || 
            !self.quantizedColors || !self.quantizedColors.length) return im;
        
        var color, rgba,
            i, j, l=im.length,
            thresholds=self.thresholds, tl=thresholds.length, colors=self.quantizedColors, cl=colors.length
        ;
        
        for (i=0; i<l; i+=4)
        {
            color = RGBA2Color(im.subarray[i,i+4]);
            
            // maybe use sth faster here ??
            j=0; while (j<tl && color>thresholds[j]) j++;
            color = (j<cl) ? colors[j] : 255;
            
            rgba = Color2RGBA(color);
            //im.set(rgba,i);
            im[i] = rgba[0]; im[i+1] = rgba[1]; im[i+2] = rgba[2]; im[i+3] = rgba[3];
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Hue Extractor Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp=FILTER._notSupportClamp,
    IMG=FILTER.ImArray, clamp=FILTER.Color.clampPixel,
    RGB2HSV=FILTER.Color.RGB2HSV, HSV2RGB=FILTER.Color.HSV2RGB, Color2RGBA=FILTER.Color.Color2RGBA
    ;

// a plugin to extract regions based on a HUE range
FILTER.Create({
    name: "HueExtractorFilter"
    
    // filter parameters
    ,range : null
    ,background : 0
    
    // constructor
    ,init : function( range, background ) {
        var self = this;
        self.range = range;
        self.background = background || 0;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                range: self.range
                ,background: self.background
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.range = params.range;
            self.background = params.background;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if (!self._isOn || !self.range || !self.range.length) return im;
        
        var /*r, g, b,*/ br, bg, bb, ba,
            i, l=im.length, background, hue,
            hMin=self.range[0], hMax=self.range[self.range.length-1]
            ;
        
        background = Color2RGBA(self.background||0);
        br = ~~clamp(background[0]); 
        bg = ~~clamp(background[1]); 
        bb = ~~clamp(background[2]); 
        ba = ~~clamp(background[3]);
        
        for (i=0; i<l; i+=4)
        {
            //r = im[i]; g = im[i+1]; b = im[i+2];
            hue = RGB2HSV(im.subarray(i,i+3))[0];
            
            if (hue<hMin || hue>hMax) 
            {  
                im[i] = br; im[i+1] = bg; im[i+2] = bb; im[i+3] = ba; 
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Canny Edges Detector Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var Float32 = FILTER.Array32F, Int32 = FILTER.Array32I,
    GAUSSIAN_CUT_OFF = 0.005,
    MAGNITUDE_SCALE = 100,
    MAGNITUDE_LIMIT = 1000,
    MAGNITUDE_MAX = MAGNITUDE_SCALE * MAGNITUDE_LIMIT,
    PI2 = FILTER.CONSTANTS.PI2, abs = Math.abs, exp = Math.exp,
    hypot
;

// private utility methods
//NOTE: It is quite feasible to replace the implementation of this method
//with one which only loosely approximates the hypot function. I've tested
//simple approximations such as Math.abs(x) + Math.abs(y) and they work fine.
hypot = Math.hypot 
        ? Math.hypot 
        : /*function( x, y ){
            var absx = abs(x), 
                absy = abs(y),
                r, max;
            // avoid overflows
            if ( absx > absy )
            {
                max = absx;
                r = absy / max;
                
            }
            else
            {
                max = absy;
                if ( 0 == max ) return 0;
                r = absx / max;
            }
            return max*Math.sqrt(1.0 + r*r);
        }*/
        function(x, y){ return abs(x)+abs(y); };
        
/*function gaussian(x, sigma2) 
{
    return exp(-(x * x) / (2 * sigma2)); //sigma * sigma
}*/

function computeGradients(data, width, height, magnitude, kernelRadius, kernelWidth) 
{
    
    //generate the gaussian convolution masks
    var picsize = data.length,
        xConv = new Float32(picsize),
        yConv = new Float32(picsize),
        xGradient = new Float32(picsize),
        yGradient = new Float32(picsize),
        kernel = new Float32(kernelWidth),
        diffKernel = new Float32(kernelWidth),
        sigma2 = kernelRadius*kernelRadius, sigma22 = 2 * sigma2,
        factor = (FILTER.CONSTANTS.PI2 * /*kernelRadius * kernelRadius*/sigma2),
        kwidth, g1, g2, g3, x;
    for (kwidth = 0; kwidth < kernelWidth; kwidth++) 
    {
        g1 = exp(-(kwidth * kwidth) / sigma22); // gaussian
        if ( g1 <= GAUSSIAN_CUT_OFF && kwidth >= 2 ) break;
        g2 = exp(-((x=kwidth - 0.5) * x) / sigma22); // gaussian
        g3 = exp(-((x=kwidth + 0.5) * x) / sigma22); // gaussian
        kernel[kwidth] = (g1 + g2 + g3) / 3 / factor;
        diffKernel[kwidth] = g3 - g2;
    }

    var initX = kwidth - 1,
        maxX = width - (kwidth - 1),
        initY = width * (kwidth - 1),
        maxY = width * (height - (kwidth - 1)),
        x, y, index, sumX, sumY, xOffset, yOffset,
        sum, i
    ;
    
    //perform convolution in x and y directions
    for (x = initX; x < maxX; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
            index = x + y;
            sumX = data[index] * kernel[0];
            sumY = sumX;
            xOffset = 1;
            yOffset = width;
            for(; xOffset < kwidth ;) 
            {
                sumY += kernel[xOffset] * (data[index - yOffset] + data[index + yOffset]);
                sumX += kernel[xOffset] * (data[index - xOffset] + data[index + xOffset]);
                yOffset += width;
                xOffset++;
            }
            
            yConv[index] = sumY;
            xConv[index] = sumX;
        }

    }

    for (x = initX; x < maxX; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
            sum = 0;
            index = x + y;
            for (i = 1; i < kwidth; i++)
                sum += diffKernel[i] * (yConv[index - i] - yConv[index + i]);

            xGradient[index] = sum;
        }

    }

    for (x = kwidth; x < width - kwidth; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
            sum = 0.0;
            index = x + y;
            yOffset = width;
            for (i = 1; i < kwidth; i++) 
            {
                sum += diffKernel[i] * (xConv[index - yOffset] - xConv[index + yOffset]);
                yOffset += width;
            }

            yGradient[index] = sum;
        }

    }

    initX = kwidth;
    maxX = width - kwidth;
    initY = width * kwidth;
    maxY = width * (height - kwidth);
    var indexN, indexS, indexE, indexW,
        indexNW, indexNE, indexSW, indexSE,
        xGrad, yGrad, gradMag, tmp,
        nMag, sMag, eMag, wMag,
        nwMag, neMag, swMag, seMag
    ;
    for (x = initX; x < maxX; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
            index = x + y;
            indexN = index - width;
            indexS = index + width;
            indexW = index - 1;
            indexE = index + 1;
            indexNW = indexN - 1;
            indexNE = indexN + 1;
            indexSW = indexS - 1;
            indexSE = indexS + 1;
            
            xGrad = xGradient[index];
            yGrad = yGradient[index];
            gradMag = hypot(xGrad, yGrad);

            //perform non-maximal supression
            nMag = hypot(xGradient[indexN], yGradient[indexN]);
            sMag = hypot(xGradient[indexS], yGradient[indexS]);
            wMag = hypot(xGradient[indexW], yGradient[indexW]);
            eMag = hypot(xGradient[indexE], yGradient[indexE]);
            neMag = hypot(xGradient[indexNE], yGradient[indexNE]);
            seMag = hypot(xGradient[indexSE], yGradient[indexSE]);
            swMag = hypot(xGradient[indexSW], yGradient[indexSW]);
            nwMag = hypot(xGradient[indexNW], yGradient[indexNW]);
            //tmp;
            /*
             * An explanation of what's happening here, for those who want
             * to understand the source: This performs the "non-maximal
             * supression" phase of the Canny edge detection in which we
             * need to compare the gradient magnitude to that in the
             * direction of the gradient; only if the value is a local
             * maximum do we consider the point as an edge candidate.
             * 
             * We need to break the comparison into a number of different
             * cases depending on the gradient direction so that the
             * appropriate values can be used. To avoid computing the
             * gradient direction, we use two simple comparisons: first we
             * check that the partial derivatives have the same sign (1)
             * and then we check which is larger (2). As a consequence, we
             * have reduced the problem to one of four identical cases that
             * each test the central gradient magnitude against the values at
             * two points with 'identical support'; what this means is that
             * the geometry required to accurately interpolate the magnitude
             * of gradient function at those points has an identical
             * geometry (upto right-angled-rotation/reflection).
             * 
             * When comparing the central gradient to the two interpolated
             * values, we avoid performing any divisions by multiplying both
             * sides of each inequality by the greater of the two partial
             * derivatives. The common comparand is stored in a temporary
             * variable (3) and reused in the mirror case (4).
             * 
             */
            if (xGrad * yGrad <= 0 /*(1)*/
                ? abs(xGrad) >= abs(yGrad) /*(2)*/
                    ? (tmp = abs(xGrad * gradMag)) >= abs(yGrad * neMag - (xGrad + yGrad) * eMag) /*(3)*/
                        && tmp > abs(yGrad * swMag - (xGrad + yGrad) * wMag) /*(4)*/
                    : (tmp = abs(yGrad * gradMag)) >= abs(xGrad * neMag - (yGrad + xGrad) * nMag) /*(3)*/
                        && tmp > abs(xGrad * swMag - (yGrad + xGrad) * sMag) /*(4)*/
                : abs(xGrad) >= Math.abs(yGrad) /*(2)*/
                    ? (tmp = abs(xGrad * gradMag)) >= abs(yGrad * seMag + (xGrad - yGrad) * eMag) /*(3)*/
                        && tmp > abs(yGrad * nwMag + (xGrad - yGrad) * wMag) /*(4)*/
                    : (tmp =abs(yGrad * gradMag)) >= abs(xGrad * seMag + (yGrad - xGrad) * sMag) /*(3)*/
                        && tmp > abs(xGrad * nwMag + (yGrad - xGrad) * nMag) /*(4)*/
            ) 
            {
                magnitude[index] = gradMag >= MAGNITUDE_LIMIT ? MAGNITUDE_MAX : Math.floor(MAGNITUDE_SCALE * gradMag);
                //NOTE: The orientation of the edge is not employed by this
                //implementation. It is a simple matter to compute it at
                //this point as: Math.atan2(yGrad, xGrad);
            } 
            else 
            {
                magnitude[index] = 0;
            }
        }
    }
}

function performHysteresis(data, width, height, magnitude, low, high) 
{
    //NOTE: this implementation reuses the data array to store both
    //luminance data from the image, and edge intensity from the processing.
    //This is done for memory efficiency, other implementations may wish
    //to separate these functions.
    //Arrays.fill(data, 0);
    var offset = 0, i, y, x, size = data.length;
    for (i=0; i<size; i++) data[i] = 0;

    x = 0; y = 0;
    for (offset=0; offset<size; offset++,x++) 
    {
        if ( x >= width ){x=0; y++;}
        if ( 0 === data[offset] && magnitude[offset] >= high ) 
        {
            follow(data, width, height, magnitude, x, y, offset, low);
        }
    }
}

function follow(data, width, height, magnitude, x1, y1, i1, threshold) 
{
    var
        x0 = x1 == 0 ? x1 : x1 - 1,
        x2 = x1 == width - 1 ? x1 : x1 + 1,
        y0 = y1 == 0 ? y1 : y1 - 1,
        y2 = y1 == height -1 ? y1 : y1 + 1,
        x, y, i2
    ;
    
    data[i1] = magnitude[i1];
    x = x0, y = y0;
    while (x <= x2 && y <= y2)
    {
        i2 = x + y * width;
        if ((y != y1 || x != x1)
            && 0 === data[i2]
            && magnitude[i2] >= threshold
        ) 
        {
            follow(data, width, height, magnitude, x, y, i2, threshold);
            return;
        }
        y++; if ( y>y2 ){y=y0; x++;}
    }
}

/*function luminance(r, g, b) 
{
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}*/

function readLuminance(im, data) 
{
    var i, di, r, g, b, size = im.length, 
        LR = FILTER.LUMA[0], LG = FILTER.LUMA[1], LB = FILTER.LUMA[2];
    for (i=0,di=0; i<size; i+=4,di++) 
    {
        r = im[i]; g = im[i+1]; b = im[i+2];
        data[di] = ~~(LR * r + LG * g + LB * b + 0.5);//luminance(r, g, b);
    }
}

function normalizeContrast(data) 
{
    var histogram = new Int32(256),
        remap = new Int32(256),
        i, size = data.length, 
        sum, j, k, target;
    
    for (i=0; i<size; i++) histogram[data[i]]++;
    
    sum = 0; j = 0;
    for (i = 0; i<256; i++) 
    {
        sum += histogram[i];
        target = sum*255/size;
        for (k = j+1; k <=target; k++) remap[k] = i;
        j = target;
    }
    
    for (i=0; i<size; i++) data[i] = remap[data[i]];
}

function thresholdEdges(im, data) 
{
    var i, di, size = im.length, v;
    for (i=0,di=0; i<size; i+=4,di++) 
    {
        v = data[di] > 0 ? 255 : 0;
        im[i] = im[i+1] = im[i+2] = v;
        //im[i+3] = 255;
    }
}

// an efficient Canny Edges Detector
// adapted from Java: http://www.tomgibara.com/computer-vision/canny-edge-detector
// http://en.wikipedia.org/wiki/Canny_edge_detector
FILTER.Create({
    name : "CannyEdgesFilter"
    
    ,low: 2.5
    ,high: 7.5
    ,gaussRadius: 2
    ,gaussWidth: 16
    ,contrastNormalized: false
    
    ,path: FILTER.getPath( exports.AMD )
    
    ,init: function( lowThreshold, highThreshold, gaussianKernelRadius, gaussianKernelWidth, contrastNormalized ) {
        var self = this;
		self.low = arguments.length < 1 ? 2.5 : lowThreshold;
		self.high = arguments.length < 2 ? 7.5 : highThreshold;
		self.gaussRadius = arguments.length < 3 ? 2 : gaussianKernelRadius;
		self.gaussWidth = arguments.length < 4 ? 16 : gaussianKernelWidth;
        self.contrastNormalized = !!contrastNormalized;
    }
    
    ,thresholds: function( low, high ) {
        var self = this;
        self.low = low;
        self.high = high;
        return self;
    }
    
    ,kernel: function( radius, width ) {
        var self = this;
        self.gaussRadius = radius;
        self.gaussWidth = width;
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 low: self.low
                ,high: self.high
                ,gaussRadius: self.gaussRadius
                ,gaussWidth: self.gaussWidth
                ,contrastNormalized: self.contrastNormalized
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.low = params.low;
            self.high = params.high;
            self.gaussRadius = params.gaussRadius;
            self.gaussWidth = params.gaussWidth;
            self.contrastNormalized = params.contrastNormalized;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this, picsize = im.length>>2, 
            low, high, data, magnitude;
        
        // init arrays
        data = new Int32(picsize);
        magnitude = new Int32(picsize);
        low = Math.round( self.low * MAGNITUDE_SCALE );
        high = Math.round( self.high * MAGNITUDE_SCALE );
        
        readLuminance( im, data );
        
        if ( self.contrastNormalized ) normalizeContrast( data );
        
        computeGradients( 
            data, w, h, magnitude, 
            self.gaussRadius, self.gaussWidth 
        );
        
        performHysteresis( data, w, h, magnitude, low, high );
        
        thresholdEdges( im, data );
        
        return im;
    }
});
    
}(FILTER);/**
*
* HAAR Feature Detector Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Array32F = FILTER.Array32F,
    Array8U = FILTER.Array8U,
    Abs = Math.abs, Max = Math.max, Min = Math.min, 
    Floor = Math.floor, Round = Math.round, Sqrt = Math.sqrt,
    HAS = 'hasOwnProperty'
;


// compute grayscale image, integral image (SAT) and squares image (Viola-Jones) and RSAT (Lienhart)
function integral_image(im, w, h, gray, integral, squares, tilted) 
{
    var imLen=im.length//, count=w*h
        , sum, sum2, i, j, k, y, g
        //, gray = new Array8U(count)
        // Viola-Jones
        //, integral = new Array32F(count), squares = new Array32F(count)
        // Lienhart et al. extension using tilted features
        //, tilted = new Array32F(count)
    ;
    
    // first row
    j=0; i=0; sum=sum2=0; 
    while (j<w)
    {
        // use fixed-point gray-scale transform, close to openCV transform
        // https://github.com/mtschirs/js-objectdetect/issues/3
        // 0,29901123046875  0,58697509765625  0,114013671875 with roundoff
        g = ((4899 * im[i] + 9617 * im[i + 1] + 1868 * im[i + 2]) + 8192) >>> 14;
        
        g &= 255;  
        sum += g;  
        sum2 += /*(*/(g*g); //&0xFFFFFFFF) >>> 0;
        
        // SAT(-1, y) = SAT(x, -1) = SAT(-1, -1) = 0
        // SAT(x, y) = SAT(x, y-1) + SAT(x-1, y) + I(x, y) - SAT(x-1, y-1)  <-- integral image
        
        // RSAT(-1, y) = RSAT(x, -1) = RSAT(x, -2) = RSAT(-1, -1) = RSAT(-1, -2) = 0
        // RSAT(x, y) = RSAT(x-1, y-1) + RSAT(x+1, y-1) - RSAT(x, y-2) + I(x, y) + I(x, y-1)    <-- rotated(tilted) integral image at 45deg
        gray[j] = g;
        integral[j] = sum;
        squares[j] = sum2;
        tilted[j] = g;
        
        j++; i+=4;
    }
    // other rows
    k=0; y=1; j=w; i=(w<<2); sum=sum2=0; 
    while (i<imLen)
    {
        // use fixed-point gray-scale transform, close to openCV transform
        // https://github.com/mtschirs/js-objectdetect/issues/3
        // 0,29901123046875  0,58697509765625  0,114013671875 with roundoff
        g = ((4899 * im[i] + 9617 * im[i + 1] + 1868 * im[i + 2]) + 8192) >>> 14;
        
        g &= 255;  
        sum += g;  
        sum2 += /*(*/(g*g); //&0xFFFFFFFF) >>> 0;
        
        // SAT(-1, y) = SAT(x, -1) = SAT(-1, -1) = 0
        // SAT(x, y) = SAT(x, y-1) + SAT(x-1, y) + I(x, y) - SAT(x-1, y-1)  <-- integral image
        
        // RSAT(-1, y) = RSAT(x, -1) = RSAT(x, -2) = RSAT(-1, -1) = RSAT(-1, -2) = 0
        // RSAT(x, y) = RSAT(x-1, y-1) + RSAT(x+1, y-1) - RSAT(x, y-2) + I(x, y) + I(x, y-1)    <-- rotated(tilted) integral image at 45deg
        gray[j] = g;
        integral[j] = integral[j-w] + sum;
        squares[j] = squares[j-w] + sum2;
        tilted[j] = tilted[j+1-w] + (g + gray[j-w]) + ((y>1) ? tilted[j-w-w] : 0) + ((k>0) ? tilted[j-1-w] : 0);
        
        k++; j++; i+=4; if (k>=w) { k=0; y++; sum=sum2=0; }
    }
}

// compute Canny edges on gray-scale image to speed up detection if possible
function integral_canny(gray, w, h, canny) 
{
    var i, j, k, sum, grad_x, grad_y,
        ind0, ind1, ind2, ind_1, ind_2, count=gray.length, 
        lowpass = new Array8U(count)//, canny = new Array32F(count)
    ;
    
    // first, second rows, last, second-to-last rows
    for (i=0; i<w; i++)
    {
        lowpass[i]=0;
        lowpass[i+w]=0;
        lowpass[i+count-w]=0;
        lowpass[i+count-w-w]=0;
        
        canny[i]=0;
        canny[i+count-w]=0;
    }
    // first, second columns, last, second-to-last columns
    for (j=0, k=0; j<h; j++, k+=w)
    {
        lowpass[0+k]=0;
        lowpass[1+k]=0;
        lowpass[w-1+k]=0;
        lowpass[w-2+k]=0;
        
        canny[0+k]=0;
        canny[w-1+k]=0;
    }
    // gauss lowpass
    for (i=2; i<w-2; i++)
    {
        sum=0;
        for (j=2, k=(w<<1); j<h-2; j++, k+=w) 
        {
            ind0 = i+k;
            ind1 = ind0+w; 
            ind2 = ind1+w; 
            ind_1 = ind0-w; 
            ind_2 = ind_1-w; 
            
            /*
             Original Code
             
            sum = 0;
            sum += 2 * grayImage[- 2 + ind_2];
            sum += 4 * grayImage[- 2 + ind_1];
            sum += 5 * grayImage[- 2 + ind0];
            sum += 4 * grayImage[- 2 + ind1];
            sum += 2 * grayImage[- 2 + ind2];
            sum += 4 * grayImage[- 1 + ind_2];
            sum += 9 * grayImage[- 1 + ind_1];
            sum += 12 * grayImage[- 1 + ind0];
            sum += 9 * grayImage[- 1 + ind1];
            sum += 4 * grayImage[- 1 + ind2];
            sum += 5 * grayImage[0 + ind_2];
            sum += 12 * grayImage[0 + ind_1];
            sum += 15 * grayImage[0 + ind0];
            sum += 12 * grayImage[i + 0 + ind1];
            sum += 5 * grayImage[0 + ind2];
            sum += 4 * grayImage[1 + ind_2];
            sum += 9 * grayImage[1 + ind_1];
            sum += 12 * grayImage[1 + ind0];
            sum += 9 * grayImage[1 + ind1];
            sum += 4 * grayImage[1 + ind2];
            sum += 2 * grayImage[2 + ind_2];
            sum += 4 * grayImage[2 + ind_1];
            sum += 5 * grayImage[2 + ind0];
            sum += 4 * grayImage[2 + ind1];
            sum += 2 * grayImage[2 + ind2];
            */
            
            // use as simple fixed-point arithmetic as possible (only addition/subtraction and binary shifts)
            // http://stackoverflow.com/questions/11703599/unsigned-32-bit-integers-in-javascript
            // http://stackoverflow.com/questions/6232939/is-there-a-way-to-correctly-multiply-two-32-bit-integers-in-javascript/6422061#6422061
            // http://stackoverflow.com/questions/6798111/bitwise-operations-on-32-bit-unsigned-ints
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#%3E%3E%3E_%28Zero-fill_right_shift%29
            sum = /*(*/(0
                    + (gray[ind_2-2] << 1) + (gray[ind_1-2] << 2) + (gray[ind0-2] << 2) + (gray[ind0-2])
                    + (gray[ind1-2] << 2) + (gray[ind2-2] << 1) + (gray[ind_2-1] << 2) + (gray[ind_1-1] << 3)
                    + (gray[ind_1-1]) + (gray[ind0-1] << 4) - (gray[ind0-1] << 2) + (gray[ind1-1] << 3)
                    + (gray[ind1-1]) + (gray[ind2-1] << 2) + (gray[ind_2] << 2) + (gray[ind_2]) + (gray[ind_1] << 4)
                    - (gray[ind_1] << 2) + (gray[ind0] << 4) - (gray[ind0]) + (gray[ind1] << 4) - (gray[ind1] << 2)
                    + (gray[ind2] << 2) + (gray[ind2]) + (gray[ind_2+1] << 2) + (gray[ind_1+1] << 3) + (gray[ind_1+1])
                    + (gray[ind0+1] << 4) - (gray[ind0+1] << 2) + (gray[ind1+1] << 3) + (gray[ind1+1]) + (gray[ind2+1] << 2)
                    + (gray[ind_2+2] << 1) + (gray[ind_1+2] << 2) + (gray[ind0+2] << 2) + (gray[ind0+2])
                    + (gray[ind1+2] << 2) + (gray[ind2+2] << 1)
                    );// &0xFFFFFFFF ) >>> 0;
            
            /*
            Original Code
            
            grad[ind0] = sum/159 = sum*0.0062893081761006;
            */
            
            // sum of coefficients = 159, factor = 1/159 = 0,0062893081761006
            // 2^14 = 16384, 16384/2 = 8192
            // 2^14/159 = 103,0440251572322304 =~ 103 +/- 2^13
            //grad[ind0] = (( ((sum << 6)&0xFFFFFFFF)>>>0 + ((sum << 5)&0xFFFFFFFF)>>>0 + ((sum << 3)&0xFFFFFFFF)>>>0 + ((8192-sum)&0xFFFFFFFF)>>>0 ) >>> 14) >>> 0;
            lowpass[ind0] = ((((103*sum + 8192)&0xFFFFFFFF) >>> 14)&0xFF) >>> 0;
        }
    }
    
    // sobel gradient
    for (i=1; i<w-1 ; i++)
    {
        //sum=0; 
        for (j=1, k=w; j<h-1; j++, k+=w) 
        {
            // compute coords using simple add/subtract arithmetic (faster)
            ind0=k+i;
            ind1=ind0+w; 
            ind_1=ind0-w; 
            
            grad_x = ((0
                    - lowpass[ind_1-1] 
                    + lowpass[ind_1+1] 
                    - lowpass[ind0-1] - lowpass[ind0-1]
                    + lowpass[ind0+1] + lowpass[ind0+1]
                    - lowpass[ind1-1] 
                    + lowpass[ind1+1]
                    ))//&0xFFFFFFFF
                    ;
            grad_y = ((0
                    + lowpass[ind_1-1] 
                    + lowpass[ind_1] + lowpass[ind_1]
                    + lowpass[ind_1+1] 
                    - lowpass[ind1-1] 
                    - lowpass[ind1] - lowpass[ind1]
                    - lowpass[ind1+1]
                    ))//&0xFFFFFFFF
                    ;
            
            //sum += (Abs(grad_x) + Abs(grad_y))&0xFFFFFFFF;
            canny[ind0] = ( Abs(grad_x) + Abs(grad_y) );//&0xFFFFFFFF;
       }
    }
    
    // integral canny
    // first row
    i=0; sum=0;
    while (i<w)
    {
        sum += canny[i];
        canny[i] = sum;//&0xFFFFFFFF;
        i++;
    }
    // other rows
    i=w; k=0; sum=0;
    while (i<count)
    {
        sum += canny[i];
        canny[i] = (canny[i-w] + sum);//&0xFFFFFFFF;
        i++; k++; if (k>=w) { k=0; sum=0; }
    }
    
    return canny;
}

function almost_equal(r1, r2)
{
    var d1=Max(r2.width, r1.width)*0.2, 
        d2=Max(r2.height, r1.height)*0.2;
    //var d1=Max(f.width, this.width)*0.5, d2=Max(f.height, this.height)*0.5;
    //var d2=d1=Max(f.width, this.width, f.height, this.height)*0.4;
    return !!( 
        Abs(r1.x-r2.x) <= d1 && 
        Abs(r1.y-r2.y) <= d2 && 
        Abs(r1.width-r2.width) <= d1 && 
        Abs(r1.height-r2.height) <= d2 
    ); 
}
function add_feat(r1, r2)
{
    r1.x += r2.x; 
    r1.y += r2.y; 
    r1.width += r2.width; 
    r1.height += r2.height; 
}
function is_inside(r1, r2)
{
    return !!( 
        (r1.x >= r2.x) && 
        (r1.y >= r2.y) && 
        (r1.x+r1.width <= r2.x+r2.width) && 
        (r1.y+r1.height <= r2.y+r2.height)
    ); 
}
function snap_to_grid(r)
{
    r.x = ~~(r.x+0.5); 
    r.y = ~~(r.y+0.5); 
    r.width = ~~(r.width+0.5); 
    r.height = ~~(r.height+0.5); 
}
function by_area(r1, r2)
{
    return r2.area-r1.area;
}
// merge the detected features if needed
function merge_features(rects, min_neighbors) 
{
    var rlen=rects.length, ref = new Array(rlen), feats=[], 
        nb_classes = 0, neighbors, r, found=false, i, j, n, t, ri;
    
    // original code
    // find number of neighbour classes
    for (i = 0; i < rlen; i++) ref[i] = 0;
    for (i = 0; i < rlen; i++)
    {
        found = false;
        for (j = 0; j < i; j++)
        {
            if ( almost_equal(rects[j],rects[i]) )
            {
                found = true;
                ref[i] = ref[j];
            }
        }
        
        if (!found)
        {
            ref[i] = nb_classes;
            nb_classes++;
        }
    }        
    
    // merge neighbor classes
    neighbors = new Array(nb_classes);  r = new Array(nb_classes);
    for (i = 0; i < nb_classes; i++) { neighbors[i] = 0;  r[i] = {x:0, y:0, width:0, height: 0}; }
    for (i = 0; i < rlen; i++) { ri=ref[i]; neighbors[ri]++; add_feat(r[ri],rects[i]); }
    for (i = 0; i < nb_classes; i++) 
    {
        n = neighbors[i];
        if (n >= min_neighbors) 
        {
            t=1/(n + n);
            ri = {
                x: t*(r[i].x * 2 + n),  y: t*(r[i].y * 2 + n),
                width: t*(r[i].width * 2 + n),  height: t*(r[i].height * 2 + n)
            };
            
            feats.push(ri);
        }
    }
    
    // filter inside rectangles
    rlen=feats.length;
    for (i=0; i<rlen; i++)
    {
        for (j=i+1; j<rlen; j++)
        {
            if (!feats[i].inside && is_inside(feats[i],feats[j])) { feats[i].inside=true; }
            else if (!feats[j].inside && is_inside(feats[j],feats[i])) { feats[j].inside=true; }
        }
    }
    i=rlen;
    while (--i >= 0) 
    { 
        if (feats[i].inside) 
        {
            feats.splice(i, 1); 
        }
        else 
        {
            snap_to_grid(feats[i]); 
            feats[i].area = feats[i].width*feats[i].height;
        }
    }
    
    // sort according to size 
    // (a deterministic way to present results under different cases)
    return feats.sort(by_area);
}


// HAAR Feature Detector (Viola-Jones-Lienhart algorithm)
// adapted from: https://github.com/foo123/HAAR.js
FILTER.Create({
    name: "HaarDetectorFilter"
    
    // parameters
    ,_update: false // filter by itself does not alter image data, just processes information
    ,hasMeta: true
    ,haardata: null
    ,objects: null
    ,baseScale: 1.0
    ,scaleIncrement: 1.25
    ,stepIncrement: 0.5
    ,minNeighbors: 1
    ,doCannyPruning: true
    ,cannyLow: 20
    ,cannyHigh: 100
    ,_haarchanged: false
    
    // this is the filter constructor
    ,init: function( haardata, baseScale, scaleIncrement, stepIncrement, minNeighbors, doCannyPruning ) {
        var self = this;
        self.objects = null;
        self.haardata = haardata || null;
        self.baseScale = undef === baseScale ? 1.0 : baseScale;
        self.scaleIncrement = undef === scaleIncrement ? 1.25 : scaleIncrement;
        self.stepIncrement = undef === stepIncrement ? 0.5 : stepIncrement;
        self.minNeighbors = undef === minNeighbors ? 1 : minNeighbors;
        self.doCannyPruning = undef === doCannyPruning ? true : !!doCannyPruning;
        self._haarchanged = !!self.haardata;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,dispose: function( ) {
        var self = this;
        self.objects = null;
        self.haardata = null;
        self.$super('dispose');
        return self;
    }
    
    ,haar: function( haardata ) {
        var self = this;
        self.haardata = haardata;
        self._haarchanged = true;
        return self;
    }
    
    ,params: function( params ) {
        var self = this;
        if ( params )
        {
        if ( params[HAS]('baseScale') ) self.baseScale = params.baseScale;
        if ( params[HAS]('scaleIncrement') ) self.scaleIncrement = params.scaleIncrement;
        if ( params[HAS]('stepIncrement') ) self.stepIncrement = params.stepIncrement;
        if ( params[HAS]('minNeighbors') ) self.minNeighbors = params.minNeighbors;
        if ( params[HAS]('doCannyPruning') ) self.doCannyPruning = params.doCannyPruning;
        if ( params[HAS]('cannyLow') ) self.cannyLow = params.cannyLow;
        if ( params[HAS]('cannyHigh') ) self.cannyHigh = params.cannyHigh;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        var json = {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 baseScale: self.baseScale
                ,scaleIncrement: self.scaleIncrement
                ,stepIncrement: self.stepIncrement
                ,minNeighbors: self.minNeighbors
                ,doCannyPruning: self.doCannyPruning
                ,cannyLow: self.cannyLow
                ,cannyHigh: self.cannyHigh
            }
        };
        // avoid unnecessary (large) data transfer
        if ( self._haarchanged )
        {
            json.params.haardata = self.haardata;
            self._haarchanged = false;
        }
        return json;
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            if ( params[HAS]('haardata') ) self.haardata = params.haardata;
            self.baseScale = params.baseScale;
            self.scaleIncrement = params.scaleIncrement;
            self.stepIncrement = params.stepIncrement;
            self.minNeighbors = params.minNeighbors;
            self.doCannyPruning = params.doCannyPruning;
            self.cannyLow = params.cannyLow;
            self.cannyHigh = params.cannyHigh;
        }
        return self;
    }
    
    // detected objects are passed as filter metadata (if filter is run in parallel thread)
    ,getMeta: function( ) {
        return this.objects;
    }
    
    ,setMeta: function( meta ) {
        this.objects = meta;
        return this;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this, imSize = im.length>>>2
            ,haar = self.haardata, haar_stages = haar.stages
            ,baseScale = self.baseScale
            ,scaleIncrement = self.scaleIncrement
            ,stepIncrement = self.stepIncrement
            ,minNeighbors = self.minNeighbors
            ,doCanny = self.doCannyPruning
            ,cL = self.cannyLow, cH = self.cannyHigh
            ,sizex = haar.size1, sizey = haar.size2
            ,scale, maxScale = Min(w/sizex, h/sizey)
            ,gray, integral, squares, tilted, canny, feats = []
        
            ,imArea1=imSize-1,
            xstep, ystep, xsize, ysize,
            startx = 0, starty = 0, startty,
            x, y, ty, tyw, tys, sl = haar_stages.length,
            p0, p1, p2, p3, xl, yl, s, t,
            bx1, bx2, by1, by2,
            swh, inv_area, total_x, total_x2, vnorm,
            edges_density, pass,
            
            stage, threshold, trees, tl,
            t, cur_node_ind, where, features, feature, rects, nb_rects, thresholdf, 
            rect_sum, kr, r, x1, y1, x2, y2, x3, y3, x4, y4, rw, rh, yw, yh, sum
        ;
        
        integral_image(im, w, h, 
            gray=new Array8U(imSize), 
            integral=new Array32F(imSize), 
            squares=new Array32F(imSize), 
            tilted=new Array32F(imSize)
        );
        if ( doCanny ) 
            integral_canny(gray, w, h, 
                canny=new Array32F(imSize)
            );
        
        // synchronous detection loop
        bx1=0; bx2=w-1; by1=0; by2=imSize-w;
        scale = baseScale;
        while (scale <= maxScale) 
        {
            // Viola-Jones Single Scale Detector
            xsize = ~~(scale * sizex); 
            xstep = ~~(xsize * stepIncrement); 
            ysize = ~~(scale * sizey); 
            ystep = ~~(ysize * stepIncrement);
            //ysize = xsize; ystep = xstep;
            tyw = ysize*w; tys = ystep*w; 
            startty = starty*tys; 
            xl = w-xsize; yl = h-ysize;
            swh = xsize*ysize; inv_area = 1.0/swh;
            
            for (y=starty, ty=startty; y<yl; y+=ystep, ty+=tys) 
            {
                for (x=startx; x<xl; x+=xstep) 
                {
                    p0 = x-1 + ty-w;    p1 = p0 + xsize;
                    p2 = p0 + tyw;    p3 = p2 + xsize;
                    
                    // clamp
                    p0 = (p0<0) ? 0 : (p0>imArea1) ? imArea1 : p0;
                    p1 = (p1<0) ? 0 : (p1>imArea1) ? imArea1 : p1;
                    p2 = (p2<0) ? 0 : (p2>imArea1) ? imArea1 : p2;
                    p3 = (p3<0) ? 0 : (p3>imArea1) ? imArea1 : p3;
                    
                    if (doCanny) 
                    {
                        // avoid overflow
                        edges_density = inv_area * (canny[p3] - canny[p2] - canny[p1] + canny[p0]);
                        if (edges_density < cL || edges_density > cH) continue;
                    }
                    
                    // pre-compute some values for speed
                    
                    // avoid overflow
                    total_x = inv_area * (integral[p3] - integral[p2] - integral[p1] + integral[p0]);
                    // avoid overflow
                    total_x2 = inv_area * (squares[p3] - squares[p2] - squares[p1] + squares[p0]);
                    
                    vnorm = total_x2 - total_x * total_x;
                    vnorm = (vnorm > 1) ? Sqrt(vnorm) : /*vnorm*/  1 ;  
                    
                    pass = true;
                    for (s = 0; s < sl; s++) 
                    {
                        // Viola-Jones HAAR-Stage evaluator
                        stage = haar_stages[s];
                        threshold = stage.thres;
                        trees = stage.trees; tl = trees.length;
                        sum=0;
                        
                        for (t = 0; t < tl; t++) 
                        { 
                            //
                            // inline the tree and leaf evaluators to avoid function calls per-loop (faster)
                            //
                            
                            // Viola-Jones HAAR-Tree evaluator
                            features = trees[t].feats; 
                            cur_node_ind = 0;
                            while (true) 
                            {
                                feature = features[cur_node_ind]; 
                                
                                // Viola-Jones HAAR-Leaf evaluator
                                rects = feature.rects; 
                                nb_rects = rects.length; 
                                thresholdf = feature.thres; 
                                rect_sum = 0;
                                
                                if (feature.tilt)
                                {
                                    // tilted rectangle feature, Lienhart et al. extension
                                    for (kr = 0; kr < nb_rects; kr++) 
                                    {
                                        r = rects[kr];
                                        
                                        // this produces better/larger features, possible rounding effects??
                                        x1 = x + ~~(scale * r[0]);
                                        y1 = (y-1 + ~~(scale * r[1])) * w;
                                        x2 = x + ~~(scale * (r[0] + r[2]));
                                        y2 = (y-1 + ~~(scale * (r[1] + r[2]))) * w;
                                        x3 = x + ~~(scale * (r[0] - r[3]));
                                        y3 = (y-1 + ~~(scale * (r[1] + r[3]))) * w;
                                        x4 = x + ~~(scale * (r[0] + r[2] - r[3]));
                                        y4 = (y-1 + ~~(scale * (r[1] + r[2] + r[3]))) * w;
                                        
                                        // clamp
                                        x1 = (x1<bx1) ? bx1 : (x1>bx2) ? bx2 : x1;
                                        x2 = (x2<bx1) ? bx1 : (x2>bx2) ? bx2 : x2;
                                        x3 = (x3<bx1) ? bx1 : (x3>bx2) ? bx2 : x3;
                                        x4 = (x4<bx1) ? bx1 : (x4>bx2) ? bx2 : x4;
                                        y1 = (y1<by1) ? by1 : (y1>by2) ? by2 : y1;
                                        y2 = (y2<by1) ? by1 : (y2>by2) ? by2 : y2;
                                        y3 = (y3<by1) ? by1 : (y3>by2) ? by2 : y3;
                                        y4 = (y4<by1) ? by1 : (y4>by2) ? by2 : y4;
                                        
                                        // RSAT(x-h+w, y+w+h-1) + RSAT(x, y-1) - RSAT(x-h, y+h-1) - RSAT(x+w, y+w-1)
                                        //        x4     y4            x1  y1          x3   y3            x2   y2
                                        rect_sum+= r[4] * (tilted[x4 + y4] - tilted[x3 + y3] - tilted[x2 + y2] + tilted[x1 + y1]);
                                    }
                                }
                                else
                                {
                                    // orthogonal rectangle feature, Viola-Jones original
                                    for (kr = 0; kr < nb_rects; kr++) 
                                    {
                                        r = rects[kr];
                                        
                                        // this produces better/larger features, possible rounding effects??
                                        x1 = x-1 + ~~(scale * r[0]); 
                                        x2 = x-1 + ~~(scale * (r[0] + r[2]));
                                        y1 = (w) * (y-1 + ~~(scale * r[1])); 
                                        y2 = (w) * (y-1 + ~~(scale * (r[1] + r[3])));
                                        
                                        // clamp
                                        x1 = (x1<bx1) ? bx1 : (x1>bx2) ? bx2 : x1;
                                        x2 = (x2<bx1) ? bx1 : (x2>bx2) ? bx2 : x2;
                                        y1 = (y1<by1) ? by1 : (y1>by2) ? by2 : y1;
                                        y2 = (y2<by1) ? by1 : (y2>by2) ? by2 : y2;
                                        
                                        // SAT(x-1, y-1) + SAT(x+w-1, y+h-1) - SAT(x-1, y+h-1) - SAT(x+w-1, y-1)
                                        //      x1   y1         x2      y2          x1   y1            x2    y1
                                        rect_sum+= r[4] * (integral[x2 + y2]  - integral[x1 + y2] - integral[x2 + y1] + integral[x1 + y1]);
                                    }
                                }
                                
                                where = (rect_sum * inv_area < thresholdf * vnorm) ? 0 : 1;
                                // END Viola-Jones HAAR-Leaf evaluator
                                
                                if (where) 
                                {
                                    if (feature.has_r) { sum += feature.r_val; break; } 
                                    else { cur_node_ind = feature.r_node; }
                                } 
                                else 
                                {
                                    if (feature.has_l) { sum += feature.l_val; break; } 
                                    else { cur_node_ind = feature.l_node; }
                                }
                            }
                            // END Viola-Jones HAAR-Tree evaluator
                        
                        }
                        pass = sum > threshold;
                        // END Viola-Jones HAAR-Stage evaluator
                        
                        if (!pass) break;
                    }
                    
                    if (pass) 
                    {
                        feats.push({
                            x: x, y: y,
                            width: xsize,  height: ysize
                        });
                    }
                }
            }
                    
            // increase scale
            scale *= scaleIncrement;
        }
        
        // return results as meta
        self.objects = merge_features(feats, minNeighbors); 
        
        // return im back
        return im;
    }
});

}(FILTER);/**
*
* Channel Copy Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp=FILTER._notSupportClamp, Min=Math.min, Floor=Math.floor,
    R=FILTER.CHANNEL.RED, G=FILTER.CHANNEL.GREEN, B=FILTER.CHANNEL.BLUE, A=FILTER.CHANNEL.ALPHA;

// a plugin to copy a channel of an image to a channel of another image
FILTER.Create({
    name: "ChannelCopyFilter"
    
    // parameters
    ,_srcImg: null
    ,srcImg: null
    ,centerX: 0
    ,centerY: 0
    ,srcChannel: 0
    ,dstChannel: 0
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    // constructor
    ,init: function( srcImg, srcChannel, dstChannel, centerX, centerY ) {
        var self = this;
        self._srcImg = null;
        self.srcImg = null;
        self.srcChannel = srcChannel || R;
        self.dstChannel = dstChannel || R;
        self.centerX = centerX || 0;
        self.centerY = centerY || 0;
        if ( srcImg ) self.setSrc( srcImg );
    }
    
    ,dispose: function( ) {
        var self = this;
        self.srcImg = null;
        self._srcImg = null;
        self.$super('dispose');
        return self;
    }
    
    ,setSrc: function( srcImg ) {
        var self = this;
        if ( srcImg )
        {
            self.srcImg = srcImg;
            self._srcImg = { data: srcImg.getData( ), width: srcImg.width, height: srcImg.height };
        }
        else
        {
            self.srcImg = null;
            self._srcImg = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _srcImg: self._srcImg
                ,centerX: self.centerX
                ,centerY: self.centerY
                ,srcChannel: self.srcChannel
                ,dstChannel: self.dstChannel
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._srcImg = params._srcImg;
            self.centerX = params.centerX;
            self.centerY = params.centerY;
            self.srcChannel = params.srcChannel;
            self.dstChannel = params.dstChannel;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn || !self._srcImg ) return im;
        
        var src = self._srcImg.data,
            i, l = im.length, l2 = src.length, 
            w2 = self._srcImg.width, 
            h2 = self._srcImg.height,
            sC = self.srcChannel, tC = self.dstChannel,
            x, x2, y, y2, off, xc, yc, 
            wm = Min(w,w2), hm = Min(h, h2),  
            cX = self.centerX||0, cY = self.centerY||0, 
            cX2 = (w2>>1), cY2 = (h2>>1)
        ;
        
        
        // make center relative
        cX = Floor(cX*(w-1)) - cX2;
        cY = Floor(cY*(h-1)) - cY2;
        
        i=0; x=0; y=0;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            xc = x - cX; yc = y - cY;
            if (xc>=0 && xc<wm && yc>=0 && yc<hm)
            {
                // copy channel
                off = (xc + yc*w2)<<2;
                im[i + tC] = src[off + sC];
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Alpha Mask Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp = FILTER._notSupportClamp, Min = Math.min, Floor=Math.floor;

// a plugin to mask an image using the alpha channel of another image
FILTER.Create({
    name: "AlphaMaskFilter"
    
    // parameters
    ,_alphaMask: null
    ,alphaMask: null
    ,centerX: 0
    ,centerY: 0
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    // constructor
    ,init: function( alphaMask, centerX, centerY ) {
        var self = this;
        self.centerX = centerX||0;
        self.centerY = centerY||0;
        self._alphaMask = null;
        self.alphaMask = null;
        if ( alphaMask ) self.setMask( alphaMask );
    }
    
    ,dispose: function( ) {
        var self = this;
        self.alphaMask = null;
        self._alphaMask = null;
        self.$super('dispose');
        return self;
    }
    
    ,setMask: function( alphaMask ) {
        var self = this;
        if ( alphaMask )
        {
            self.alphaMask = alphaMask;
            self._alphaMask = { data: alphaMask.getData( ), width: alphaMask.width, height: alphaMask.height };
        }
        else
        {
            self.alphaMask = null;
            self._alphaMask = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _alphaMask: self._alphaMask
                ,centerX: self.centerX
                ,centerY: self.centerY
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._alphaMask = params._alphaMask;
            self.centerX = params.centerX;
            self.centerY = params.centerY;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        
        var self = this;
        if ( !self._isOn || !self._alphaMask ) return im;
        
        var alpha = self._alphaMask.data,
            w2 = self._alphaMask.width, h2 = self._alphaMask.height,
            i, l = im.length, l2 = alpha.length, 
            x, x2, y, y2, off, xc, yc, 
            wm = Min(w, w2), hm = Min(h, h2),  
            cX = self.centerX||0, cY = self.centerY||0, 
            cX2 = (w2>>1), cY2 = (h2>>1)
        ;
        
        
        // make center relative
        cX = Floor(cX*(w-1)) - cX2;
        cY = Floor(cY*(h-1)) - cY2;
        
        x=0; y=0;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            xc = x - cX; yc = y - cY;
            if (xc>=0 && xc<wm && yc>=0 && yc<hm)
            {
                // copy alpha channel
                off = (xc + yc*w2)<<2;
                im[i+3] = alpha[off+3];
            }
            else
            {
                // better to remove the alpha channel if mask dimensions are different??
                im[i+3] = 0;
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Image Blend Filter Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var HAS = 'hasOwnProperty', Min = Math.min, Max = Math.max, 
    Round = Math.round, Floor=Math.floor, Abs = Math.abs,
    notSupportClamp = FILTER._notSupportClamp,
    blend_functions
;

// JavaScript implementations of common image blending modes, based on
// http://stackoverflow.com/questions/5919663/how-does-photoshop-blend-two-images-together
blend_functions = {
    
    normal: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
        
        // normal mode
        rb = r2;  
        gb = g2;  
        bb = b2;
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    lighten: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
        
        // lighten mode
        rb = (r > r2) ? r : r2; 
        gb = (g > g2) ? g : g2; 
        bb = (b > b2) ? b : b2; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    darken: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // darken mode
        rb = (r > r2) ? r2 : r; 
        gb = (g > g2) ? g2 : g; 
        bb = (b > b2) ? b2 : b; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    multiply: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // multiply mode
        rb = (r * r2 * 0.003921568627451);
        gb = (g * g2 * 0.003921568627451);
        bb = (b * b2 * 0.003921568627451);
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    average: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // average mode
        rb = 0.5*(r + r2); 
        gb = 0.5*(g + g2); 
        bb = 0.5*(b + b2); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    add: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // add mode
        rb = r + r2; 
        gb = g + g2; 
        bb = b + b2; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    subtract: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // subtract mode
        rb = (r + r2 < 255) ? 0 : r + r2 - 255;  
        gb = (g + g2 < 255) ? 0 : g + g2 - 255;  
        bb = (b + b2 < 255) ? 0 : b + b2 - 255;  
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    difference: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // difference mode
        rb = Abs(r2 - r); 
        gb = Abs(g2 - g); 
        bb = Abs(b2 - b); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    negation: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // negation mode
        rb = 255 - Abs(255 - r2 - r);
        gb = 255 - Abs(255 - g2 - g);
        bb = 255 - Abs(255 - b2 - b);
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    screen: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // screen mode
        rb = 255 - (((255 - r2) * (255 - r)) >> 8); 
        gb = 255 - (((255 - g2) * (255 - g)) >> 8); 
        bb = 255 - (((255 - b2) * (255 - b)) >> 8); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    exclusion: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // exclusion mode
        rb = r2 + r - 2 * r2 * r * 0.003921568627451; 
        gb = g2 + g - 2 * g2 * g * 0.003921568627451; 
        bb = b2 + b - 2 * b2 * b * 0.003921568627451; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    overlay: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // overlay mode
        rb = r < 128 ? (2 * r2 * r * 0.003921568627451) : (255 - 2 * (255 - r2) * (255 - r) * 0.003921568627451); 
        gb = g < 128 ? (2 * g2 * g * 0.003921568627451) : (255 - 2 * (255 - g2) * (255 - g) * 0.003921568627451); 
        rb = b < 128 ? (2 * b2 * b * 0.003921568627451) : (255 - 2 * (255 - b2) * (255 - b) * 0.003921568627451); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    softlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // softlight mode
        rb = r < 128 ? (2 * ((r2 >> 1) + 64)) * (r * 0.003921568627451) : 255 - (2 * (255 - (( r2 >> 1) + 64)) * (255 - r) * 0.003921568627451); 
        gb = g < 128 ? (2 * ((g2 >> 1) + 64)) * (g * 0.003921568627451) : 255 - (2 * (255 - (( g2 >> 1) + 64)) * (255 - g) * 0.003921568627451); 
        bb = b < 128 ? (2 * ((b2 >> 1) + 64)) * (b * 0.003921568627451) : 255 - (2 * (255 - (( b2 >> 1) + 64)) * (255 - b) * 0.003921568627451); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    // reverse of overlay
    hardlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // hardlight mode, reverse of overlay
        rb = r2 < 128 ? (2 * r * r2 * 0.003921568627451) : (255 - 2 * (255 - r) * (255 - r2) * 0.003921568627451); 
        gb = g2 < 128 ? (2 * g * g2 * 0.003921568627451) : (255 - 2 * (255 - g) * (255 - g2) * 0.003921568627451); 
        bb = b2 < 128 ? (2 * b * b2 * 0.003921568627451) : (255 - 2 * (255 - b) * (255 - b2) * 0.003921568627451); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    colordodge: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // colordodge mode
        rb = (255 == r) ? r : Min(255, ((r2 << 8 ) / (255 - r))); 
        gb = (255 == g) ? g : Min(255, ((g2 << 8 ) / (255 - g))); 
        bb = (255 == b) ? r : Min(255, ((b2 << 8 ) / (255 - b))); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    colorburn: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // colorburn mode
        rb = (0 == r) ? r : Max(0, (255 - ((255 - r2) << 8 ) / r)); 
        gb = (0 == g) ? g : Max(0, (255 - ((255 - g2) << 8 ) / g)); 
        bb = (0 == b) ? b : Max(0, (255 - ((255 - b2) << 8 ) / b)); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    linearlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb, tmp,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // linearlight mode
        if (r < 128)
        {
            tmp = r*2;
            rb = (tmp + r2 < 255) ? 0 : tmp + r2 - 255; //blendModes.linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r - 128);
            rb = tmp + r2; //blendModes.linearDodge(a, (2 * (b - 128)))
        }
        if (g < 128)
        {
            tmp = g*2;
            gb = (tmp + g2 < 255) ? 0 : tmp + g2 - 255; //blendModes.linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g - 128);
            gb = tmp + g2; //blendModes.linearDodge(a, (2 * (b - 128)))
        }
        if (b < 128)
        {
            tmp = b*2;
            bb = (tmp + b2 < 255) ? 0 : tmp + b2 - 255; //blendModes.linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (b - 128);
            bb = tmp + b2; //blendModes.linearDodge(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    reflect: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // reflect mode
        rb = (255 == r) ? r : Min(255, (r2 * r2 / (255 - r))); 
        gb = (255 == g) ? g : Min(255, (g2 * g2 / (255 - g))); 
        bb = (255 == b) ? b : Min(255, (b2 * b2 / (255 - b))); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    // reverse of reflect
    glow: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // glow mode, reverse of reflect
        rb = (255 == r2) ? r2 : Min(255, (r * r / (255 - r2))); 
        gb = (255 == g2) ? g2 : Min(255, (g * g / (255 - g2))); 
        bb = (255 == b2) ? b2 : Min(255, (b * b / (255 - b2))); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    phoenix: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // phoenix mode
        rb = Min(r2, r) - Max(r2, r) + 255; 
        gb = Min(g2, g) - Max(g2, g) + 255; 
        bb = Min(b2, b) - Max(b2, b) + 255; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    vividlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb, tmp,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // vividlight mode
        if (r < 128)
        {
            tmp = 2*r;
            rb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - r2) << 8 ) / tmp));  //blendModes.colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            rb = (255 == tmp) ? tmp : Min(255, ((r2 << 8 ) / (255 - tmp)));  // blendModes.colorDodge(a, (2 * (b - 128)))
        }
        if (g < 128)
        {
            tmp = 2*g;
            gb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - g2) << 8 ) / tmp));  //blendModes.colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g-128);
            gb = (255 == tmp) ? tmp : Min(255, ((g2 << 8 ) / (255 - tmp)));  // blendModes.colorDodge(a, (2 * (b - 128)))
        }
        if (b < 128)
        {
            tmp = 2*b;
            bb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - b2) << 8 ) / tmp));  //blendModes.colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g-128);
            bb = (255 == tmp) ? tmp : Min(255, ((b2 << 8 ) / (255 - tmp)));  // blendModes.colorDodge(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    pinlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb, tmp,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // pinlight mode
        if (r < 128)
        {
            tmp = 2*r;
            rb = (tmp > r2) ? tmp : r2;  //blendModes.darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            rb = (tmp > r2) ? r2 : tmp;  // blendModes.lighten(a, (2 * (b - 128)))
        }
        if (g < 128)
        {
            tmp = 2*g;
            gb = (tmp > g2) ? tmp : g2;  //blendModes.darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            gb = (tmp > g2) ? g2 : tmp;  // blendModes.lighten(a, (2 * (b - 128)))
        }
        if (b < 128)
        {
            tmp = 2*b;
            bb = (tmp > b2) ? tmp : b2;  //blendModes.darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (b-128);
            bb = (tmp > b2) ? b2 : tmp;  // blendModes.lighten(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    hardmix: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb, tmp,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // hardmix mode, blendModes.vividLight(a, b) < 128 ? 0 : 255;
        if (r < 128)
        {
            tmp = 2*r;
            rb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - r2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (r-128);
            rb = (255 == tmp) ? tmp : Min(255, ((r2 << 8 ) / (255 - tmp)));
        }
        rb = (rb < 128) ? 0 : 255;
        if (g < 128)
        {
            tmp = 2*g;
            gb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - g2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (g-128);
            gb = (255 == tmp) ? tmp : Min(255, ((g2 << 8 ) / (255 - tmp)));
        }
        gb = (gb < 128) ? 0 : 255;
        if (b < 128)
        {
            tmp = 2*b;
            bb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - b2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (b-128);
            bb = (255 == tmp) ? tmp : Min(255, ((b2 << 8 ) / (255 - tmp)));
        }
        bb = (bb < 128) ? 0 : 255;
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    }
};
// aliases
blend_functions.lineardodge = blend_functions.add;
blend_functions.linearburn = blend_functions.subtract;

//
//
// a photoshop-like Blend Filter Plugin
FILTER.Create({
    name: "BlendFilter"
    
    // parameters
    ,_blendMode: null
    ,_blendImage: null
    ,blendImage: null
    ,startX: 0
    ,startY: 0
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    // constructor
    ,init: function( blendImage, blendMode ) { 
        var self = this;
        self.startX = 0;
        self.startY = 0;
        self._blendImage = null;
        self.blendImage = null;
        self._blendMode = null;
        if ( blendImage ) self.setImage( blendImage );
        if ( blendMode ) self.setMode( blendMode );
    }
    
    ,dispose: function( ) {
        var self = this;
        self.blendImage = null;
        self._blendImage = null;
        self._blendMode = null;
        self.$super('dispose');
        return self;
    }
    
    // set blend image auxiliary method
    ,setImage: function( blendImage ) {
        var self = this;
        if ( blendImage )
        {
            self.blendImage = blendImage;
            self._blendImage = { data: blendImage.getData( ), width: blendImage.width, height: blendImage.height };
        }
        else
        {
            self.blendImage = null;
            self._blendImage = null;
        }
        return self;
    }
    
    // set blend mode auxiliary method
    ,setMode: function( blendMode ) {
        var self = this;
        if ( blendMode )
        {
            self._blendMode = (''+blendMode).toLowerCase();
            if ( !blend_functions[HAS](self._blendMode) ) self._blendMode = null;
        }
        else
        {
            self._blendMode = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _blendImage: self._blendImage
                ,_blendMode: self._blendMode
                ,startX: self.startX
                ,startY: self.startY
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.startX = params.startX;
            self.startY = params.startY;
            self._blendImage = params._blendImage;
            self.setMode( params._blendMode );
        }
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self.startX = 0;
        self.startY = 0;
        self._blendMode = null;
        return self;
    }
    
    // main apply routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !self._blendMode || !self._blendImage ) return im;
        
        var startX = self.startX||0, startY = self.startY||0, 
            startX2 = 0, startY2 = 0, W, H, im2, w2, h2, 
            W1, W2, start, end, x, y, x2, y2,
            image2 = self._blendImage, pix2,
            blend = blend_functions[ self._blendMode ]
        ;
        
        //if ( !blend ) return im;
        
        if (startX < 0) { startX2 = -startX;  startX = 0; }
        if (startY < 0) { startY2 = -startY;  startY = 0; }
        
        w2 = image2.width; h2 = image2.height;
        if (startX >= w || startY >= h) return im;
        if (startX2 >= w2 || startY2 >= h2) return im;
        
        startX = Round(startX); startY = Round(startY);
        startX2 = Round(startX2); startY2 = Round(startY2);
        W = Min(w-startX, w2-startX2); H = Min(h-startY, h2-startY2);
        if (W <= 0 || H <= 0) return im;
        
        im2 = image2.data;
        
        // blend images
        x = startX; y = startY*w;
        x2 = startX2; y2 = startY2*w2;
        W1 = startX+W; W2 = startX2+W;
        start = 0; end = H*W;
        while (start<end)
        {
            pix2 = (x2 + y2)<<2;
            // blend only if im2 has opacity in this point
            if ( im2[pix2+3] ) 
                // calculate and assign blended color
                blend(im, (x + y)<<2, im2, pix2);
            
            // next pixels
            start++;
            x++; if (x>=W1) { x = startX; y += w; }
            x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
        }
        return im; 
    }
});

}(FILTER);    
    /* main code ends here */
    /* export the module */
    return exports["FILTER_PLUGINS"];
});