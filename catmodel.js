
var a=7;  
var b=2.6;
console.log('a=',a,'b=',b);
var myvector = new THREE.Vector3(0,1,2);
console.log('myvector =',myvector);

var animation = true;
var run = true;
var rocket = true;
var meshesLoaded = false;
var RESOURCES_LOADED = false;
var deg2rad = Math.PI/180;


var myboxMotion = new Motion(myboxSetMatrices);     
var catMotion = new Motion(catSetMatrices);
var catRun = new Motion(catSetMatricesRun);
var catRocket = new Motion(catSetMatricesRocket);
var link1, link2, link3, link4, link5;
var linkFrame1, linkFrame2, linkFrame3, linkFrame4, linkFrame5;
var sphere;    
var mybox;     
var meshes = {};  

// SETUP RENDERER & SCENE

var canvas = document.getElementById('canvas');
var camera;
var light;
var ambientLight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setClearColor(0x000000);     // set background colour
canvas.appendChild(renderer.domElement);

//////////////////////////////////////////////////////////
//  initCamera():   SETUP CAMERA
//////////////////////////////////////////////////////////

function initCamera() {
    // set up M_proj    (internally:  camera.projectionMatrix )
    var cameraFov = 30;     // initial camera vertical field of view, in degrees
      // view angle, aspect ratio, near, far
    camera = new THREE.PerspectiveCamera(cameraFov,1,0.1,1000); 

    var width = 10;  var height = 5;
//    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000 );

    // set up M_view:   (internally:  camera.matrixWorldInverse )
    camera.position.set(0,12,20);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(0,0,0);
    scene.add(camera);

      // SETUP ORBIT CONTROLS OF THE CAMERA
//    const controls = new OrbitControls( camera, renderer.domElement );
    var controls = new THREE.OrbitControls(camera);
    controls.damping = 0.2;
    controls.autoRotate = false;
};

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
}

////////////////////////////////////////////////////////////////////////	
// init():  setup up scene
////////////////////////////////////////////////////////////////////////	

function init() {
    console.log('init called');

    initCamera();
    initMotions();
    initLights();
    initObjects();
    // initHand();
    initCat();
    initFileObjects();

    window.addEventListener('resize',resize);
    resize();
};

////////////////////////////////////////////////////////////////////////
// initMotions():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initMotions() {

      // keyframes for the mybox animated motion:   name, time, [x, y, z, theta]
    myboxMotion.addKeyFrame(new Keyframe('pose A',0.0, [0, 0, 0, 0]));
    myboxMotion.addKeyFrame(new Keyframe('pose B',1.0, [0, 0, 30, 0]));
    myboxMotion.addKeyFrame(new Keyframe('pose C',1.2, [0, 0, 30, -180]));
    myboxMotion.addKeyFrame(new Keyframe('pose D',2.2, [0, 0, 0, -180]));
    myboxMotion.addKeyFrame(new Keyframe('pose A',2.4, [0, 0, 0, 0]));
    myboxMotion.addKeyFrame(new Keyframe('pose A',3.4, [0, 0, 30, 0]));
    

      // basic interpolation test, just printing interpolation result to the console
    myboxMotion.currTime = 0.1;
    console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=0.1
    myboxMotion.currTime = 2.9;
    console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=2.9

    catMotion.addKeyFrame(new Keyframe('stand1', 0, [0, 0, 0, 0, 0, 0, 0,0,0,0,0,0]));
    catMotion.addKeyFrame(new Keyframe('jump1', 1, [0, 3, 0,0, 0, 0, 0, 0,-5,-5,-10,-10]));
    catMotion.addKeyFrame(new Keyframe('jump2', 2, [0, 4, 15,15, 0, 0, -25,-25,0,0,0,0]));
    catMotion.addKeyFrame(new Keyframe('land2', 3, [0, 3, 15,15, 0, 0, -25, -25,0,0,0,0]));
    catMotion.addKeyFrame(new Keyframe('jump3', 4, [0, 2, 0,0, 0, 0, 0, 0,-15,-15,-10,-10]));
    catMotion.addKeyFrame(new Keyframe('stand2', 5, [0, 0, 0, 0, 0, 0, 0,0,0,0,0,0]));
 
    catRun.addKeyFrame(new Keyframe('stand1', 0, [0, 0, 0, 0, 0, 0, 0,0,0,0,0,0]));
    catRun.addKeyFrame(new Keyframe('run', 1, [0.5, 1, -25,-45, 0, 0, 25,25,0,0,0,0]));
    catRun.addKeyFrame(new Keyframe('run', 1.5, [1, 1, 15, 15, 0, 0, -25,-25,0,0,0,0]));
    catRun.addKeyFrame(new Keyframe('run', 2, [1.5, 0.5, 15, 15, 0, 0, -25,-25,0,0,0,0]));
    catRun.addKeyFrame(new Keyframe('run', 2.5, [2, 0, 15, 15, 0, 0, -25,-25,0,0,0,0]));
    catRun.addKeyFrame(new Keyframe('stand1', 3, [2.5, 0, 0, 0, 0, 0, 0,0,0,0,0,0]));
    catRun.addKeyFrame(new Keyframe('run', 3.5, [3, 1, -25,-45, 0, 0, 25,25,0,0,0,0]));
    catRun.addKeyFrame(new Keyframe('run', 4, [3.5, 1, 15, 15, 0, 0, -25,-25,0,0,0,0]));
    catRun.addKeyFrame(new Keyframe('run', 4.5, [4, 0.5, 15, 15, 0, 0, -25,-25,0,0,0,0]));
    catRun.addKeyFrame(new Keyframe('run', 5, [4.5, 0, 15, 15, 0, 0, -25,-25,0,0,0,0]));


    catRocket.addKeyFrame(new Keyframe('still', 0, [0, 0, 0, 0, 0, 0, 0,0,0,0,0,0]));
    catRocket.addKeyFrame(new Keyframe('still', 1, [0, 0, 0,0, 0, 0, 0,-40,0,0,0,0]));


}

/////////////////////////////////////	
// initLights():  SETUP LIGHTS
/////////////////////////////////////	

function initLights() {
    light = new THREE.PointLight(0xffffff);
    light.position.set(0,4,2);
    scene.add(light);
    ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);
}

function myboxSetMatrices(avars) {
  // note:  in the code below, we use the same keyframe information to animation both
  //        the box and the dragon, i.e., avars[], although only the dragon uses avars[3], as a rotation

  // update position of a box
  mybox.matrixAutoUpdate = false;     // tell three.js not to over-write our updates
  mybox.matrix.identity();
  mybox.matrix.multiply(new THREE.Matrix4().makeRotationY(-90*deg2rad));
  mybox.matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0], avars[1], avars[2]));
  mybox.matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
  // mybox.matrix.multiply(new THREE.Matrix4().makeScale(1.0, 1.0, 1.0));
  mybox.updateMatrixWorld();

  // update position of a dragon
  var theta = avars[3] * deg2rad;
  meshes["rocket1"].matrixAutoUpdate = false;
  meshes["rocket1"].matrix.identity();
  meshes["rocket1"].matrix.multiply(new THREE.Matrix4().makeRotationY(-90*deg2rad));
  meshes["rocket1"].matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0], 10, avars[2]));
  meshes["rocket1"].matrix.multiply(new THREE.Matrix4().makeRotationX(theta));
  meshes["rocket1"].matrix.multiply(new THREE.Matrix4().makeScale(0.03, 0.03, 0.03));
  meshes["rocket1"].updateMatrixWorld();
}


