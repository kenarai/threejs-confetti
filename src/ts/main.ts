
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

var width = window.innerWidth;  //  キャンバス横幅
var height = window.innerHeight;  //  キャンバス縦幅
var mouseX = 0; // 　マウス座標
var mouseY = 0;
var rotX = 0; //　 角度
var rotY = 0;
var frame = 0;  //  アニメーションフレーム
document.addEventListener("mousemove", (event) => {  //  マウス座標取得
  mouseX = event.pageX;
  mouseY = event.pageY;
});

//  レンダラーを作成
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.setClearColor(0x202025, 1.0);

//  シーンを作成
const scene = new THREE.Scene();

//  カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height);
camera.position.set(0, 0, +1000);

//  オブジェクトを作成
const dense = 50;
for (var i = 0; i < dense; i++) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(-1500, -height + height * i * 2 / dense, 0),
    new THREE.Vector3(1500, -height + height * i * 2 / dense, 0)
  );
  var material = new THREE.LineBasicMaterial({
    color: 0xffffff
  });

  var line = new THREE.Line(geometry, material);
  scene.add(line);
}
// 床
/*
const meshFloor = new THREE.Mesh(
  new THREE.BoxGeometry(3000, 3000, 0),
  new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 1.0 })
);
scene.add(meshFloor);
*/
// new THREE.PointLight(色, 光の強さ, 距離, 光の減衰率)
const pointLight = new THREE.PointLight(0xFFFFFF, 1, 1500, 1.0);
pointLight.position.set(0, 0, 1000);
scene.add(pointLight);

//  エフェクトコンポーザー
var composer = new EffectComposer(renderer);
//  レンダーパス
var renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
//  グリッチパス
var glitchPass = new GlitchPass(4);
composer.addPass(glitchPass);

animate();

//  ループイベント
function animate() {

  //  マウスでライト位置制御
  pointLight.position.set(mouseX - width / 2, -mouseY + height / 2, 1000);

  // マウスの位置で角度を出す
  const targetRotX = - (mouseX - width / 2) / width * 30;
  const targetRotY = (mouseY - height / 2) / height * 30;
  // イージングの公式を用いて滑らかにする
  // 値 += (目標値 - 現在の値) * 減速値
  rotX += (targetRotX - rotX) * 0.02;
  rotY += (targetRotY - rotY) * 0.02;

  // ラジアンに変換する
  const radianX = rotX * Math.PI / 180;
  const radianY = rotY * Math.PI / 180;

  // 角度に応じてカメラの位置を設定
  camera.position.x = 1000 * Math.sin(radianX);
  camera.position.z = 1000 * Math.cos(radianX) * Math.cos(radianY);
  camera.position.y = 1000 * Math.sin(radianY);
  // 原点方向を見つめる
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  //  レンダリング
  composer.render();

  frame++
  if (frame == 10000) frame = 0;
  requestAnimationFrame(animate);
}