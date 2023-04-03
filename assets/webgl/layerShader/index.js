export const LayerShader = {
  uniforms: {
    tDiffuse: { value: null },
    uOpacity: { value: 0.0 },
  },
  vertexShader: `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
  fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uOpacity;

        varying vec2 vUv;

        void main()
        {
            vec4 inColor = texture2D(tDiffuse, vUv);
            vec4 color = vec4(0.961, 0.961, 0.953, 1.);

            gl_FragColor = mix(inColor, color, uOpacity);
        }
    `,
}