///////////////////////////////////////////////////////////////////////////////////////
// catSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function catSetMatricesRocket(avars) {
  var xPosition = avars[0];
  var yPosition = avars[1];
  var right_front_thighs = avars[2]*deg2rad;
  var left_front_thighs = avars[3]*deg2rad;
  var ankle = avars[4]*deg2rad;
  var neck = avars[5]*deg2rad;
  var right_back_thighs = avars[6]*deg2rad;
  var left_back_thighs = avars[7]*deg2rad;
  var right_front_shins = avars[8]*deg2rad;
  var left_front_shins = avars[9]*deg2rad;
  var right_back_shins = avars[10]*deg2rad;
  var left_back_shins = avars[11]*deg2rad
 
  var M =  new THREE.Matrix4();
  // head 
  // link1 
  linkFrame1.matrix.identity(); 
  linkFrame1.matrix.multiply(M.makeTranslation(xPosition,yPosition,0));   
  linkFrame1.matrix.multiply(M.makeRotationZ(0));    
    // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
  link1.matrix.copy(linkFrame1.matrix);
  link1.matrix.multiply(M.makeTranslation(4.7,1.9,0));
  link1.matrix.multiply(M.makeScale(1.1,1.1,1.1));       

  // Neck
  // link2
  linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
  linkFrame2.matrix.multiply(M.makeTranslation(0,0,0));
  // linkFrame2.matrix.multiply(M.makeTranslation(5,0,1));
  linkFrame2.matrix.multiply(M.makeRotationZ(0));    
    // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  link2.matrix.copy(linkFrame2.matrix);
  link2.matrix.multiply(M.makeTranslation(3.7,1,0));   
  link2.matrix.multiply(M.makeScale(0.65,0.65,0.65));    

  // Body (front, centre, back)
  ///////////////  link3
  linkFrame3.matrix.copy(linkFrame2.matrix);
  linkFrame3.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame3.matrix.multiply(M.makeRotationZ(0));    
    // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
  link3.matrix.copy(linkFrame3.matrix);
  link3.matrix.multiply(M.makeTranslation(2,0.5,0));   
  link3.matrix.multiply(M.makeScale(1.5,1.5,1.5));    

    /////////////// link4
  linkFrame4.matrix.copy(linkFrame3.matrix);
  // linkFrame4.matrix.multiply(M.makeTranslation(5,0,-1));
  linkFrame4.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame4.matrix.multiply(M.makeRotationZ(0));    
    // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
  link4.matrix.copy(linkFrame4.matrix);
  link4.matrix.multiply(M.makeTranslation(0.2,0.4,0));   
  link4.matrix.multiply(M.makeScale(1.3,1.3,1.3));    

    // link5
  linkFrame5.matrix.copy(linkFrame4.matrix);
  linkFrame5.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame5.matrix.multiply(M.makeRotationZ(0));    
    // Frame 5 has been established, now setup the extra transformations for the scaled box geometry
  link5.matrix.copy(linkFrame5.matrix);
  link5.matrix.multiply(M.makeTranslation(-1.3,0.5,0));   
  link5.matrix.multiply(M.makeScale(1.5,1.5,1.5));    
  
  // Backlegs (Left)
  // link6
  linkFrame6.matrix.copy(linkFrame5.matrix);
  linkFrame6.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame6.matrix.multiply(M.makeRotationZ(left_back_thighs));    
    // Frame 6 has been established, now setup the extra transformations for the scaled box geometry
  link6.matrix.copy(linkFrame6.matrix);
  link6.matrix.multiply(M.makeTranslation(-1.6,-0.2,1.6));   
  link6.matrix.multiply(M.makeRotationZ(140)); 
  link6.matrix.multiply(M.makeScale(1.5,0.8,0.7)); 

  // link7
  linkFrame7.matrix.copy(linkFrame6.matrix);
  linkFrame7.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame7.matrix.multiply(M.makeRotationZ(left_back_shins));    
    // Frame 7 has been established, now setup the extra transformations for the scaled box geometry
  link7.matrix.copy(linkFrame7.matrix);
  link7.matrix.multiply(M.makeTranslation(-1.8,-1.9,1.6));   
  link7.matrix.multiply(M.makeRotationZ(95)); 
  link7.matrix.multiply(M.makeScale(1.3,0.5,0.7)); 


  // link8
  linkFrame8.matrix.copy(linkFrame7.matrix);
  linkFrame8.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame8.matrix.multiply(M.makeRotationZ(ankle));    
    // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link8.matrix.copy(linkFrame8.matrix);
  link8.matrix.multiply(M.makeTranslation(-2.4,-3.2,1.6)); 
  link8.matrix.multiply(M.makeRotationZ(140.1)); 
  link8.matrix.multiply(M.makeScale(0.8,0.35,0.7));

   // link9
  linkFrame9.matrix.copy(linkFrame8.matrix);
  linkFrame9.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame9.matrix.multiply(M.makeRotationZ(0));    
     // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link9.matrix.copy(linkFrame9.matrix);
  link9.matrix.multiply(M.makeTranslation(-1.8,-3.8,1.6)); 
  link9.matrix.multiply(M.makeScale(0.7,0.4,0.7));


  //Backlegs (Right)
  // link10
  linkFrame10.matrix.copy(linkFrame5.matrix);
  linkFrame10.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame10.matrix.multiply(M.makeRotationZ(right_back_thighs));
    // Frame 10 has been established, now setup the extra transformations for the scaled box geometry
  link10.matrix.copy(linkFrame10.matrix);
  link10.matrix.multiply(M.makeTranslation(-1.6,-0.2,-1.6));   
  link10.matrix.multiply(M.makeRotationZ(140)); 
  link10.matrix.multiply(M.makeScale(1.5,0.8,0.7)); 

  // link11
  linkFrame11.matrix.copy(linkFrame10.matrix);
  linkFrame11.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame11.matrix.multiply(M.makeRotationZ(right_back_shins));    
    // Frame 11 has been established, now setup the extra transformations for the scaled box geometry
  link11.matrix.copy(linkFrame11.matrix);
  link11.matrix.multiply(M.makeTranslation(-1.8,-1.9,-1.6));   
  link11.matrix.multiply(M.makeRotationZ(95)); 
  link11.matrix.multiply(M.makeScale(1.3,0.5,0.7)); 


  // link12
  linkFrame12.matrix.copy(linkFrame11.matrix);
  linkFrame12.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame12.matrix.multiply(M.makeRotationZ(ankle));    
    // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link12.matrix.copy(linkFrame12.matrix);
  link12.matrix.multiply(M.makeTranslation(-2.4,-3.2,-1.6)); 
  link12.matrix.multiply(M.makeRotationZ(140.1)); 
  link12.matrix.multiply(M.makeScale(0.8,0.35,0.7));


   // link13
  linkFrame13.matrix.copy(linkFrame12.matrix);
  linkFrame13.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame13.matrix.multiply(M.makeRotationZ(0));    
     // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link13.matrix.copy(linkFrame13.matrix);
  link13.matrix.multiply(M.makeTranslation(-1.8,-3.8,-1.6)); 
  link13.matrix.multiply(M.makeScale(0.7,0.4,0.7));



  // Front Legs (Left)
  // link14
  linkFrame14.matrix.copy(linkFrame3.matrix);
  linkFrame14.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame14.matrix.multiply(M.makeRotationZ(left_front_thighs));    
    // Frame 14 has been established, now setup the extra transformations for the scaled box geometry
  link14.matrix.copy(linkFrame14.matrix);
  link14.matrix.multiply(M.makeTranslation(2.3,-0.5,1.6));   
  link14.matrix.multiply(M.makeRotationZ(95.5)); 
  link14.matrix.multiply(M.makeScale(1.3,0.6,0.7)); 


  // link15
  linkFrame15.matrix.copy(linkFrame14.matrix);
  linkFrame15.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame15.matrix.multiply(M.makeRotationZ(left_front_shins));    
    // Frame 15 has been established, now setup the extra transformations for the scaled box geometry
  link15.matrix.copy(linkFrame15.matrix);
  link15.matrix.multiply(M.makeTranslation(2.3,-2.4,1.6)); 
  link15.matrix.multiply(M.makeRotationZ(140.1)); 
  link15.matrix.multiply(M.makeScale(1.3,0.5,0.7));


   // link16
  linkFrame16.matrix.copy(linkFrame15.matrix);
  linkFrame16.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame16.matrix.multiply(M.makeRotationZ(0));    
    // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link16.matrix.copy(linkFrame16.matrix);
  link16.matrix.multiply(M.makeTranslation(3.1,-3.7,1.6)); 
  link16.matrix.multiply(M.makeScale(0.7,0.4,0.7));



  // Front Legs (Right)
  // link17
  linkFrame17.matrix.copy(linkFrame3.matrix);
  linkFrame17.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame17.matrix.multiply(M.makeRotationZ(right_front_thighs));    
    // Frame 14 has been established, now setup the extra transformations for the scaled box geometry
  link17.matrix.copy(linkFrame14.matrix);
  link17.matrix.multiply(M.makeTranslation(2.3,-0.5,-1.6));   
  link17.matrix.multiply(M.makeRotationZ(95.5)); 
  link17.matrix.multiply(M.makeScale(1.3,0.6,0.7)); 


  // link18
  linkFrame18.matrix.copy(linkFrame14.matrix);
  linkFrame18.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame18.matrix.multiply(M.makeRotationZ(right_front_shins));    
    // Frame 15 has been established, now setup the extra transformations for the scaled box geometry
  link18.matrix.copy(linkFrame15.matrix);
  link18.matrix.multiply(M.makeTranslation(2.3,-2.4,-1.6)); 
  link18.matrix.multiply(M.makeRotationZ(140.1)); 
  link18.matrix.multiply(M.makeScale(1.3,0.5,0.7));


  // link19
  linkFrame19.matrix.copy(linkFrame15.matrix);
  linkFrame19.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame19.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link19.matrix.copy(linkFrame16.matrix);
  link19.matrix.multiply(M.makeTranslation(3.1,-3.7,-1.6)); 
  link19.matrix.multiply(M.makeScale(0.7,0.4,0.7));

  // left ear
  // link20
  linkFrame20.matrix.copy(linkFrame1.matrix);
  linkFrame20.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame20.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link20.matrix.copy(linkFrame20.matrix);
  link20.matrix.multiply(M.makeTranslation(4.7,3,0.4));    
  link20.matrix.multiply(M.makeScale(1.3,1.5,1.3));

  // right ear
  // link22
  linkFrame21.matrix.copy(linkFrame1.matrix);
  linkFrame21.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame21.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link21.matrix.copy(linkFrame20.matrix);
  link21.matrix.multiply(M.makeTranslation(4.7,3,-0.4));  
  link21.matrix.multiply(M.makeScale(1.3,1.5,1.3));

  //nose
  //link 22
  linkFrame22.matrix.copy(linkFrame1.matrix);
  linkFrame22.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame22.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link22.matrix.copy(linkFrame20.matrix);
  link22.matrix.multiply(M.makeTranslation(5.8,2,0));  
  link22.matrix.multiply(M.makeScale(0.2,0.2,0.2));

  // tail
  // link 23
  linkFrame23.matrix.copy(linkFrame5.matrix);
  linkFrame23.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame23.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link23.matrix.copy(linkFrame23.matrix);
  link23.matrix.multiply(M.makeTranslation(-3,2,0));
  link23.matrix.multiply(M.makeRotationZ(-140.5)); 
  link23.matrix.multiply(M.makeScale(0.2,0.2,0.2));   

  // link 24
  linkFrame24.matrix.copy(linkFrame23.matrix);
  linkFrame24.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame24.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link24.matrix.copy(linkFrame24.matrix);
  link24.matrix.multiply(M.makeTranslation(-3.3,4.84,0));
  link24.matrix.multiply(M.makeRotationZ(140.7)); 
  link24.matrix.multiply(M.makeScale(0.2,0.2,0.2));  


  link1.updateMatrixWorld();
  link2.updateMatrixWorld();
  link3.updateMatrixWorld();
  link4.updateMatrixWorld();
  link5.updateMatrixWorld();
  link6.updateMatrixWorld();
  link7.updateMatrixWorld();
  link8.updateMatrixWorld();
  link9.updateMatrixWorld();
  link10.updateMatrixWorld();
  link11.updateMatrixWorld();
  link12.updateMatrixWorld();
  link13.updateMatrixWorld();
  link14.updateMatrixWorld();
  link15.updateMatrixWorld();
  link16.updateMatrixWorld();
  link17.updateMatrixWorld();
  link18.updateMatrixWorld();
  link19.updateMatrixWorld();
  link20.updateMatrixWorld();    
  link21.updateMatrixWorld();
  link22.updateMatrixWorld();
  link23.updateMatrixWorld();
  link24.updateMatrixWorld();




  linkFrame1.updateMatrixWorld();
  linkFrame2.updateMatrixWorld();
  linkFrame3.updateMatrixWorld();
  linkFrame4.updateMatrixWorld();
  linkFrame5.updateMatrixWorld();
  linkFrame6.updateMatrixWorld();
  linkFrame7.updateMatrixWorld();
  linkFrame8.updateMatrixWorld();
  linkFrame9.updateMatrixWorld();
  linkFrame10.updateMatrixWorld();
  linkFrame11.updateMatrixWorld();
  linkFrame12.updateMatrixWorld();
  linkFrame13.updateMatrixWorld();
  linkFrame14.updateMatrixWorld();
  linkFrame15.updateMatrixWorld();
  linkFrame16.updateMatrixWorld();
  linkFrame17.updateMatrixWorld();
  linkFrame18.updateMatrixWorld();
  linkFrame19.updateMatrixWorld();
  linkFrame20.updateMatrixWorld();
  linkFrame21.updateMatrixWorld();
  linkFrame22.updateMatrixWorld();
  linkFrame23.updateMatrixWorld();
  linkFrame24.updateMatrixWorld();
}

