const playerLightRange = 400; //based on visual appeal
const torchRange = 100;
const maxLights = 10;

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
        uniform vec2 lights[10];
        uniform float lightRange;
        uniform vec3 colors[10];

        void main() {
            vec2 playerToFrag = playerPosition - gl_FragCoord.xy;

            gl_FragColor.a = 1.0 - min(length(playerToFrag) / playerLightRange, 1.0);

            for(int i = 0; i < 10; i++) {
                vec2 fragToLight = lights[i] - gl_FragCoord.xy;

                float thisLightAlpha = 1.0 - min(length(fragToLight) / lightRange, 1.0);
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

    const setUpAttribs = function(allLights, allColors) {
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
        const lights = new Float32Array([
            allLights[2], allLights[3], //x, y for light #1
            allLights[4], allLights[5], //x, y for light #2
            allLights[6], allLights[7], //x, y for light #3
            allLights[8], allLights[9], //x, y for light #4
            allLights[10], allLights[11], //x, y for light #5
            allLights[12], allLights[13], //x, y for light #6
            allLights[14], allLights[15], //x, y for light #7
            allLights[16], allLights[17], //x, y for light #8
            allLights[18], allLights[19], //x, y for light #9
            allLights[20], allLights[21] //x, y for light #10
        ]);
        gl.uniform2fv(lightsUniformLocation, lights);

        const lightRangeUniformLocation = gl.getUniformLocation(program, 'lightRange');
        gl.uniform1fv(lightRangeUniformLocation, new Float32Array([torchRange]));

//        console.log(`Color - (r:${allColors[0]}, g:${allColors[1]}, b:${allColors[2]})`);

        const colorUniformLocation = gl.getUniformLocation(program, 'colors');
        const colors = new Float32Array([
            allColors[0], allColors[1], allColors[2], //r, g, b for light #1
            allColors[3], allColors[4], allColors[5], //r, g, b for light #2
            allColors[6], allColors[7], allColors[8], //r, g, b for light #3
            allColors[9], allColors[10], allColors[11], //r, g, b for light #4
            allColors[12], allColors[13], allColors[14], //r, g, b for light #5
            allColors[15], allColors[16], allColors[17], //r, g, b for light #6
            allColors[18], allColors[19], allColors[20], //r, g, b for light #7
            allColors[21], allColors[22], allColors[23], //r, g, b for light #8
            allColors[24], allColors[25], allColors[26], //r, g, b for light #9
            allColors[27], allColors[28], allColors[29], //r, g, b for light #10
        ]);
        gl.uniform3fv(colorUniformLocation, colors);
    }

    this.getShadowOverlayWithLightList = function(lights, colors) {
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

        setUpAttribs(lights, colors);
        
        gl.drawArrays(
            gl.TRIANGLE_FAN, //What to draw, triangles? triangle strip?
            0, //how many to skip
            4 //Number of vertices
        );

        return webCanvas;
    }
}