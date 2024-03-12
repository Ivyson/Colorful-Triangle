precision highp float;
attribute vec2 vecposition;
uniform mat4 rotatex;
uniform mat4 rotatey;
uniform mat4 rotatez;
attribute vec3 vcolor;
varying vec3 color;
void main()
{
    color = vcolor;
    gl_Position = rotatex*rotatey*vec4(vecposition,0.0, 1.0);
}