function catSetMatricesRun(avars) {
  var xPosition = avars[0];
  var yPosition = avars[1];
  var right_front_thighs = avars[2]*deg2rad;
  var left_front_thighs = avars[3]*deg2rad;
  var ankle = avars[4]*deg2rad;
  var neck = avars[5]*deg2rad;
  var right_back_thighs = avars[6]*deg2rad;
  var left_back_thighs = avars[7]*deg2rad;
  var right_front_shins = avars[8]*deg2rad;
  var left_front_shins = avars[9]*deg2rad;
  var right_back_shins = avars[10]*deg2rad;
  var left_back_shins = avars[11]*deg2rad
 
  var M =  new THREE.Matrix4();
  // head 
  // link1 
  linkFrame1.matrix.identity(); 
  linkFrame1.matrix.multiply(M.makeTranslation(xPosition,yPosition,0));   
  linkFrame1.matrix.multiply(M.makeRotationZ(0));    
    // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
  link1.matrix.copy(linkFrame1.matrix);
  link1.matrix.multiply(M.makeTranslation(4.7,1.9,0));
  link1.matrix.multiply(M.makeScale(1.1,1.1,1.1));       

  // Neck
  // link2
  linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
  linkFrame2.matrix.multiply(M.makeTranslation(0,0,0));
  // linkFrame2.matrix.multiply(M.makeTranslation(5,0,1));
  linkFrame2.matrix.multiply(M.makeRotationZ(0));    
    // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  link2.matrix.copy(linkFrame2.matrix);
  link2.matrix.multiply(M.makeTranslation(3.7,1,0));   
  link2.matrix.multiply(M.makeScale(0.65,0.65,0.65));    

  // Body (front, centre, back)
  ///////////////  link3
  linkFrame3.matrix.copy(linkFrame2.matrix);
  linkFrame3.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame3.matrix.multiply(M.makeRotationZ(0));    
    // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
  link3.matrix.copy(linkFrame3.matrix);
  link3.matrix.multiply(M.makeTranslation(2,0.5,0));   
  link3.matrix.multiply(M.makeScale(1.5,1.5,1.5));    

    /////////////// link4
  linkFrame4.matrix.copy(linkFrame3.matrix);
  // linkFrame4.matrix.multiply(M.makeTranslation(5,0,-1));
  linkFrame4.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame4.matrix.multiply(M.makeRotationZ(0));    
    // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
  link4.matrix.copy(linkFrame4.matrix);
  link4.matrix.multiply(M.makeTranslation(0.2,0.4,0));   
  link4.matrix.multiply(M.makeScale(1.3,1.3,1.3));    

    // link5
  linkFrame5.matrix.copy(linkFrame4.matrix);
  linkFrame5.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame5.matrix.multiply(M.makeRotationZ(0));    
    // Frame 5 has been established, now setup the extra transformations for the scaled box geometry
  link5.matrix.copy(linkFrame5.matrix);
  link5.matrix.multiply(M.makeTranslation(-1.3,0.5,0));   
  link5.matrix.multiply(M.makeScale(1.5,1.5,1.5));    
  
  // Backlegs (Left)
  // link6
  linkFrame6.matrix.copy(linkFrame5.matrix);
  linkFrame6.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame6.matrix.multiply(M.makeRotationZ(left_back_thighs));    
    // Frame 6 has been established, now setup the extra transformations for the scaled box geometry
  link6.matrix.copy(linkFrame6.matrix);
  link6.matrix.multiply(M.makeTranslation(-1.6,-0.2,1.6));   
  link6.matrix.multiply(M.makeRotationZ(140)); 
  link6.matrix.multiply(M.makeScale(1.5,0.8,0.7)); 

  // link7
  linkFrame7.matrix.copy(linkFrame6.matrix);
  linkFrame7.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame7.matrix.multiply(M.makeRotationZ(left_back_shins));    
    // Frame 7 has been established, now setup the extra transformations for the scaled box geometry
  link7.matrix.copy(linkFrame7.matrix);
  link7.matrix.multiply(M.makeTranslation(-1.8,-1.9,1.6));   
  link7.matrix.multiply(M.makeRotationZ(95)); 
  link7.matrix.multiply(M.makeScale(1.3,0.5,0.7)); 


  // link8
  linkFrame8.matrix.copy(linkFrame7.matrix);
  linkFrame8.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame8.matrix.multiply(M.makeRotationZ(ankle));    
    // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link8.matrix.copy(linkFrame8.matrix);
  link8.matrix.multiply(M.makeTranslation(-2.4,-3.2,1.6)); 
  link8.matrix.multiply(M.makeRotationZ(140.1)); 
  link8.matrix.multiply(M.makeScale(0.8,0.35,0.7));


   // link9
  linkFrame9.matrix.copy(linkFrame8.matrix);
  linkFrame9.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame9.matrix.multiply(M.makeRotationZ(0));    
     // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link9.matrix.copy(linkFrame9.matrix);
  link9.matrix.multiply(M.makeTranslation(-1.8,-3.8,1.6)); 
  link9.matrix.multiply(M.makeScale(0.7,0.4,0.7));


  //Backlegs (Right)
  // link10
  linkFrame10.matrix.copy(linkFrame5.matrix);
  linkFrame10.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame10.matrix.multiply(M.makeRotationZ(right_back_thighs));
    // Frame 10 has been established, now setup the extra transformations for the scaled box geometry
  link10.matrix.copy(linkFrame10.matrix);
  link10.matrix.multiply(M.makeTranslation(-1.6,-0.2,-1.6));   
  link10.matrix.multiply(M.makeRotationZ(140)); 
  link10.matrix.multiply(M.makeScale(1.5,0.8,0.7)); 

  // link11
  linkFrame11.matrix.copy(linkFrame10.matrix);
  linkFrame11.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame11.matrix.multiply(M.makeRotationZ(right_back_shins));    
    // Frame 11 has been established, now setup the extra transformations for the scaled box geometry
  link11.matrix.copy(linkFrame11.matrix);
  link11.matrix.multiply(M.makeTranslation(-1.8,-1.9,-1.6));   
  link11.matrix.multiply(M.makeRotationZ(95)); 
  link11.matrix.multiply(M.makeScale(1.3,0.5,0.7)); 


  // link12
  linkFrame12.matrix.copy(linkFrame11.matrix);
  linkFrame12.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame12.matrix.multiply(M.makeRotationZ(ankle));    
    // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link12.matrix.copy(linkFrame12.matrix);
  link12.matrix.multiply(M.makeTranslation(-2.4,-3.2,-1.6)); 
  link12.matrix.multiply(M.makeRotationZ(140.1)); 
  link12.matrix.multiply(M.makeScale(0.8,0.35,0.7));


   // link13
  linkFrame13.matrix.copy(linkFrame12.matrix);
  linkFrame13.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame13.matrix.multiply(M.makeRotationZ(0));    
     // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link13.matrix.copy(linkFrame13.matrix);
  link13.matrix.multiply(M.makeTranslation(-1.8,-3.8,-1.6)); 
  link13.matrix.multiply(M.makeScale(0.7,0.4,0.7));



  // Front Legs (Left)
  // link14
  linkFrame14.matrix.copy(linkFrame3.matrix);
  linkFrame14.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame14.matrix.multiply(M.makeRotationZ(left_front_thighs));    
    // Frame 14 has been established, now setup the extra transformations for the scaled box geometry
  link14.matrix.copy(linkFrame14.matrix);
  link14.matrix.multiply(M.makeTranslation(2.3,-0.5,1.6));   
  link14.matrix.multiply(M.makeRotationZ(95.5)); 
  link14.matrix.multiply(M.makeScale(1.3,0.6,0.7)); 


  // link15
  linkFrame15.matrix.copy(linkFrame14.matrix);
  linkFrame15.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame15.matrix.multiply(M.makeRotationZ(left_front_shins));    
    // Frame 15 has been established, now setup the extra transformations for the scaled box geometry
  link15.matrix.copy(linkFrame15.matrix);
  link15.matrix.multiply(M.makeTranslation(2.3,-2.4,1.6)); 
  link15.matrix.multiply(M.makeRotationZ(140.1)); 
  link15.matrix.multiply(M.makeScale(1.3,0.5,0.7));


   // link16
  linkFrame16.matrix.copy(linkFrame15.matrix);
  linkFrame16.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame16.matrix.multiply(M.makeRotationZ(0));    
    // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link16.matrix.copy(linkFrame16.matrix);
  link16.matrix.multiply(M.makeTranslation(3.1,-3.7,1.6)); 
  link16.matrix.multiply(M.makeScale(0.7,0.4,0.7));



  // Front Legs (Right)
  // link17
  linkFrame17.matrix.copy(linkFrame3.matrix);
  linkFrame17.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame17.matrix.multiply(M.makeRotationZ(right_front_thighs));    
    // Frame 14 has been established, now setup the extra transformations for the scaled box geometry
  link17.matrix.copy(linkFrame14.matrix);
  link17.matrix.multiply(M.makeTranslation(2.3,-0.5,-1.6));   
  link17.matrix.multiply(M.makeRotationZ(95.5)); 
  link17.matrix.multiply(M.makeScale(1.3,0.6,0.7)); 


  // link18
  linkFrame18.matrix.copy(linkFrame14.matrix);
  linkFrame18.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame18.matrix.multiply(M.makeRotationZ(right_front_shins));    
    // Frame 15 has been established, now setup the extra transformations for the scaled box geometry
  link18.matrix.copy(linkFrame15.matrix);
  link18.matrix.multiply(M.makeTranslation(2.3,-2.4,-1.6)); 
  link18.matrix.multiply(M.makeRotationZ(140.1)); 
  link18.matrix.multiply(M.makeScale(1.3,0.5,0.7));


  // link19
  linkFrame19.matrix.copy(linkFrame15.matrix);
  linkFrame19.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame19.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link19.matrix.copy(linkFrame16.matrix);
  link19.matrix.multiply(M.makeTranslation(3.1,-3.7,-1.6)); 
  link19.matrix.multiply(M.makeScale(0.7,0.4,0.7));

  // left ear
  // link20
  linkFrame20.matrix.copy(linkFrame1.matrix);
  linkFrame20.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame20.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link20.matrix.copy(linkFrame20.matrix);
  link20.matrix.multiply(M.makeTranslation(4.7,3,0.4));    
  link20.matrix.multiply(M.makeScale(1.3,1.5,1.3));

  // right ear
  // link22
  linkFrame21.matrix.copy(linkFrame1.matrix);
  linkFrame21.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame21.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link21.matrix.copy(linkFrame20.matrix);
  link21.matrix.multiply(M.makeTranslation(4.7,3,-0.4));  
  link21.matrix.multiply(M.makeScale(1.3,1.5,1.3));

  //nose
  //link 22
  linkFrame22.matrix.copy(linkFrame1.matrix);
  linkFrame22.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame22.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link22.matrix.copy(linkFrame20.matrix);
  link22.matrix.multiply(M.makeTranslation(5.8,2,0));  
  link22.matrix.multiply(M.makeScale(0.2,0.2,0.2));

  // tail
  // link 23
  linkFrame23.matrix.copy(linkFrame5.matrix);
  linkFrame23.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame23.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link23.matrix.copy(linkFrame23.matrix);
  link23.matrix.multiply(M.makeTranslation(-3,2,0));
  link23.matrix.multiply(M.makeRotationZ(-140.5)); 
  link23.matrix.multiply(M.makeScale(0.2,0.2,0.2));   

  // link 24
  linkFrame24.matrix.copy(linkFrame23.matrix);
  linkFrame24.matrix.multiply(M.makeTranslation(0,0,0));
  linkFrame24.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link24.matrix.copy(linkFrame24.matrix);
  link24.matrix.multiply(M.makeTranslation(-3.3,4.84,0));
  link24.matrix.multiply(M.makeRotationZ(140.7)); 
  link24.matrix.multiply(M.makeScale(0.2,0.2,0.2));  


  link1.updateMatrixWorld();
  link2.updateMatrixWorld();
  link3.updateMatrixWorld();
  link4.updateMatrixWorld();
  link5.updateMatrixWorld();
  link6.updateMatrixWorld();
  link7.updateMatrixWorld();
  link8.updateMatrixWorld();
  link9.updateMatrixWorld();
  link10.updateMatrixWorld();
  link11.updateMatrixWorld();
  link12.updateMatrixWorld();
  link13.updateMatrixWorld();
  link14.updateMatrixWorld();
  link15.updateMatrixWorld();
  link16.updateMatrixWorld();
  link17.updateMatrixWorld();
  link18.updateMatrixWorld();
  link19.updateMatrixWorld();
  link20.updateMatrixWorld();    
  link21.updateMatrixWorld();
  link22.updateMatrixWorld();
  link23.updateMatrixWorld();
  link24.updateMatrixWorld();




  linkFrame1.updateMatrixWorld();
  linkFrame2.updateMatrixWorld();
  linkFrame3.updateMatrixWorld();
  linkFrame4.updateMatrixWorld();
  linkFrame5.updateMatrixWorld();
  linkFrame6.updateMatrixWorld();
  linkFrame7.updateMatrixWorld();
  linkFrame8.updateMatrixWorld();
  linkFrame9.updateMatrixWorld();
  linkFrame10.updateMatrixWorld();
  linkFrame11.updateMatrixWorld();
  linkFrame12.updateMatrixWorld();
  linkFrame13.updateMatrixWorld();
  linkFrame14.updateMatrixWorld();
  linkFrame15.updateMatrixWorld();
  linkFrame16.updateMatrixWorld();
  linkFrame17.updateMatrixWorld();
  linkFrame18.updateMatrixWorld();
  linkFrame19.updateMatrixWorld();
  linkFrame20.updateMatrixWorld();
  linkFrame21.updateMatrixWorld();
  linkFrame22.updateMatrixWorld();
  linkFrame23.updateMatrixWorld();
  linkFrame24.updateMatrixWorld();
}

