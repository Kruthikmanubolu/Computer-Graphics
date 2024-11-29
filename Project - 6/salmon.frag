#version 330 compatibility

uniform float   uKa, uKd, uKs;		// coefficients of each type of lighting
uniform float   uShininess;		// specular exponent

in  vec2  vST;			// texture coords
in  vec3  vN;			// normal vector
in  vec3  vL;			// vector from point to light
in  vec3  vE;			// vector from point to eye

const float EYES = 0.90;					// eye center s-coordinate
const float EYET = 0.65;					// eye center t-coordinate
const float R = 0.03;						// radius of salmon eye
const vec3 SALMONCOLOR = vec3( 0.98, 0.4, 0.3 );	// "salmon" (r,g,b) color
const vec3 EYECOLOR = vec3( 0., 1., 1. );			// color to make the eye
const vec3 SPECULARCOLOR = vec3( 1., 1., 1. );

void
main( )
{
	vec3 myColor = SALMONCOLOR;

	// Calculate distance to the eye center
	float ds = vST.s - EYES;  // s distance from current fragment to eye center
	float dt = vST.t - EYET;  // t distance from current fragment to eye center

	// Check if within eye radius
	if( sqrt(ds * ds + dt * dt) < R )
	{
		myColor = EYECOLOR;  // Set fragment color to eye color
	}

	// Now do the per-fragment lighting:

	vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);

	// Ambient lighting
	vec3 ambient = uKa * myColor;

	// Diffuse lighting
	float d = max(dot(Normal, Light), 0.0);  // Only calculate if light is visible
	vec3 diffuse = uKd * d * myColor;

	// Specular lighting
	float s = 0.0;
	if (d > 0.0)  // Only calculate if light is visible
	{
		vec3 ref = normalize(reflect(-Light, Normal));
		float cosphi = dot(Eye, ref);
		if (cosphi > 0.0)
			s = pow(max(cosphi, 0.0), uShininess);
	}
	vec3 specular = uKs * s * SPECULARCOLOR.rgb;

	// Final color output
	gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}
