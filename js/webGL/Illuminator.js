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

        uniform float squareDimension;
        uniform vec2 playerPosition;

        void main() {
            float deltaX = (gl_FragCoord.x - playerPosition.x);
            float deltaY = (gl_FragCoord.y - playerPosition.y);
            float alpha = ( deltaX * deltaX + deltaY * deltaY) / (100000.0);

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

    const setUpAttribs = function(playerPos) {
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
        gl.uniform2fv(playerPositionUniformLocation, new Float32Array([playerPos.x, playerPos.y]));

        const squareDimensionUniformLocation = gl.getUniformLocation(program, 'squareDimension');
        let squareDimension = Math.min(webCanvas.width, webCanvas.height);
        squareDimension *= (squareDimension / 4);
        gl.uniform1fv(squareDimensionUniformLocation, new Float32Array([squareDimension]));
//        gl.uniform2fv(squareDimensionUniformLocation, new Float32Array([squareDimension, 0.0]));
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

        setUpAttribs(lights[0]);
        
        gl.drawArrays(
            gl.TRIANGLE_FAN, //What to draw, triangles? triangle strip?
            0, //how many to skip
            4 //Number of vertices
        );

        return webCanvas;
    }
}