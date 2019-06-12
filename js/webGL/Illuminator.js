// center the webGL glows around torch sprites
const ILLUM_OFFSET_X = 10;
const ILLUM_OFFSET_Y = 10;

const playerLightRange = 400; //based on visual appeal
const torchRange = 100;
const maxLights = 12;

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
        return `
        precision mediump float;

        uniform vec2 playerPosition;
        uniform float playerLightRange;
        uniform vec2 lights[12];
        uniform float lightRanges[12];
        uniform vec3 colors[12];

        void main() {
            vec2 playerToFrag = playerPosition - gl_FragCoord.xy;

            gl_FragColor.a = 1.0 - min(length(playerToFrag) / playerLightRange, 1.0);

            for(int i = 0; i < 12; i++) {
                vec2 fragToLight = lights[i] - gl_FragCoord.xy;

                float thisLightAlpha = 1.0 - min(length(fragToLight) / lightRanges[i], 1.0);
                gl_FragColor.rgb += (colors[i] * thisLightAlpha / 3.0);

                gl_FragColor.a += thisLightAlpha;
            }

            gl_FragColor.a = 1.0 - gl_FragColor.a;
        }
        `;
    }

    const getWebGLProgram = function() {
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vertexShader, getVertexShaderString());
        gl.shaderSource(fragmentShader, getFragmentShaderString());

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

    const setUpAttribs = function(allLights, allColors, allRanges) {
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
    }

    this.getShadowOverlayWithLightList = function(lights, colors, ranges) {
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

        setUpAttribs(lights, colors, ranges);
        
        gl.drawArrays(
            gl.TRIANGLE_FAN, //What to draw, triangles? triangle strip?
            0, //how many to skip
            4 //Number of vertices
        );

        return webCanvas;
    }
}