function catSetMatrices(avars) {
    var xPosition = avars[0];
    var yPosition = avars[1];
    var right_front_thighs = avars[2]*deg2rad;
    var left_front_thighs = avars[3]*deg2rad;
    var ankle = avars[4]*deg2rad;
    var neck = avars[5]*deg2rad;
    var right_back_thighs = avars[6]*deg2rad;
    var left_back_thighs = avars[7]*deg2rad;
    var right_front_shins = avars[8]*deg2rad;
    var left_front_shins = avars[9]*deg2rad;
    var right_back_shins = avars[10]*deg2rad;
    var left_back_shins = avars[11]*deg2rad
   
    var M =  new THREE.Matrix4();
    
    // head 
    // link1 
    linkFrame1.matrix.identity(); 
    linkFrame1.matrix.multiply(M.makeTranslation(xPosition,yPosition,0));   
    linkFrame1.matrix.multiply(M.makeRotationZ(0));    
      // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
    link1.matrix.copy(linkFrame1.matrix);
    link1.matrix.multiply(M.makeTranslation(4.7,1.9,0));
    link1.matrix.multiply(M.makeScale(1.1,1.1,1.1));       

    // Neck
    // link2
    linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
    linkFrame2.matrix.multiply(M.makeTranslation(0,0,0));
    // linkFrame2.matrix.multiply(M.makeTranslation(5,0,1));
    linkFrame2.matrix.multiply(M.makeRotationZ(0));    
      // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
    link2.matrix.copy(linkFrame2.matrix);
    link2.matrix.multiply(M.makeTranslation(3.7,1,0));   
    link2.matrix.multiply(M.makeScale(0.65,0.65,0.65));    

    // Body (front, centre, back)
    ///////////////  link3
    linkFrame3.matrix.copy(linkFrame2.matrix);
    linkFrame3.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame3.matrix.multiply(M.makeRotationZ(0));    
      // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
    link3.matrix.copy(linkFrame3.matrix);
    link3.matrix.multiply(M.makeTranslation(2,0.5,0));   
    link3.matrix.multiply(M.makeScale(1.5,1.5,1.5));    

      /////////////// link4
    linkFrame4.matrix.copy(linkFrame3.matrix);
    // linkFrame4.matrix.multiply(M.makeTranslation(5,0,-1));
    linkFrame4.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame4.matrix.multiply(M.makeRotationZ(0));    
      // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
    link4.matrix.copy(linkFrame4.matrix);
    link4.matrix.multiply(M.makeTranslation(0.2,0.4,0));   
    link4.matrix.multiply(M.makeScale(1.3,1.3,1.3));    

      // link5
    linkFrame5.matrix.copy(linkFrame4.matrix);
    linkFrame5.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame5.matrix.multiply(M.makeRotationZ(0));    
      // Frame 5 has been established, now setup the extra transformations for the scaled box geometry
    link5.matrix.copy(linkFrame5.matrix);
    link5.matrix.multiply(M.makeTranslation(-1.3,0.5,0));   
    link5.matrix.multiply(M.makeScale(1.5,1.5,1.5));    
    
    // Backlegs (Left)
    // link6
    linkFrame6.matrix.copy(linkFrame5.matrix);
    linkFrame6.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame6.matrix.multiply(M.makeRotationZ(left_back_thighs));    
      // Frame 6 has been established, now setup the extra transformations for the scaled box geometry
    link6.matrix.copy(linkFrame6.matrix);
    link6.matrix.multiply(M.makeTranslation(-1.6,-0.2,1.6));   
    link6.matrix.multiply(M.makeRotationZ(140)); 
    link6.matrix.multiply(M.makeScale(1.5,0.8,0.7)); 

    // link7
    linkFrame7.matrix.copy(linkFrame6.matrix);
    linkFrame7.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame7.matrix.multiply(M.makeRotationZ(left_back_shins));    
      // Frame 7 has been established, now setup the extra transformations for the scaled box geometry
    link7.matrix.copy(linkFrame7.matrix);
    link7.matrix.multiply(M.makeTranslation(-1.8,-1.9,1.6));   
    link7.matrix.multiply(M.makeRotationZ(95)); 
    link7.matrix.multiply(M.makeScale(1.3,0.5,0.7)); 


    // link8
    linkFrame8.matrix.copy(linkFrame7.matrix);
    linkFrame8.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame8.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
    link8.matrix.copy(linkFrame8.matrix);
    link8.matrix.multiply(M.makeTranslation(-2.4,-3.2,1.6)); 
    link8.matrix.multiply(M.makeRotationZ(140.1)); 
    link8.matrix.multiply(M.makeScale(0.8,0.35,0.7));


     // link9
    linkFrame9.matrix.copy(linkFrame8.matrix);
    linkFrame9.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame9.matrix.multiply(M.makeRotationZ(0));    
       // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
    link9.matrix.copy(linkFrame9.matrix);
    link9.matrix.multiply(M.makeTranslation(-1.8,-3.8,1.6)); 
    link9.matrix.multiply(M.makeScale(0.7,0.4,0.7));


    //Backlegs (Right)
    // link10
    linkFrame10.matrix.copy(linkFrame5.matrix);
    linkFrame10.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame10.matrix.multiply(M.makeRotationZ(right_back_thighs));
      // Frame 10 has been established, now setup the extra transformations for the scaled box geometry
    link10.matrix.copy(linkFrame10.matrix);
    link10.matrix.multiply(M.makeTranslation(-1.6,-0.2,-1.6));   
    link10.matrix.multiply(M.makeRotationZ(140)); 
    link10.matrix.multiply(M.makeScale(1.5,0.8,0.7)); 

    // link11
    linkFrame11.matrix.copy(linkFrame10.matrix);
    linkFrame11.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame11.matrix.multiply(M.makeRotationZ(right_back_shins));    
      // Frame 11 has been established, now setup the extra transformations for the scaled box geometry
    link11.matrix.copy(linkFrame11.matrix);
    link11.matrix.multiply(M.makeTranslation(-1.8,-1.9,-1.6));   
    link11.matrix.multiply(M.makeRotationZ(95)); 
    link11.matrix.multiply(M.makeScale(1.3,0.5,0.7)); 


    // link12
    linkFrame12.matrix.copy(linkFrame11.matrix);
    linkFrame12.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame12.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
    link12.matrix.copy(linkFrame12.matrix);
    link12.matrix.multiply(M.makeTranslation(-2.4,-3.2,-1.6)); 
    link12.matrix.multiply(M.makeRotationZ(140.1)); 
    link12.matrix.multiply(M.makeScale(0.8,0.35,0.7));


     // link13
    linkFrame13.matrix.copy(linkFrame12.matrix);
    linkFrame13.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame13.matrix.multiply(M.makeRotationZ(0));    
       // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
    link13.matrix.copy(linkFrame13.matrix);
    link13.matrix.multiply(M.makeTranslation(-1.8,-3.8,-1.6)); 
    link13.matrix.multiply(M.makeScale(0.7,0.4,0.7));



    // Front Legs (Left)
    // link14
    linkFrame14.matrix.copy(linkFrame3.matrix);
    linkFrame14.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame14.matrix.multiply(M.makeRotationZ(left_front_thighs));    
      // Frame 14 has been established, now setup the extra transformations for the scaled box geometry
    link14.matrix.copy(linkFrame14.matrix);
    link14.matrix.multiply(M.makeTranslation(2.3,-0.5,1.6));   
    link14.matrix.multiply(M.makeRotationZ(95.5)); 
    link14.matrix.multiply(M.makeScale(1.3,0.6,0.7)); 
 
 
    // link15
    linkFrame15.matrix.copy(linkFrame14.matrix);
    linkFrame15.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame15.matrix.multiply(M.makeRotationZ(left_front_shins));    
      // Frame 15 has been established, now setup the extra transformations for the scaled box geometry
    link15.matrix.copy(linkFrame15.matrix);
    link15.matrix.multiply(M.makeTranslation(2.3,-2.4,1.6)); 
    link15.matrix.multiply(M.makeRotationZ(140.1)); 
    link15.matrix.multiply(M.makeScale(1.3,0.5,0.7));
 
 
     // link16
    linkFrame16.matrix.copy(linkFrame15.matrix);
    linkFrame16.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame16.matrix.multiply(M.makeRotationZ(0));    
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
    link16.matrix.copy(linkFrame16.matrix);
    link16.matrix.multiply(M.makeTranslation(3.1,-3.7,1.6)); 
    link16.matrix.multiply(M.makeScale(0.7,0.4,0.7));



    // Front Legs (Right)
    // link17
    linkFrame17.matrix.copy(linkFrame3.matrix);
    linkFrame17.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame17.matrix.multiply(M.makeRotationZ(right_front_thighs));    
      // Frame 14 has been established, now setup the extra transformations for the scaled box geometry
    link17.matrix.copy(linkFrame14.matrix);
    link17.matrix.multiply(M.makeTranslation(2.3,-0.5,-1.6));   
    link17.matrix.multiply(M.makeRotationZ(95.5)); 
    link17.matrix.multiply(M.makeScale(1.3,0.6,0.7)); 


    // link18
    linkFrame18.matrix.copy(linkFrame14.matrix);
    linkFrame18.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame18.matrix.multiply(M.makeRotationZ(right_front_shins));    
      // Frame 15 has been established, now setup the extra transformations for the scaled box geometry
    link18.matrix.copy(linkFrame15.matrix);
    link18.matrix.multiply(M.makeTranslation(2.3,-2.4,-1.6)); 
    link18.matrix.multiply(M.makeRotationZ(140.1)); 
    link18.matrix.multiply(M.makeScale(1.3,0.5,0.7));


    // link19
    linkFrame19.matrix.copy(linkFrame15.matrix);
    linkFrame19.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame19.matrix.multiply(M.makeRotationZ(0));    
        // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
    link19.matrix.copy(linkFrame16.matrix);
    link19.matrix.multiply(M.makeTranslation(3.1,-3.7,-1.6)); 
    link19.matrix.multiply(M.makeScale(0.7,0.4,0.7));

    // left ear
    // link20
    linkFrame20.matrix.copy(linkFrame1.matrix);
    linkFrame20.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame20.matrix.multiply(M.makeRotationZ(0));    
        // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
    link20.matrix.copy(linkFrame20.matrix);
    link20.matrix.multiply(M.makeTranslation(4.7,3,0.4));    
    link20.matrix.multiply(M.makeScale(1.3,1.5,1.3));

    // right ear
    // link22
    linkFrame21.matrix.copy(linkFrame1.matrix);
    linkFrame21.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame21.matrix.multiply(M.makeRotationZ(0));    
        // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
    link21.matrix.copy(linkFrame20.matrix);
    link21.matrix.multiply(M.makeTranslation(4.7,3,-0.4));  
    link21.matrix.multiply(M.makeScale(1.3,1.5,1.3));

    //nose
    //link 22
    linkFrame22.matrix.copy(linkFrame1.matrix);
    linkFrame22.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame22.matrix.multiply(M.makeRotationZ(0));    
        // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
    link22.matrix.copy(linkFrame20.matrix);
    link22.matrix.multiply(M.makeTranslation(5.8,2,0));  
    link22.matrix.multiply(M.makeScale(0.2,0.2,0.2));

    // tail
    // link 23
    linkFrame23.matrix.copy(linkFrame5.matrix);
    linkFrame23.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame23.matrix.multiply(M.makeRotationZ(0));    
        // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
    link23.matrix.copy(linkFrame23.matrix);
    link23.matrix.multiply(M.makeTranslation(-3,2,0));
    link23.matrix.multiply(M.makeRotationZ(-140.5)); 
    link23.matrix.multiply(M.makeScale(0.2,0.2,0.2));   

    // link 24
    linkFrame24.matrix.copy(linkFrame23.matrix);
    linkFrame24.matrix.multiply(M.makeTranslation(0,0,0));
    linkFrame24.matrix.multiply(M.makeRotationZ(0));    
        // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
    link24.matrix.copy(linkFrame24.matrix);
    link24.matrix.multiply(M.makeTranslation(-3.3,4.84,0));
    link24.matrix.multiply(M.makeRotationZ(140.7)); 
    link24.matrix.multiply(M.makeScale(0.2,0.2,0.2));  


    link1.updateMatrixWorld();
    link2.updateMatrixWorld();
    link3.updateMatrixWorld();
    link4.updateMatrixWorld();
    link5.updateMatrixWorld();
    link6.updateMatrixWorld();
    link7.updateMatrixWorld();
    link8.updateMatrixWorld();
    link9.updateMatrixWorld();
    link10.updateMatrixWorld();
    link11.updateMatrixWorld();
    link12.updateMatrixWorld();
    link13.updateMatrixWorld();
    link14.updateMatrixWorld();
    link15.updateMatrixWorld();
    link16.updateMatrixWorld();
    link17.updateMatrixWorld();
    link18.updateMatrixWorld();
    link19.updateMatrixWorld();
    link20.updateMatrixWorld();    
    link21.updateMatrixWorld();
    link22.updateMatrixWorld();
    link23.updateMatrixWorld();
    link24.updateMatrixWorld();




    linkFrame1.updateMatrixWorld();
    linkFrame2.updateMatrixWorld();
    linkFrame3.updateMatrixWorld();
    linkFrame4.updateMatrixWorld();
    linkFrame5.updateMatrixWorld();
    linkFrame6.updateMatrixWorld();
    linkFrame7.updateMatrixWorld();
    linkFrame8.updateMatrixWorld();
    linkFrame9.updateMatrixWorld();
    linkFrame10.updateMatrixWorld();
    linkFrame11.updateMatrixWorld();
    linkFrame12.updateMatrixWorld();
    linkFrame13.updateMatrixWorld();
    linkFrame14.updateMatrixWorld();
    linkFrame15.updateMatrixWorld();
    linkFrame16.updateMatrixWorld();
    linkFrame17.updateMatrixWorld();
    linkFrame18.updateMatrixWorld();
    linkFrame19.updateMatrixWorld();
    linkFrame20.updateMatrixWorld();
    linkFrame21.updateMatrixWorld();
    linkFrame22.updateMatrixWorld();
    linkFrame23.updateMatrixWorld();
    linkFrame24.updateMatrixWorld();
}


