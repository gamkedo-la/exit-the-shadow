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
        uniform vec2 lights[6];
        uniform float lightRange;

        void main() {
            vec2 playerToFrag = playerPosition - gl_FragCoord.xy;
            float playerLightAlpha = length(playerToFrag) / playerLightRange;

            float lightAlpha = 1.0;
            for(int i = 0; i < 6; i++) {
                vec2 playerToLight = lights[i] - gl_FragCoord.xy;
                float thisLightAlpha = length(playerToLight) / lightRange;
                lightAlpha = min(thisLightAlpha, lightAlpha);
            }
            
            float alpha = min(playerLightAlpha, lightAlpha);

            gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
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
        const playerLightRange = 400; //based on visual appeal
        gl.uniform1fv(playerLightRangeUniformLocation, new Float32Array([playerLightRange]));

        const lightsUniformLocation = gl.getUniformLocation(program, 'lights');
        const lights = new Float32Array([allLights[2], allLights[3], 
                                         allLights[4], allLights[5], 
                                         allLights[6], allLights[7],
                                         allLights[8], allLights[9], 
                                         allLights[10], allLights[11], 
                                         allLights[12], allLights[13]]);
//        console.log(`Player Light:(${allLights[0]}, ${allLights[1]}), Light: (${lights[0]}, ${lights[1]})`);
        gl.uniform2fv(lightsUniformLocation, lights);

        const lightRangeUniformLocation = gl.getUniformLocation(program, 'lightRange');
        const lightRange = 100;
        gl.uniform1fv(lightRangeUniformLocation, new Float32Array([lightRange]));
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