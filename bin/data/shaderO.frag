#version 150

uniform vec2			iResolution;
uniform float			iGlobalTime;
uniform vec4			iMouse;
uniform sampler2DRect	iChannel0;
out vec4 outputColor;

in vec2 texCoordVarying;
in vec4 positionVarying;
//in vec4 gl_FragCoord;

//SETTINGS//
const float timeScale = 10.0;
const float cloudScale = 0.5;
const float skyCover = 0.6; //overwritten by mouse x drag
const float softness = 0.2;
const float brightness = 1.0;
const int noiseOctaves = 8;
const float curlStrain = 3.0;
//SETTINGS//

float saturate(float num)
{
    return clamp(num,0.0,1.0);
}

float noise(vec2 uv)
{
    return texture(iChannel0,uv).r;
}

vec2 rotate(vec2 uv)
{
    uv = uv + noise(uv*0.2)*0.005;
    float rot = curlStrain;
    float sinRot=sin(rot);
    float cosRot=cos(rot);
    mat2 rotMat = mat2(cosRot,-sinRot,sinRot,cosRot);
    return uv * rotMat;
}

float fbm (vec2 uv)
{
    float rot = 1.57;
    float sinRot=sin(rot);
    float cosRot=cos(rot);
    float f = 0.0;
    float total = 0.0;
    float mul = 0.5;
    mat2 rotMat = mat2(cosRot,-sinRot,sinRot,cosRot);
    
    for(int i = 0;i < noiseOctaves;i++)
    {
        f += noise(uv+iGlobalTime*0.00015*timeScale*(1.0-mul))*mul;
        total += mul;
        uv *= 3.0;
        uv=rotate(uv);
        mul *= 0.5;
    }
    return f/total;
}

void main(void)
{
    //vec2 uv = gl_FragCoord.xy/(40000.0*cloudScale);
    vec2 uv = texCoordVarying;
    float mouseXAffect = (iMouse.x/iResolution.x);
    //mouseXAffect = 0.5;
    float cover = mouseXAffect*1.1+0.1;
    if( iMouse.z<=0.0001 ) cover = 0.5;
    
    float bright = brightness*(1.8-cover);
    
    float color1 = fbm(uv-0.5+iGlobalTime*0.00004*timeScale);
    float color2 = fbm(uv-10.5+iGlobalTime*0.00002*timeScale);
    
    float clouds1 = smoothstep(1.0-cover,min((1.0-cover)+softness*2.0,1.0),color1);
    float clouds2 = smoothstep(1.0-cover,min((1.0-cover)+softness,1.0),color2);
    
    float cloudsFormComb = saturate(clouds1+clouds2);
    
    vec4 skyCol = vec4(0.6,0.8,1.0,1.0);
    float cloudCol = saturate(saturate(1.0-pow(color1,1.0)*0.2)*bright);
    vec4 clouds1Color = vec4(cloudCol,cloudCol,cloudCol,1.0);
    vec4 clouds2Color = mix(clouds1Color,skyCol,0.25);

    vec4 cloudColComb = mix(clouds1Color,clouds2Color,saturate(clouds2-clouds1));
    
	//outputColor = mix(skyCol,cloudColComb,cloudsFormComb);

	vec4 col = texture(iChannel0, texCoordVarying);
	outputColor = col;
}