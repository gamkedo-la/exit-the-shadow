// center the webGL glows around torch sprites
const ILLUM_OFFSET_X = 10;
const ILLUM_OFFSET_Y = 10;

const playerLightRange = 400; //based on visual appeal
const torchRange = 250;
const maxLights = 13;

//Make some webGL stuff here
function Illuminator() {
    const webCanvas = document.createElement('canvas');
    
    let gl = webCanvas.getContext('webgl');
    if(!gl) {
        gl = webCanvas.getContext('experimental-webgl');
    }

    if(!gl) {
        console.error("WebGL not supported");
    }

    let data = [];
    const vertexBufferObject = gl.createBuffer();

    const getVertexShaderString = function() {
        return `
        precision mediump float;

        attribute vec2 vertPosition;

        void main() {
            gl_Position = vec4(vertPosition, 0.0, 1.0);
        }
        `;
    }

    const getFragmentShaderString = function() {
        console.log("Browser Agent:");
        console.log(navigator.userAgent);
        return `
        precision mediump float;

        uniform vec2 playerPosition;
        uniform float playerLightRange;
        uniform vec2 lights[13];
        uniform float lightRanges[13];
        uniform vec3 colors[13];
        uniform vec2 darks[3];
        uniform float darkRanges[3];

        void main() {
            vec2 playerToFrag = playerPosition - gl_FragCoord.xy;

            gl_FragColor.a = 1.0 - min(length(playerToFrag) / playerLightRange, 1.0);

            for(int i = 0; i < 13; i++) {
                vec2 fragToLight = lights[i] - gl_FragCoord.xy;

                float thisLightAlpha = 1.0 - min(length(fragToLight) / lightRanges[i], 1.0);
                gl_FragColor.rgb += (colors[i] * thisLightAlpha / 3.0);

                gl_FragColor.a += thisLightAlpha;
            }

            float darkAlpha = 0.0;
            for(int j = 0; j < 3; j++) {
                vec2 fragToDark = darks[j] - gl_FragCoord.xy;

                float thisDarkAlpha = 1.0 - min(length(fragToDark) / darkRanges[j], 1.0);

                darkAlpha += (thisDarkAlpha / 2.2);
            }

            gl_FragColor.a = 1.0 - gl_FragColor.a + darkAlpha;
        }
        `;
    }

    const getFirefoxFragmentShaderString = function() {
        return `
        precision mediump float;

        uniform vec2 playerPosition;
        uniform float playerLightRange;
        uniform vec2 lights[13];
        uniform float lightRanges[13];
        uniform vec3 colors[13];
        uniform vec2 darks[3];
        uniform float darkRanges[3];

        void main() {
            vec2 playerToFrag = playerPosition - gl_FragCoord.xy;

            gl_FragColor.a = 1.0 - min(length(playerToFrag) / playerLightRange, 1.0);
            float minLightDist = 1.0 - gl_FragColor.a;

            for(int i = 0; i < 13; i++) {
                vec2 fragToLight = lights[i] - gl_FragCoord.xy;

                float thisLightAlpha = min(length(fragToLight) / lightRanges[i], 1.0);
                minLightDist = min(minLightDist, thisLightAlpha);
                thisLightAlpha = 1.0 - thisLightAlpha;
                gl_FragColor.rgb += (colors[i] * thisLightAlpha / 3.0);                
            }

            gl_FragColor.a += (1.0 - minLightDist);

            float darkAlpha = 0.0;
            for(int j = 0; j < 3; j++) {
                vec2 fragToDark = darks[j] - gl_FragCoord.xy;

                float thisDarkAlpha = 1.0 - min(length(fragToDark) / darkRanges[j], 1.0);

                darkAlpha += (thisDarkAlpha / 2.2);
            }

            gl_FragColor.a = max(1.0 - gl_FragColor.a + darkAlpha, 0.25);
        }
        `;
    }

    const getWebGLProgram = function() {
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vertexShader, getVertexShaderString());
        if(navigator.userAgent.includes("Firefox")) {
            gl.shaderSource(fragmentShader, getFirefoxFragmentShaderString());
        } else {
            gl.shaderSource(fragmentShader, getFragmentShaderString());
        }

        gl.compileShader(vertexShader);
        if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error("Error compiling Vertex Shader", gl.getShaderInfoLog(vertexShader));
            return null;
        }

        gl.compileShader(fragmentShader);
        if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error("Error compiling Fragment Shader", gl.getShaderInfoLog(fragmentShader));
            return null;
        }

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Error linking program", gl.getProgramInfoLog(program));
            return null;
        }

        return program;
    }

    const program = getWebGLProgram();

    const setUpAttribs = function(allLights, allColors, allRanges, allDarks, allDarkRanges) {
        const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        gl.vertexAttribPointer(
            positionAttribLocation, //Attribute location
            2, //number of elements per attribute
            gl.FLOAT, //Type of the elements
            gl.FALSE, //Is data normalized?
            2 * Float32Array.BYTES_PER_ELEMENT, //Stride
            0 //Offset into buffer for first element of this type
        );

        gl.enableVertexAttribArray(positionAttribLocation);

        const playerPositionUniformLocation = gl.getUniformLocation(program, 'playerPosition');
        gl.uniform2fv(playerPositionUniformLocation, new Float32Array([allLights[0], allLights[1]]));

        const playerLightRangeUniformLocation = gl.getUniformLocation(program, 'playerLightRange');
        gl.uniform1fv(playerLightRangeUniformLocation, new Float32Array([playerLightRange]));

        const lightsUniformLocation = gl.getUniformLocation(program, 'lights');
        allLights.splice(0, 2);//remove player light information
        gl.uniform2fv(lightsUniformLocation, new Float32Array(allLights));

        const lightRangeUniformLocation = gl.getUniformLocation(program, 'lightRanges');
        gl.uniform1fv(lightRangeUniformLocation, new Float32Array(allRanges));

        const colorUniformLocation = gl.getUniformLocation(program, 'colors');        
        gl.uniform3fv(colorUniformLocation, new Float32Array(allColors));

        const darksUniformLocation = gl.getUniformLocation(program, 'darks');
        gl.uniform2fv(darksUniformLocation, new Float32Array(allDarks));

        const darksRangesUniformLocation = gl.getUniformLocation(program, 'darkRanges');
        gl.uniform1fv(darksRangesUniformLocation, new Float32Array(allDarkRanges));
    }

    this.getShadowOverlay = function(lights, colors, ranges, darks, darkRanges) {
        webCanvas.width = canvas.width;
        webCanvas.height = canvas.height;
        gl.viewport(0, 0, webCanvas.width, webCanvas.height);

        data = [
            //X,                Y
            -webCanvas.width/2, -webCanvas.height/2,
            -webCanvas.width/2, webCanvas.height/2,
            webCanvas.width/2,  webCanvas.height/2,
            webCanvas.width/2,  -webCanvas.height/2
        ];

        gl.clearColor(0, 0, 0, 1.0);//full black
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

        gl.useProgram(program);

        setUpAttribs(lights, colors, ranges, darks, darkRanges);
        
        gl.drawArrays(
            gl.TRIANGLE_FAN, //What to draw, triangles? triangle strip?
            0, //how many to skip
            4 //Number of vertices
        );

        return webCanvas;
    }
}