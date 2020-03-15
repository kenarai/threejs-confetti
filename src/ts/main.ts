
import "../scss/main.scss";
import "../scss/canvas.scss";

//  ====================================  WebGL  =========================================================

const THREE = require("three");
const { EffectComposer } = require('three/examples/jsm/postprocessing/EffectComposer.js');
const { RenderPass } = require('three/examples/jsm/postprocessing/RenderPass.js');
const { GlitchPass } = require('three/examples/jsm/postprocessing/GlitchPass.js');

const canvas = document.querySelector("#canvas");  //  キャンバス
var width = window.innerWidth;  //  キャンバス横幅
var height = window.innerHeight;  //  キャンバス縦幅
var onMouse = false;
var onClick = false;
var mouseX = 0; // 　マウス座標
var mouseY = 0;
var rotX = 0; //　 視点角度
var rotY = 0;
var frame = 0;  //  アニメーションフレーム

var wireframe = false;
var glitch = false;

//  マウス制御
document.addEventListener("mousemove", (event) => {
  onMouse = true;
  mouseX = event.clientX;
  mouseY = event.clientY;
});
canvas.addEventListener('mouseout', function () {
  onMouse = false;
}, false);
canvas.addEventListener('mousedown', function () {
  onClick = true;
  wireframe = wireframe ? false : true;
}, false);
canvas.addEventListener('mouseup', function () {
  onClick = false;
}, false);
/*
canvas.addEventListener('dblclick', function () {
  glitch = glitch ? false : true;
}, false);
*/

//  キャンバスサイズ制御
window.addEventListener("resize", function () {
  width = window.innerWidth;
  height = this.window.innerHeight;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
})

//  Renderer  ===========================================================
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
//  背景色
renderer.setClearColor(0xFFFFFF, 0);
//  シャドウマップ
renderer.shadowMap.enabled = true;

//  Scene  ==================================================================
const scene = new THREE.Scene();
//  Fog( color : Integer, near : Float, far : Float )
scene.fog = new THREE.Fog(0x000000, 100, 1000);

//  PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
const camera = new THREE.PerspectiveCamera(60, width / height);
camera.position.set(0, 0, +250);

//  Light  ======================================================================================

