#define PI 3.14159265359

varying vec2 vUv;
uniform float uVelocity;

void main()	{
    vUv = uv;
    
    vec3 pos = position;
    // pos.x += uVelocity * uv.y * 0.00005;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

}