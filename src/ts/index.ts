import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { VRM } from '@pixiv/three-vrm'
import models from 'url:./models/three-vrm-girl.vrm'

window.addEventListener('DOMContentLoaded', () => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 2, -5)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)

  const light = new THREE.DirectionalLight(0xffffff)
  light.position.set(1, 1, 1).normalize()
  scene.add(light)

  const axes = new THREE.AxesHelper(1000)
  scene.add(axes)
  const gridHelper = new THREE.GridHelper(1000, 1000)
  scene.add(gridHelper)

  let vrmupdate: VRM

  const loader = new GLTFLoader()

  loader.load(models, (gltf) => {
    VRM.from(gltf).then((vrm) => {
      scene.add(vrm.scene)
      vrmupdate = vrm
      update()
    })
  })

  const update = () => {
    requestAnimationFrame(update)
    controls.update()
    renderer.render(scene, camera)
  }
})