/////////////////////////////////////////////////////////////////////////////////////
//  initCat():  define all geometry associated with the cat
/////////////////////////////////////////////////////////////////////////////////////

function initCat() {
    var catMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    var sphereGeometry = new THREE.SphereGeometry(1,64,32,0,6.28,6.28);
    var coneGeometry = new THREE.ConeGeometry(0.3,0.5,64,64);
    var cylinderGeometry = new THREE.CylinderGeometry(0.5,0.5,20,64,64);

    link1 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link1 );
    linkFrame1   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame1);
    link2 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link2 );
    linkFrame2   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame2);
    link3 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link3 );
    linkFrame3   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame3);
    link4 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link4 );
    linkFrame4   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame4);
    link5 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link5 );
    linkFrame5   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame5);

    link6 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link6 );
    linkFrame6   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame6);
    link7 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link7 );
    linkFrame7   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame7);
    link8 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link8 );
    linkFrame8   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame8);
    link9 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link9 );
    linkFrame9   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame9);
    link10 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link10 );
    linkFrame10   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame10);
    link11 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link11 );
    linkFrame11   = new THREE.AxesHelper(1) ;  
    scene.add(linkFrame11);
    link12 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link12 );
    linkFrame12   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame12);
    link13 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link13 );
    linkFrame13   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame13);

    link14 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link14 );
    linkFrame14   = new THREE.AxesHelper(1) ;  
    scene.add(linkFrame14);
    link15 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link15 );
    linkFrame15   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame15);
    link16 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link16 );
    linkFrame16   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame16);

    link17 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link17 );
    linkFrame17   = new THREE.AxesHelper(1) ;  
    scene.add(linkFrame17);
    link18 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link18 );
    linkFrame18   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame18);
    link19 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link19 );
    linkFrame19   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame19);

    link20 = new THREE.Mesh( coneGeometry, catMaterial );  
    scene.add( link20 );
    linkFrame20   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame20);
    link21 = new THREE.Mesh( coneGeometry, catMaterial );  
    scene.add( link21 );
    linkFrame21   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame21);

    link22 = new THREE.Mesh( sphereGeometry, catMaterial );  
    scene.add( link22 );
    linkFrame22   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame22);


    link23 = new THREE.Mesh( cylinderGeometry, catMaterial );  
    scene.add( link23 );
    linkFrame23   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame23);

    link24 = new THREE.Mesh( cylinderGeometry, catMaterial );  
    scene.add( link24 );
    linkFrame24   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame24);

    link1.matrixAutoUpdate = false;  
    link2.matrixAutoUpdate = false;  
    link3.matrixAutoUpdate = false;  
    link4.matrixAutoUpdate = false;  
    link5.matrixAutoUpdate = false;
    link6.matrixAutoUpdate = false;  
    link7.matrixAutoUpdate = false;  
    link8.matrixAutoUpdate = false;  
    link9.matrixAutoUpdate = false;  
    link10.matrixAutoUpdate = false;
    link11.matrixAutoUpdate = false;
    link12.matrixAutoUpdate = false;
    link13.matrixAutoUpdate = false;
    link14.matrixAutoUpdate = false;
    link15.matrixAutoUpdate = false;
    link16.matrixAutoUpdate = false;
    link17.matrixAutoUpdate = false;
    link18.matrixAutoUpdate = false;
    link19.matrixAutoUpdate = false;
    link20.matrixAutoUpdate = false;
    link21.matrixAutoUpdate = false;
    link22.matrixAutoUpdate = false;
    link23.matrixAutoUpdate = false;
    link24.matrixAutoUpdate = false;

    linkFrame1.matrixAutoUpdate = false;  
    linkFrame2.matrixAutoUpdate = false;  
    linkFrame3.matrixAutoUpdate = false;  
    linkFrame4.matrixAutoUpdate = false;  
    linkFrame5.matrixAutoUpdate = false;
    linkFrame6.matrixAutoUpdate = false;  
    linkFrame7.matrixAutoUpdate = false;  
    linkFrame8.matrixAutoUpdate = false;  
    linkFrame9.matrixAutoUpdate = false;  
    linkFrame10.matrixAutoUpdate = false;
    linkFrame11.matrixAutoUpdate = false;  
    linkFrame12.matrixAutoUpdate = false;
    linkFrame13.matrixAutoUpdate = false;
    linkFrame14.matrixAutoUpdate = false;  
    linkFrame15.matrixAutoUpdate = false;
    linkFrame16.matrixAutoUpdate = false;
    linkFrame17.matrixAutoUpdate = false;  
    linkFrame18.matrixAutoUpdate = false;
    linkFrame19.matrixAutoUpdate = false;
    linkFrame20.matrixAutoUpdate = false;
    linkFrame21.matrixAutoUpdate = false;
    linkFrame22.matrixAutoUpdate = false;
    linkFrame23.matrixAutoUpdate = false;
    linkFrame24.matrixAutoUpdate = false;
    
}


