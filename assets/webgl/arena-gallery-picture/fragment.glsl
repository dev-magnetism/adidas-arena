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

void main() {   
    vec2 uv = resizedUv(vUv, uRatio);

	vec2 zoomedUv = vec2(
        mix(0.6, uv.x, uZoom),
        mix(0.6, uv.y, uZoom)
    );
  
	vec4 color = texture2D(uMap, zoomedUv);

	gl_FragColor = color;
	// gl_FragColor = vec4(.2, .84, 1., 1.);
	
    gl_FragColor.a *= uOpacity;
}