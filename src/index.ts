import * as THREE from 'three'
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader'
import {
    VRM,
    VRMSchema
} from '@pixiv/three-vrm'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import {bonevpd} from "./pose";

function returnBone(vrm:any,boneSt:String){
    let bone;
    switch(boneSt){
        case "Chest": bone = VRMSchema.HumanoidBoneName.Chest; break;
        case "Head": bone = VRMSchema.HumanoidBoneName.Head; break;
        case "Hips": bone = VRMSchema.HumanoidBoneName.Hips; break;
        case "Jaw": bone = VRMSchema.HumanoidBoneName.Jaw; break;
        case "LeftEye": bone = VRMSchema.HumanoidBoneName.LeftEye; break;
        case "LeftFoot": bone = VRMSchema.HumanoidBoneName.LeftFoot; break;
        case "LeftHand": bone = VRMSchema.HumanoidBoneName.LeftHand; break;
        case "LeftIndexDistal": bone = VRMSchema.HumanoidBoneName.LeftIndexDistal; break;
        case "LeftIndexIntermediate": bone = VRMSchema.HumanoidBoneName.LeftIndexIntermediate; break;
        case "LeftIndexProximal": bone = VRMSchema.HumanoidBoneName.LeftIndexProximal; break;
        case "LeftLittleDistal": bone = VRMSchema.HumanoidBoneName.LeftLittleDistal; break;
        case "LeftLittleIntermediate": bone = VRMSchema.HumanoidBoneName.LeftLittleIntermediate; break;
        case "LeftLittleProximal": bone = VRMSchema.HumanoidBoneName.LeftLittleProximal; break;
        case "LeftLowerArm": bone = VRMSchema.HumanoidBoneName.LeftLowerArm; break;
        case "LeftLowerLeg": bone = VRMSchema.HumanoidBoneName.LeftLowerLeg; break;
        case "LeftMiddleDistal": bone = VRMSchema.HumanoidBoneName.LeftMiddleDistal; break;
        case "LeftMiddleIntermediate": bone = VRMSchema.HumanoidBoneName.LeftMiddleIntermediate; break;
        case "LeftMiddleProximal": bone = VRMSchema.HumanoidBoneName.LeftMiddleProximal; break;
        case "LeftRingDistal": bone = VRMSchema.HumanoidBoneName.LeftRingDistal; break;
        case "LeftRingIntermediate": bone = VRMSchema.HumanoidBoneName.LeftRingIntermediate; break;
        case "LeftRingProximal": bone = VRMSchema.HumanoidBoneName.LeftRingProximal; break;
        case "LeftShoulder": bone = VRMSchema.HumanoidBoneName.LeftShoulder; break;
        case "LeftThumbDistal": bone = VRMSchema.HumanoidBoneName.LeftThumbDistal; break;
        case "LeftThumbIntermediate": bone = VRMSchema.HumanoidBoneName.LeftThumbIntermediate; break;
        case "LeftThumbProximal": bone = VRMSchema.HumanoidBoneName.LeftThumbProximal; break;
        case "LeftToes": bone = VRMSchema.HumanoidBoneName.LeftToes; break;
        case "LeftUpperArm": bone = VRMSchema.HumanoidBoneName.LeftUpperArm; break;
        case "LeftUpperLeg": bone = VRMSchema.HumanoidBoneName.LeftUpperLeg; break;
        case "Neck": bone = VRMSchema.HumanoidBoneName.Neck; break;
        case "RightEye": bone = VRMSchema.HumanoidBoneName.RightEye; break;
        case "RightFoot": bone = VRMSchema.HumanoidBoneName.RightFoot; break;
        case "RightHand": bone = VRMSchema.HumanoidBoneName.RightHand; break;
        case "RightIndexDistal": bone = VRMSchema.HumanoidBoneName.RightIndexDistal; break;
        case "RightIndexIntermediate": bone = VRMSchema.HumanoidBoneName.RightIndexIntermediate; break;
        case "RightIndexProximal": bone = VRMSchema.HumanoidBoneName.RightIndexProximal; break;
        case "RightLittleDistal": bone = VRMSchema.HumanoidBoneName.RightLittleDistal; break;
        case "RightLittleIntermediate": bone = VRMSchema.HumanoidBoneName.RightLittleIntermediate; break;
        case "RightLittleProximal": bone = VRMSchema.HumanoidBoneName.RightLittleProximal; break;
        case "RightLowerArm": bone = VRMSchema.HumanoidBoneName.RightLowerArm; break;
        case "RightLowerLeg": bone = VRMSchema.HumanoidBoneName.RightLowerLeg; break;
        case "RightMiddleDistal": bone = VRMSchema.HumanoidBoneName.RightMiddleDistal; break;
        case "RightMiddleIntermediate": bone = VRMSchema.HumanoidBoneName.RightMiddleIntermediate; break;
        case "RightMiddleProximal": bone = VRMSchema.HumanoidBoneName.RightMiddleProximal; break;
        case "RightRingDistal": bone = VRMSchema.HumanoidBoneName.RightRingDistal; break;
        case "RightRingIntermediate": bone = VRMSchema.HumanoidBoneName.RightRingIntermediate; break;
        case "RightRingProximal": bone = VRMSchema.HumanoidBoneName.RightRingProximal; break;
        case "RightShoulder": bone = VRMSchema.HumanoidBoneName.RightShoulder; break;
        case "RightThumbDistal": bone = VRMSchema.HumanoidBoneName.RightThumbDistal; break;
        case "RightThumbIntermediate": bone = VRMSchema.HumanoidBoneName.RightThumbIntermediate; break;
        case "RightThumbProximal": bone = VRMSchema.HumanoidBoneName.RightThumbProximal; break;
        case "RightToes": bone = VRMSchema.HumanoidBoneName.RightToes; break;
        case "RightUpperArm": bone = VRMSchema.HumanoidBoneName.RightUpperArm; break;
        case "RightUpperLeg": bone = VRMSchema.HumanoidBoneName.RightUpperLeg; break;
        case "Spine": bone = VRMSchema.HumanoidBoneName.Spine; break;
        case "UpperChest": bone = VRMSchema.HumanoidBoneName.UpperChest; break;
    }
    return vrm.humanoid!.getBoneNode(bone) !;
}

window.addEventListener("DOMContentLoaded", () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    const cameraY = 0.8;
    camera.position.set(0, cameraY, 2);

    const axes = new THREE.AxesHelper(1000);
    scene.add(axes);

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.y=cameraY;

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    let vrmupdate:any;

    const loader = new GLTFLoader();

    const a = 10;

    loader.load(
        './models/Lefm.vrm',

        (gltf) => {
            VRM.from(gltf).then((vrm) => {
                scene.add(vrm.scene);
                vrm.scene.rotation.y = Math.PI;
                vrmupdate = vrm;

                // bonevpd(vrm,VRMSchema);

                console.log(returnBone(vrm,"LeftFoot").position);
                returnBone(vrm,"LeftFoot").position.x-=1.150000/a;
                returnBone(vrm,"LeftFoot").position.y+=7.185793/a;
                returnBone(vrm,"LeftFoot").position.z+=0.574168/a;
                returnBone(vrm,"LeftFoot").rotation.x=-0.844162-Math.PI/2;
                console.log(returnBone(vrm,"LeftFoot").position);

            })
        }
    )

    const update = () => {
        requestAnimationFrame(update);
        controls.update();
        renderer.render(scene, camera);
    };
    update();
})