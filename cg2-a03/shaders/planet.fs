/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Fragment Phong Shader to be extended to a "Planet" shader.
 *
 * expects position and normal vectors in eye coordinates per vertex;
 * expects uniforms for ambient light, directional light, and phong material.
 * 
 *
 */

precision mediump float;

// position and normal in eye coordinates
varying vec4  ecPosition;
varying vec3  ecNormal;
varying vec2  texCoords;

//textures
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D bathymetryTexture;
uniform sampler2D cloudsTexture;
 
// transformation matrices
uniform mat4  modelViewMatrix;
uniform mat4  projectionMatrix;

// Ambient Light
uniform vec3 ambientLight;



// from Exercise
uniform bool debug;
uniform bool dayOn;
uniform bool nightOn;
uniform bool redgreen;
uniform bool gloss;
uniform bool clouds;


// Material
struct PhongMaterial {
    vec3  ambient;
    vec3  diffuse;
    vec3  specular;
    float shininess;
};
uniform PhongMaterial material;



// Light Source Data for a directional light
struct LightSource {

    int  type;
    vec3 direction;
    vec3 color;
    bool on;
    
} ;
uniform LightSource light;

/*

 Calculate surface color based on Phong illumination model.
 - pos:  position of point on surface, in eye coordinates
 - n:    surface normal at pos
 - v:    direction pointing towards the viewer, in eye coordinates
 + assuming directional light
 
 */
vec3 phong(vec3 pos, vec3 n, vec3 v, LightSource light, PhongMaterial material) {


    //multiplier for smooth transitions
    vec3 l = normalize(light.direction);
    float ndotl = dot(n,-l);
    float clampedNdotL = clamp(ndotl, 0.0, 0.5);
    float multiplier = (0.0 - clampedNdotL + 0.5) * 2.0;

    // textures
    vec3 dayColor = texture2D(dayTexture, texCoords).rgb * 1.5;
    vec3 nightColor = texture2D(nightTexture, texCoords).rgb * 1.5;
    vec3 bathyColor = texture2D(bathymetryTexture, texCoords).rgb;
    vec3 cloudsColor = texture2D(cloudsTexture, texCoords).rgb;



    // red/green map
    if(redgreen){
        if(bathyColor.x <= 0.2){ //if TextureColor is black draw green
            return vec3(0, 1, 0);
        }
        else
            return vec3(1, 0, 0);
    }
    
    
    // ambient part => nightSide
    vec3 ambient = material.ambient * ambientLight;
    vec3 ambientBase = ambientLight;
    if(nightOn){
        ambient = nightColor * ambientBase;
    }



    // clouds nightSide
    if(clouds){
        ambient = mix(ambient, -cloudsColor * ambientBase, cloudsColor.x);
    }



    


    
    // back face towards viewer (looking at the earth from the inside)?
    float ndotv = dot(n,v);
    if(ndotv<0.0)
        return vec3(1,0,0);
    
    // vector from light to current point
    //vec3 l = normalize(light.direction);
    
    // cos of angle between light and surface. 
    //float ndotl = dot(n,-l);
    if(ndotl<=0.0) 
        return ambient; // shadow / facing away from the light source
    


    // diffuse contribution
/*    vec3 diffuse = material.diffuse * light.color * ndotl;
    vec3 diffuseBase = light.color * ndotl;
    if(dayOn){
        diffuse = dayColor * diffuseBase;
    }*/

    vec3 diffuse = material.diffuse * light.color * ndotl;
    vec3 diffuseBase = light.color * ndotl;
    if(dayOn){
        diffuse = dayColor * diffuseBase;
    }

    // clouds daySide
    if(clouds){
        diffuse = mix(diffuse, cloudsColor * ndotl * 1.5, cloudsColor.x); // linear interpolation
    }


    
     // reflected light direction = perfect reflection direction
    vec3 r = reflect(l,n);
    
    // angle between reflection dir and viewing dir
    float rdotv = max( dot(r,v), 0.0);

    // multiplier for bathemetry 
    float specularMultiplier = 1.0;
    if(gloss){
        if(bathyColor.x <= 0.2){ //if TextureColor is black (land) reduce glossines
            specularMultiplier = 0.2;
            material.shininess = 1.0;
        }
    }

    
    // specular contribution
    vec3 specular = specularMultiplier * material.specular * light.color * pow(rdotv, material.shininess);



    //shows green debug line
    if (debug) {
        if(ndotl >= 0.0 && ndotl <= 0.03) {
            return vec3(0,1,0);
        }
    }


    //debug
    float darkFactor = 1.0;
    if(debug){
        if(mod(texCoords.s, 0.05) > 0.025)
        darkFactor = 0.5;
        ambient *= darkFactor;
        diffuse *= darkFactor;
    }
    


    // return sum of all contributions
    return ambient + diffuse + specular;
}

void main() {
    
    // normalize normal after projection
    vec3 normalEC = normalize(ecNormal);
    
    // do we use a perspective or an orthogonal projection matrix?
    bool usePerspective = projectionMatrix[2][3] != 0.0;
    
    // for perspective mode, the viewing direction (in eye coords) points
    // from the vertex to the origin (0,0,0) --> use -ecPosition as direction.
    // for orthogonal mode, the viewing direction is simply (0,0,1)
    vec3 viewdirEC = usePerspective? normalize(-ecPosition.xyz) : vec3(0,0,1);
    
    // calculate color using phong illumination
    vec3 color = phong( ecPosition.xyz, normalEC, viewdirEC,
                        light, material );

    gl_FragColor = vec4(color, 1.0);
    
}
