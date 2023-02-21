precision highp float;

uniform sampler2D uMap;
uniform vec2 uRatio;
uniform vec2 uResolutionEl;
uniform float uOpacity;
uniform float uZoom;
uniform float uOffset;
varying vec2 vUv;

// uRatio = ratio de l'image
// uResolutionEl = ratio de la div


vec2 resizedUv(vec2 inital_uv, vec2 aspect_ratio)
{
	vec2 ratio = vec2(
		min((uResolutionEl.x / uResolutionEl.y) / (aspect_ratio.x / aspect_ratio.y), 1.0),
		min((uResolutionEl.y / uResolutionEl.x) / (aspect_ratio.y / aspect_ratio.x), 1.0)
	);

	vec2 new_uv = vec2(
		inital_uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
		inital_uv.y * ratio.y + (1.0 - ratio.y) * 0.5
	);

	return new_uv;
}

vec3 stepBorder(in vec2 _uv, in float _width){
	vec2 bl = step(vec2(_width),_uv); // bottom-left
	vec2 tr = step(vec2(_width),1.0-_uv);   // top-right
    // botom left && top right
    vec3 pct = vec3(bl.x * bl.y * tr.x * tr.y);
    return pct;
 }

void main() {   
    vec2 uv = resizedUv(vUv, uRatio);

	vec2 zoomedUv = vec2(
        mix(0.6, uv.x, uZoom),
        mix(0.6, uv.y, uZoom)
    );

// float strength = mod(vUv.y * 10.0, 1.0);
// strength = step(0.8, strength);
	
  
	// vec4 color = texture2D(uMap, zoomedUv);
	// vec4 test = vec4s(strength, strength, strength, 1.);



// float test = rect(uv, 0.99, .005);
// 	float testbis = rect(uv - vec2(-.5 + 0.005,-0.5 + 0.005), .01);
// 	float testbisbis = rect(uv - vec2(0.5 - 0.005, 0.5 - 0.005), .01);
// 	float testbisbisbis = rect(uv - vec2(-0.5 + 0.005, 0.5 - 0.005), .01);
// 	float testbisbisbisbis = rect(uv - vec2(0.5 - 0.005, -0.5 + 0.005), .01);
// 	float testttt = flip(test + (testbis + testbisbis + testbisbisbis + testbisbisbisbis),1.);

	// color.rgb = vec3(testttt);

		// gl_FragColor = color;


	// gl_FragColor = mix(color,cadre, cadre.a);
	gl_FragColor = vec4(.2, .84, 1., 1.);
	
    gl_FragColor.a *= uOpacity;
}