/////////////////////////////////////	
// MATERIALS
/////////////////////////////////////	

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
var basicMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var armadilloMaterial = new THREE.MeshBasicMaterial( {color: 0x7fff7f} );

/////////////////////////////////////	
// initObjects():  setup objects in the scene
/////////////////////////////////////	

function initObjects() {
    var worldFrame = new THREE.AxesHelper(5) ;
    scene.add(worldFrame);

  // mybox 
  var myboxGeometry = new THREE.BoxGeometry(1, 1, 1);    // width, height, depth
  mybox = new THREE.Mesh(myboxGeometry, diffuseMaterial);
  mybox.position.set(3, 20, 3);
  scene.add(mybox);

    // textured floor
    var floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1);
    var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
    var floorGeometry = new THREE.PlaneGeometry(15, 15);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -1.1;
    floor.rotation.x = Math.PI / 2;
    // scene.add(floor);

    // moon
    lightTexture = new THREE.TextureLoader().load('images/moon.jpg');
    lightTexture.wrapS = lightTexture.wrapT = THREE.RepeatWrapping;
    lightTexture.repeat.set(1,1);

    lightObjGeometry = new THREE.SphereGeometry(20,64,32,0,6.28,6.28);    // radius, segments, segments
    lightObjMaterial = new THREE.MeshBasicMaterial( {map: lightTexture} );
    lightObj = new THREE.Mesh(lightObjGeometry, lightObjMaterial);
    lightObj.position.set(0, -24, 0);
    lightObj.rotation.set(-Math.PI / 4, -Math.PI / 2, 0);
    scene.add(lightObj);

    // sphere, located at light position
    var sphereGeometry = new THREE.SphereGeometry(1,64,32,0,6.28,6.28);  // radius, segments, segments
    sphere = new THREE.Mesh(sphereGeometry, basicMaterial);
    sphere.position.set(0,4,2);
    sphere.position.set(light.position.x, light.position.y, light.position.z);
    // scene.add(sphere);

    // box
    var sphereGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
    var box = new THREE.Mesh( sphereGeometry, diffuseMaterial );
    box.position.set(-4, 0, 0);
    // scene.add( box );

    // multi-colored cube      [https://stemkoski.github.io/Three.js/HelloWorld.html] 
    var cubeMaterialArray = [];    // order to add materials: x+,x-,y+,y-,z+,z-
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff3333 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff8800 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xffff33 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x33ff33 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x3333ff } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x8833ff } ) );
      // Cube parameters: width (x), height (y), depth (z), 
      //        (optional) segments along x, segments along y, segments along z
    var mccGeometry = new THREE.BoxGeometry( 1.5, 1.5, 1.5, 1, 1, 1 );
    var mcc = new THREE.Mesh( mccGeometry, cubeMaterialArray );
    mcc.position.set(0,0,0);
    // scene.add( mcc );	

    // cylinder
    // parameters:  radiusAtTop, radiusAtBottom, height, radialSegments, heightSegments
    var cylinderGeometry = new THREE.CylinderGeometry( 0.30, 0.30, 0.80, 20, 4 );
    var cylinder = new THREE.Mesh( cylinderGeometry, diffuseMaterial);
    cylinder.position.set(2, 0, 0);
    // scene.add( cylinder );

    // cone:   parameters --  radiusTop, radiusBot, height, radialSegments, heightSegments
    var coneGeometry = new THREE.CylinderGeometry( 0.0, 0.30, 0.80, 20, 4 );
    var cone = new THREE.Mesh( coneGeometry, diffuseMaterial);
    cone.position.set(4, 0, 0);
    // scene.add( cone);

    // torus:   parameters -- radius, diameter, radialSegments, torusSegments
    var torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
    var torus = new THREE.Mesh( torusGeometry, diffuseMaterial);

    torus.rotation.set(0,0,0);     // rotation about x,y,z axes
    torus.scale.set(1,2,3);
    torus.position.set(-6, 0, 0);   // translation

    // scene.add( torus );

    /////////////////////////////////////
    //  CUSTOM OBJECT 
    ////////////////////////////////////
    
    var geom = new THREE.Geometry(); 
    var v0 = new THREE.Vector3(0,0,0);
    var v1 = new THREE.Vector3(3,0,0);
    var v2 = new THREE.Vector3(0,3,0);
    var v3 = new THREE.Vector3(3,3,0);
    
    geom.vertices.push(v0);
    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);
    
    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geom.faces.push( new THREE.Face3( 1, 3, 2 ) );
    geom.computeFaceNormals();
    
    customObject = new THREE.Mesh( geom, diffuseMaterial );
    customObject.position.set(0, 0, -2);
    // scene.add(customObject);
}

