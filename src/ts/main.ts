
import "../scss/main.scss";
import "../scss/canvas.scss";

//  ====================================  Elm  ===========================================================

import { Elm } from '../Elm/Main.elm';
const mountNode = document.getElementById("elm");
var app = Elm.Elm.Main.init({ node: mountNode }); //  ここずっとElm.Main.initだと思ってて三日くらい溶かした

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
var rotX = 0; //　 角度
var rotY = 0;
var frame = 0;  //  アニメーションフレーム

document.addEventListener("mousemove", (event) => {  //  マウス座標取得
  onMouse = true;
  mouseX = event.pageX;
  mouseY = event.pageY;
});
canvas.addEventListener('mouseout', function () {
  onMouse = false;
}, false);
canvas.addEventListener('mousedown', function () {
  onClick = true;
}, false);
canvas.addEventListener('mouseup', function () {
  onClick = false;
}, false);

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

//  Mesh  ====================================================================
//  mesh生成
var groupA = new THREE.Group();
var groupB = new THREE.Group();
var groupC = new THREE.Group();
var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, flatShading: true });
var geometry = new THREE.BoxGeometry(8, 8, 0.2);
var mesh = [];
for (var i = 0; i < 200; i++) {
  mesh[i] = new THREE.Mesh(geometry, material);
  //  位置
  mesh[i].position.x = Math.random() * 600 - 300;
  mesh[i].position.y = Math.random() * 600 - 300;
  mesh[i].position.z = Math.random() * 600 - 300;
  //  サイズ
  mesh[i].scale.setScalar(Math.random() * 2 + 1);
  //  角度
  mesh[i].rotation.x = Math.random() * Math.PI;
  mesh[i].rotation.y = Math.random() * Math.PI;
  mesh[i].rotation.z = Math.random() * Math.PI;
  mesh[i].castShadow = true;
  mesh[i].receiveShadow = true;
  //  初期位置を保持
  mesh[i].defaultX = mesh[i].position.x;
  mesh[i].defaultZ = mesh[i].position.z;
  //  アニメーション速度を決めておく
  mesh[i].moveX = Math.random() * 1.0 - 0.5;
  mesh[i].moveY = Math.random() * 1.5 + 0.5;
  mesh[i].moveZ = Math.random() * 1.0 - 0.5;
  mesh[i].rotateX = Math.random() * 0.002;
  mesh[i].rotateY = Math.random() * 0.10;
  mesh[i].rotateZ = Math.random() * 0.002;
  //  グループに追加
  switch (i % 3) {
    case 0:
      groupA.add(mesh[i]);
      break;
    case 1:
      groupB.add(mesh[i]);
      break;
    case 2:
      groupC.add(mesh[i]);
      break;
  }
}
scene.add(groupA);
scene.add(groupB);
scene.add(groupC);

//  床
const meshFloor = new THREE.Mesh(
  new THREE.BoxGeometry(5000, 5000, 0),
  new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 1.0 })
);
meshFloor.position.z = -250
meshFloor.receiveShadow = true;
scene.add(meshFloor);

//  Light  ======================================================================================
//  PointLight(色, 光の強さ, 距離, 光の減衰率)
const pointLight = new THREE.PointLight(0xa3daff, 1.5, 1000, 0.5);
pointLight.position.set(0, 0, 0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
scene.add(pointLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
scene.add(pointLightHelper);
//  ambientLight(色, 光の強さ)
var ambientLight = new THREE.AmbientLight(0x404040, 3.0); // soft white light
scene.add(ambientLight);

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

  //  meshのアニメーション
  for (let i = 0; i < 200; i++) {
    //  移動
    mesh[i].position.x -= mesh[i].moveX;
    mesh[i].position.y -= mesh[i].moveY;
    mesh[i].position.y -= mesh[i].moveZ;
    //  回転
    mesh[i].rotation.x += mesh[i].rotateX;
    mesh[i].rotation.y += mesh[i].rotateY;
    mesh[i].rotation.z += mesh[i].rotateZ;
    //  使いまわし
    if (mesh[i].position.y < -300) {
      mesh[i].position.x = mesh[i].defaultX;
      mesh[i].position.y = 300
      mesh[i].position.z = mesh[i].defaultZ;
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

  //  レンダリング
  composer.render();
  //  アニメーション
  frame++
  requestAnimationFrame(animate);
}