//  PointLight(色, 光の強さ, 距離, 光の減衰率)
const pointLight = new THREE.PointLight(0xffffff, 2.0, 1000, 0.5);
pointLight.position.set(0, 0, 0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
scene.add(pointLight);
//  明暗付けのpointLight
const additionalLight = new THREE.PointLight(0xffffff, 4.0, 600, 0.5);
additionalLight.position.set(0, 0, 500);
additionalLight.castShadow = false;
additionalLight.shadow.mapSize.width = 1024;
additionalLight.shadow.mapSize.height = 1024;
scene.add(additionalLight);
//const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
//scene.add(pointLightHelper);
//  ambientLight(色, 光の強さ)
var ambientLight = new THREE.AmbientLight(0x404040, 3.0); // soft white light
scene.add(ambientLight);

//  Text  =====================================================================================
//  domでタイトル書くか3Dで書くかどっちがいいと思う……？

const fontFile = require('three/examples/fonts/helvetiker_regular.typeface.json');

let font = new THREE.FontLoader().parse(fontFile);
var textGeometry = new THREE.TextGeometry('Confetti', {
  font: font,
  size: 28,
  height: 1,
  curveSegments: 12,
  bevelEnabled: false,
  bevelThickness: 0.1,
  bevelSize: 0,
  bevelOffset: 0,
  bevelSegments: 0
});
textGeometry.center();
var textMaterial = new THREE.MeshLambertMaterial({ color: 0xf7fcc2, flatShading: true });
var textMesh = new THREE.Mesh(textGeometry, textMaterial);
textMesh.position.y += 20;
textMesh.position.z -= 0;
textMesh.castShadow = true;
textMesh.receiveShadow = false;
scene.add(textMesh);


//  Mesh  =====================================================================================

//  床
const meshFloor = new THREE.Mesh(
  new THREE.BoxGeometry(5000, 5000, 0),
  new THREE.MeshStandardMaterial({ color: 0x22252e, roughness: 1.0 })
);
meshFloor.position.z = -250
meshFloor.receiveShadow = true;
scene.add(meshFloor);

//  紙吹雪
var groupA = new THREE.Group();
var groupB = new THREE.Group();
var groupC = new THREE.Group();
//  各種紙吹雪のマテリアル
var boardMaterialRed = new THREE.MeshLambertMaterial({ color: 0x6b0606, flatShading: true });
var boardMaterialBlue = new THREE.MeshLambertMaterial({ color: 0x3258a8, flatShading: true });
var boardMaterialYellow = new THREE.MeshLambertMaterial({ color: 0xc4bb4f, flatShading: true });
var boardMaterialGreen = new THREE.MeshLambertMaterial({ color: 0x6ad126, flatShading: true });
var boardMaterialOrange = new THREE.MeshLambertMaterial({ color: 0xe38827, flatShading: true });
//  サイズ
var boardGeometry = new THREE.BoxGeometry(8, 8, 0.2);
//  メッシュの生成
var boardMesh = [];
for (var i = 0; i < 200; i++) {
  //  メッシュを色ごとに生成
  switch (i % 5) {
    case 0:
      boardMesh[i] = new THREE.Mesh(boardGeometry, boardMaterialRed);
      break;
    case 1:
      boardMesh[i] = new THREE.Mesh(boardGeometry, boardMaterialBlue);
      break;
    case 2:
      boardMesh[i] = new THREE.Mesh(boardGeometry, boardMaterialYellow);
      break;
    case 3:
      boardMesh[i] = new THREE.Mesh(boardGeometry, boardMaterialGreen);
      break;
    case 4:
      boardMesh[i] = new THREE.Mesh(boardGeometry, boardMaterialOrange);
      break;
  }
  //  位置
  boardMesh[i].position.x = Math.random() * 600 - 300;
  boardMesh[i].position.y = Math.random() * 600 - 300;
  boardMesh[i].position.z = Math.random() * 600 - 300;
  //  サイズ
  boardMesh[i].scale.setScalar(Math.random() * 2 + 1);
  //  角度
  boardMesh[i].rotation.x = Math.random() * Math.PI;
  boardMesh[i].rotation.y = Math.random() * Math.PI;
  boardMesh[i].rotation.z = Math.random() * Math.PI;
  boardMesh[i].castShadow = true;
  boardMesh[i].receiveShadow = true;
  //  初期位置を保持
  boardMesh[i].defaultX = boardMesh[i].position.x;
  boardMesh[i].defaultZ = boardMesh[i].position.z;
  //  アニメーション速度を決めておく
  boardMesh[i].moveX = Math.random() * 1.0 - 0.5;
  boardMesh[i].moveY = Math.random() * 1.5 + 0.5;
  boardMesh[i].moveZ = Math.random() * 1.0 - 0.5;
  boardMesh[i].rotateX = Math.random() * 0.002;
  boardMesh[i].rotateY = Math.random() * 0.10;
  boardMesh[i].rotateZ = Math.random() * 0.002;
  //  グループに追加
  switch (i % 3) {
    case 0:
      groupA.add(boardMesh[i]);
      break;
    case 1:
      groupB.add(boardMesh[i]);
      break;
    case 2:
      groupC.add(boardMesh[i]);
      break;
  }
}
scene.add(groupA);
scene.add(groupB);
scene.add(groupC);

//  Effect  =============================================================================
//  エフェクトコンポーザー
var composer = new EffectComposer(renderer);
//  レンダーパス
var renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
//  グリッチパス
var glitchPass = new GlitchPass(4);
composer.addPass(glitchPass);

animate();

//  Animation  ======================================================================================
function animate() {

  //  マウス位置を滑らかに中央に戻す
  if (onMouse == false && mouseX != width / 2 && mouseY != height / 2) {
    mouseX = mouseX - (mouseX - width / 2) * 0.05;
    mouseY = mouseY - (mouseY - height / 2) * 0.05;
  }
  //  ライト位置を滑らかに中央に戻す
  if (onClick == false && pointLight.position.x != width / 2 && pointLight.position.y != height / 2) {
    pointLight.position.x = pointLight.position.x - (pointLight.position.x) * 0.01;
    pointLight.position.y = pointLight.position.y - (pointLight.position.y) * 0.01;
  }

  //  wireframe表示対応
  textMaterial.wireframe = wireframe ? true : false;
  boardMaterialRed.wireframe = wireframe ? true : false;
  boardMaterialBlue.wireframe = wireframe ? true : false;
  boardMaterialYellow.wireframe = wireframe ? true : false;
  boardMaterialGreen.wireframe = wireframe ? true : false;
  boardMaterialOrange.wireframe = wireframe ? true : false;

  //  meshのアニメーション
  for (let i = 0; i < 200; i++) {
    //  移動
    boardMesh[i].position.x -= boardMesh[i].moveX;
    boardMesh[i].position.y -= boardMesh[i].moveY;
    boardMesh[i].position.y -= boardMesh[i].moveZ;
    //  回転
    boardMesh[i].rotation.x += boardMesh[i].rotateX;
    boardMesh[i].rotation.y += boardMesh[i].rotateY;
    boardMesh[i].rotation.z += boardMesh[i].rotateZ;
    //  ポジションリセット
    if (boardMesh[i].position.y < -300) {
      boardMesh[i].position.x = boardMesh[i].defaultX;
      boardMesh[i].position.y = 300
      boardMesh[i].position.z = boardMesh[i].defaultZ;
    }
  }
  //  groupのアニメーション
  groupA.position.x = Math.sin(2 * Math.PI * frame / 360) * 50;
  groupB.position.x = -Math.sin(3 * Math.PI * frame / 360) * 20;
  groupB.rotation.y += 0.01;
  groupC.rotation.y += 0.01;

  // マウスの位置で角度を出す
  const targetRotX = - (mouseX - width / 2) / width * 30;
  const targetRotY = (mouseY - height / 2) / height * 30;
  // 動きを滑らかにする
  rotX += (targetRotX - rotX) * 0.02;
  rotY += (targetRotY - rotY) * 0.02;
  // ラジアンに変換する
  const radianX = rotX * Math.PI / 180;
  const radianY = rotY * Math.PI / 180;
  //  カメラ位置設定
  camera.rotation.y = radianX;
  camera.rotation.x = -radianY;
  //  ライト位置設定
  if (onClick == true) {
    pointLight.position.x = mouseX - width / 2;
    pointLight.position.y = -mouseY + height / 2;
  }
  //  glitch分岐
  if (glitch) {
    composer.render();
  }else{
    renderer.render(scene, camera);
  }

  //  アニメーション
  frame++
  requestAnimationFrame(animate);
}