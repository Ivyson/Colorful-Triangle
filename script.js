import {fsShader, vsShader} from './fragSource.js';
console.log(fsShader,'Helo',vsShader);
let vertices = new Float32Array(
    [
        -0.5, -0.5,
        0.5, -0.5,
        0.0, 0.5
    ]
);
let Cverteces = new Float32Array(
    [
        0.8, 0.8, 1.0,
        1.0, 0.4, 0.3,
        0,2, 1.0, 1.0
    ]
);


let canvas = document.querySelector('canvas');
canvas.style.backgroundColor = 'yellow';//see if it is working
canvas.width = '500';
canvas.height = '500';
const webgl = canvas.getContext('webgl');

let buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

let cbuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, cbuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, Cverteces, webgl.STATIC_DRAW);

let vShaderSrc , fShaderSrc;
fetch('vsShader.glsl')
.then(response =>
    {
        if(response.ok)
        {
            // vShaderSrc =  response.text();
            console.log('success');
            return response.text();
        }
        else{
            console.error('There is an error loading a vs Shader File');
            vShaderSrc = vsShader; //
            return;
        }
    })
.then(vertexShaderSource => 
    {
        let vShader = webgl.createShader(webgl.VERTEX_SHADER);
        webgl.shaderSource(vShader, vertexShaderSource);
        webgl.compileShader(vShader);
        if(!webgl.getShaderParameter(vShader, webgl.COMPILE_STATUS))
        {
            console.log('error! ',webgl.getShaderInfoLog(vShader));
        }
        return(fetch('fsShader.glsl')
        .then(response => 
            {
                if(response.ok)
                {
                    // fsShader =  response.text();
                    console.log('success');
                    return response.text();
                }
            })
            .then(fragSource =>
                {
                    let fShader = webgl.createShader(webgl.FRAGMENT_SHADER);
                    webgl.shaderSource(fShader, fragSource);
                    webgl.compileShader(fShader);
        if(!webgl.getShaderParameter(fShader, webgl.COMPILE_STATUS))
        {
            console.log('error! ',webgl.getShaderInfoLog(fShader));
        } 
        let program = webgl.createProgram();
        webgl.attachShader(program,vShader);
        webgl.attachShader(program,fShader);
        webgl.linkProgram(program);
        webgl.useProgram(program);
        if(!webgl.getProgramParameter(program, webgl.LINK_STATUS))
        {
            console.log('error! ',webgl.getProgramInfoLog(program));
        } 
        let Position = webgl.getAttribLocation(program, 'vecposition');
        if(Position < 0)
        {
            console.log('Position is invalid');
        }
        let cPosition = webgl.getAttribLocation(program, 'vcolor');
        if(cPosition < 0)
        {
            console.log('Position Color is invalid');
        }
        webgl.enableVertexAttribArray(cPosition);
        webgl.vertexAttribPointer(cPosition, 3, webgl.FLOAT, false, 0, 0);


        webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
        webgl.enableVertexAttribArray(Position);
        webgl.clearColor(1.0, 0.1, 0.1, 1.0);
        
        webgl.vertexAttribPointer(Position, 2, webgl.FLOAT, false, 0, 0);
        let theta = Math.PI/2;
        let angle = theta/1000
        function draw()
        {
            webgl.clear(webgl.COLOR_BUFFER_BIT);
            MatrixX(angle,program);
            MatrixY(angle,program);
            MatrixZ(angle,program);
            angle += 0.01;
            webgl.drawArrays(webgl.TRIANGLES, 0, 3);  
            window.requestAnimationFrame(draw);
        }
        draw();
                })
        
        )
    });
    function MatrixX(angle,program)
    {
        let MatX = IdMatrix();
        MatX[5] = Math.cos(angle);
        MatX[6] = -Math.sin(angle);
        MatX[6] = Math.sin(angle);
        MatX[11] = Math.cos(angle);
        let uniX = webgl.getUniformLocation(program, 'rotatex');
        webgl.uniformMatrix4fv(uniX, false, MatX);
        // return MatX;
    }
    function MatrixY(angle,program)//Actually this is Z
    {
        let MatY = IdMatrix();
        MatY[0] = Math.cos(angle);
        MatY[1] = -Math.sin(angle);
        MatY[4] = Math.sin(angle);
        MatY[5] = Math.cos(angle);
        let uniY = webgl.getUniformLocation(program, 'rotatey');
        webgl.uniformMatrix4fv(uniY, false, MatY);
        // return MatZ;
    }
    function MatrixZ(angle,program)//This is Y
    {
        let MatZ = IdMatrix();
        MatZ[0] = Math.cos(angle);
        MatZ[2] = -Math.sin(angle);
        MatZ[8] = Math.sin(angle);
        MatZ[10] = Math.cos(angle);
        let uniZ = webgl.getUniformLocation(program, 'rotatez');
        webgl.uniformMatrix4fv(uniZ, false, MatZ);
        // return MatZ;
    }


    function IdMatrix()
    {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
    }
    