/////////////////////////////////////////////////////////////////////////////////////
//  initHand():  define all geometry associated with the hand
/////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////
//  create customShader material
/////////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial( {
//        uniforms: { textureSampler: {type: 't', value: floorTexture}},
	vertexShader: document.getElementById( 'customVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'customFragmentShader' ).textContent
} );

// var ctx = renderer.context;
// ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

////////////////////////////////////////////////////////////////////////	
// initFileObjects():    read object data from OBJ files;  see onResourcesLoaded() for instances
////////////////////////////////////////////////////////////////////////	

var models;

function initFileObjects() {
  // list of OBJ files that we want to load, and their material
  models = {
    teapot: { obj: "obj/teapot.obj", mtl: customShaderMaterial, mesh: null },
    armadillo: { obj: "obj/armadillo.obj", mtl: customShaderMaterial, mesh: null },
    dragon: { obj: "obj/dragon.obj", mtl: customShaderMaterial, mesh: null },
    // the teapot is loaded here with details on the materials and the mesh
    teapot: { obj: "obj/teapot.obj", mtl: customShaderMaterial, mesh: null },
    rocket: { obj: "obj/rocket.obj", mtl: customShaderMaterial, mes: null }
  };

  var manager = new THREE.LoadingManager();
  manager.onLoad = function () {
    console.log("loaded all resources");
    RESOURCES_LOADED = true;
    onResourcesLoaded();
  }
  var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };
  var onError = function (xhr) {
  };

  // Load models;  asynchronous in JS, so wrap code in a fn and pass it the index
  for (var _key in models) {
    console.log('Key:', _key);
    (function (key) {
      var objLoader = new THREE.OBJLoader(manager);
      objLoader.load(models[key].obj, function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = models[key].mtl;
            child.material.shading = THREE.SmoothShading;
          }
        });
        models[key].mesh = object;
      }, onProgress, onError);
    })(_key);
  }
}

