import * as THREE from 'three'
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader'
import {
    VRM,
    VRMSchema
} from '@pixiv/three-vrm'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

window.addEventListener("DOMContentLoaded", () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0.6, 2);

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.y=0.6;

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    let vrmupdate:any;

    const loader = new GLTFLoader();
    loader.load(
        './models/test.vrm',

        (gltf) => {
            VRM.from(gltf).then((vrm) => {
                scene.add(vrm.scene);
                vrm.scene.rotation.y = Math.PI;
                vrmupdate = vrm;
                vrm.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm) !.rotation.x = 0.6;
                vrm.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.LeftLowerArm) !.rotation.x = 0.8;
                vrm.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.LeftHand) !.rotation.y = -0.5;
                vrm.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm) !.rotation.z = -1.3;
            })
        }
    )

    let leftArmShake = 0;
    const update = () => {
        requestAnimationFrame(update);
        vrmupdate.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.LeftLowerArm) !.rotation.y = -(Math.sin(leftArmShake * 0.1) + 3)/4;
        vrmupdate.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.Hips) !.rotation.y -=0.01;
        leftArmShake++;
        controls.update();
        renderer.render(scene, camera);
    };
    update();
})