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

        void main() {
            vec2 playerToFrag = playerPosition - gl_FragCoord.xy;
            float playerLightAlpha = 1.0 - min(length(playerToFrag) / playerLightRange, 1.0);
            
            float totalLightAlpha = playerLightAlpha;

            for(int i = 0; i < 10; i++) {
                vec2 fragToLight = lights[i] - gl_FragCoord.xy;
                float thisLightAlpha = 1.0 - min(length(fragToLight) / lightRange, 1.0);
                totalLightAlpha += thisLightAlpha;
            }
            
            float finalAlpha = 1.0 - totalLightAlpha;

            gl_FragColor = vec4(0.0, 0.0, 0.0, finalAlpha);
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

    const setUpAttribs = function(allLights) {
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

        const lights = new Float32Array([allLights[2], allLights[3], 
                                         allLights[4], allLights[5], 
                                         allLights[6], allLights[7],
                                         allLights[8], allLights[9], 
                                         allLights[10], allLights[11], 
                                         allLights[12], allLights[13],
                                         allLights[14], allLights[15], 
                                         allLights[16], allLights[17],
                                         allLights[18], allLights[19], 
										 allLights[20], allLights[21]]);

        gl.uniform2fv(lightsUniformLocation, lights);

        const lightRangeUniformLocation = gl.getUniformLocation(program, 'lightRange');
        
        gl.uniform1fv(lightRangeUniformLocation, new Float32Array([torchRange]));
    }

    this.getShadowOverlayWithLightList = function(lights) {
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

        setUpAttribs(lights);
        
        gl.drawArrays(
            gl.TRIANGLE_FAN, //What to draw, triangles? triangle strip?
            0, //how many to skip
            4 //Number of vertices
        );

        return webCanvas;
    }
}