#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
	mShader.load("shaderO");
	int w = ofGetWindowWidth();
	int h = ofGetWindowHeight();
	mNoiseImage.loadImage("max.jpg");
	//mNoiseImage.allocate(w, h, OF_IMAGE_COLOR);
	//generateTexture();
	mNoiseImage.bind(0);
	mPlane = ofPlanePrimitive(w, h, 2, 2);
	mPlane.mapTexCoordsFromTexture(mNoiseImage.getTextureReference());
	mPlane.setPosition(w/2, h/2, 0);
	//ofSetWindowShape(512, 512);
}

//--------------------------------------------------------------
void ofApp::update(){


}

void ofApp::generateTexture()
{ 
	for (int i = 0; i < 512; i++)
	{
		for (int j = 0; j < 512; j++)
		{
			//int valR = (int) ofRandom(0,255);
			//int valG = (int)ofRandom(0, 255);
			//int valB = (int)ofRandom(0, 255);
			float valR = 255*(ofNoise(i, j)+1.)/2.;
			float valG = 255*(ofNoise(i, j)+1.)/2.;
			float valB = 255*(ofNoise(i, j)+1.)/2.;
			mNoiseImage.getPixels()[(j * 512 + i)*3 + 0] = valR;
			mNoiseImage.getPixels()[(j * 512 + i) * 3 + 1] = valG;
			mNoiseImage.getPixels()[(j * 512 + i) * 3 + 2] = valB;
		}
	}
	mNoiseImage.update();

}

//--------------------------------------------------------------
void ofApp::draw(){
	mShader.begin();
	ofClear(ofColor::black);
	mPlane.draw();
	float runningTime = ofGetElapsedTimef();
	mShader.setUniform1f("iGlobalTime", runningTime);
	mShader.setUniform2f("iResolution", ofVec2f(ofGetWindowWidth(), ofGetWindowHeight()));
	mShader.setUniform4f("iMouse", ofVec4f(ofGetMouseX(), ofGetMouseY(), 0, 0));
	mShader.setUniformTexture("iChannel0", mNoiseImage.getTextureReference(), 0);
	mShader.end();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){

}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}
