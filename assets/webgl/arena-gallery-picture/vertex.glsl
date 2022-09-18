varying vec2 vUv;
uniform float uDiff;

void main()	{
    vec3 pos = position;
  
    pos.y *= 1. - uDiff;
    pos.x *= 1. - uDiff;

    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}