/////////////////////////////////////////////////////////////////////////////////////
// onResourcesLoaded():  once all OBJ files are loaded, this gets called.
//                       Object instancing is done here
/////////////////////////////////////////////////////////////////////////////////////

function onResourcesLoaded(){
	
    meshes["armadillo1"] = models.armadillo.mesh.clone();
    meshes["armadillo2"] = models.armadillo.mesh.clone();
    meshes["dragon1"] = models.dragon.mesh.clone();
    // clone the teapot model into meshes 
    meshes["teapot1"] = models.teapot.mesh.clone();
    meshes["rocket1"] = models.rocket.mesh.clone();

    meshes["rocket1"].position.set(3, 20, 3);
    meshes["rocket1"].scale.set(0.03, 0.03, 0.03);
    scene.add(meshes["rocket1"]);
  
    meshesLoaded = true;
}


///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var keyCode = event.which;
  // up
  if (keyCode == "W".charCodeAt()) {          // W = up
    light.position.y += 0.11;
    // down
  } else if (keyCode == "S".charCodeAt()) {   // S = down
    light.position.y -= 0.11;
    // left
  } else if (keyCode == "A".charCodeAt()) {   // A = left
    light.position.x -= 0.1;
    // right
  } else if (keyCode == "D".charCodeAt()) {   // D = right
    light.position.x += 0.11;
  } else if (keyCode == " ".charCodeAt()) {   // space
    animation = !animation;
  } else if( keyCode == "R".charCodeAt()){
    run = !run;
  } else if ( keyCode == "X".charCodeAt()) {
    rocket = !rocket;
  }
};

///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK:    This is the main animation loop
///////////////////////////////////////////////////////////////////////////////////////

function update() {
  //    console.log('update()');
  var dt = 0.02;
  if (animation && meshesLoaded) {
    // advance the motion of all the animated objects
    catMotion.timestep(dt);
    if (run) {
      catRun.timestep(dt);
    }
    if (rocket) {
      catRocket.timestep(dt);
      myboxMotion.timestep(dt);
    }
  }

  if (meshesLoaded) {
    sphere.position.set(light.position.x, light.position.y, light.position.z);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(update);      // requests the next update call;  this creates a loop
}

init();
update();

    

///////////////////////////////////////////////////////////////////////////////////////
// myboxSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

// function myboxSetMatrices(avars) {
//     // note:  in the code below, we use the same keyframe information to animation both
//     //        the box and the dragon, i.e., avars[], although only the dragon uses avars[3], as a rotation

//      // update position of a box
//     // mybox.matrixAutoUpdate = false;     // tell three.js not to over-write our updates
//     // mybox.matrix.identity();              
//     // mybox.matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0], avars[1], avars[2]));  
//     // mybox.matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI/2));
//     // mybox.matrix.multiply(new THREE.Matrix4().makeScale(1.0,1.0,1.0));
//     // mybox.updateMatrixWorld();  

//      // update position of a dragon
//     // var theta = avars[3]*deg2rad;
//     // meshes["dragon1"].matrixAutoUpdate = false;
//     // meshes["dragon1"].matrix.identity();
//     // meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0],avars[1],0));  
//     // meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeRotationX(theta));  
//     // meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeScale(0.3,0.3,0.3));
//     // meshes["dragon1"].updateMatrixWorld();  
// }

///////////////////////////////////////////////////////////////////////////////////////
// handSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function handSetMatrices(avars) {
    // var xPosition = avars[0];
    // var yPosition = avars[1];
    // var front_knees = avars[2]*deg2rad;
    // var ankle = avars[3]*deg2rad;
    // var theta3 = avars[4]*deg2rad;
    // var back_knees = avars[5]*deg2rad;
    // var ankle = avars[6]*deg2rad;
    // var M =  new THREE.Matrix4();
    
    //   ////////////// link1 
    // linkFrame1.matrix.identity(); 
    // linkFrame1.matrix.multiply(M.makeTranslation(xPosition,yPosition,0));   
    // linkFrame1.matrix.multiply(M.makeRotationZ(front_knees));    
    //   // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
    // link1.matrix.copy(linkFrame1.matrix);
    // link1.matrix.multiply(M.makeTranslation(2,0,0));
    // link1.matrix.multiply(M.makeScale(4,1,1));    
    // // link1.matrix.multiply(M.makeScale(6,1,5));    

    //   ////////////// link2
    // linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
    // linkFrame2.matrix.multiply(M.makeTranslation(4,0,1));
    // // linkFrame2.matrix.multiply(M.makeTranslation(5,0,1));
    // linkFrame2.matrix.multiply(M.makeRotationZ(ankle));    
    //   // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
    // link2.matrix.copy(linkFrame2.matrix);
    // link2.matrix.multiply(M.makeTranslation(2,0,0));   
    // link2.matrix.multiply(M.makeScale(4,1,1));    

    //   ///////////////  link3
    // linkFrame3.matrix.copy(linkFrame2.matrix);
    // linkFrame3.matrix.multiply(M.makeTranslation(4,0,0));
    // linkFrame3.matrix.multiply(M.makeRotationZ(theta3));    
    //   // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
    // link3.matrix.copy(linkFrame3.matrix);
    // link3.matrix.multiply(M.makeTranslation(2,0,0));   
    // link3.matrix.multiply(M.makeScale(4,1,1));    

    //   /////////////// link4
    // linkFrame4.matrix.copy(linkFrame1.matrix);
    // // linkFrame4.matrix.multiply(M.makeTranslation(5,0,-1));
    // linkFrame4.matrix.multiply(M.makeTranslation(4,0,-1));
    // linkFrame4.matrix.multiply(M.makeRotationZ(back_knees));    
    //   // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
    // link4.matrix.copy(linkFrame4.matrix);
    // link4.matrix.multiply(M.makeTranslation(2,0,0));   
    // link4.matrix.multiply(M.makeScale(4,1,1));    

    //   // link5
    // linkFrame5.matrix.copy(linkFrame4.matrix);
    // linkFrame5.matrix.multiply(M.makeTranslation(4,0,0));
    // linkFrame5.matrix.multiply(M.makeRotationZ(ankle));    
    //   // Frame 5 has been established, now setup the extra transformations for the scaled box geometry
    // link5.matrix.copy(linkFrame5.matrix);
    // link5.matrix.multiply(M.makeTranslation(2,0,0));   
    // link5.matrix.multiply(M.makeScale(4,1,1));    

    // link1.updateMatrixWorld();
    // link2.updateMatrixWorld();
    // link3.updateMatrixWorld();
    // link4.updateMatrixWorld();
    // link5.updateMatrixWorld();

    // linkFrame1.updateMatrixWorld();
    // linkFrame2.updateMatrixWorld();
    // linkFrame3.updateMatrixWorld();
    // linkFrame4.updateMatrixWorld();
    // linkFrame5.updateMatrixWorld();
}

