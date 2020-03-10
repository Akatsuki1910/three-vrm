import * as THREE from 'three'
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader'
import {
    VRM,
    VRMSchema
} from '@pixiv/three-vrm'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

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

function TransRoteChange(a:number){
    if(Math.abs(a)<=0.0001){
        return 0.000000;
    }else{
        return a/Math.sqrt(2*a);
    }
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

    const a = 200;

    loader.load(
        './models/test.vrm',

        (gltf) => {
            VRM.from(gltf).then((vrm) => {
                scene.add(vrm.scene);
                vrm.scene.rotation.y = Math.PI;
                vrmupdate = vrm;
                // //左足IK
                // returnBone(vrm,"LeftLowerLeg").position.x+=1.150000/a;
                // // returnBone(vrm,"LeftLowerLeg").position.y+=7.1/a;
                // returnBone(vrm,"LeftLowerLeg").position.z+=0.574168/a;
                // returnBone(vrm,"LeftLowerLeg").rotation.x=-(0.844162+TransRoteChange(7.185793/10));
                // //左足
                // returnBone(vrm,"LeftUpperLeg").rotation.x=0.024375;
                // returnBone(vrm,"LeftUpperLeg").rotation.y=-0.114538;
                // returnBone(vrm,"LeftUpperLeg").rotation.z=0.120492;
                //上半身
                returnBone(vrm,"Chest").rotation.x=-0.154380;
                //上半身2
                returnBone(vrm,"Spine").rotation.x=-0.212484;
                returnBone(vrm,"Spine").rotation.y=-0.019175;
                returnBone(vrm,"Spine").rotation.z=0.087809;
                //右肩
                returnBone(vrm,"RightShoulder").rotation.x=0.072897;
                returnBone(vrm,"RightShoulder").rotation.y=-0.061144;
                returnBone(vrm,"RightShoulder").rotation.z=-0.452654+Math.PI/2;
                //右腕
                returnBone(vrm,"RightUpperArm").rotation.x=-0.000591;
                returnBone(vrm,"RightUpperArm").rotation.y=-0.000405;
                returnBone(vrm,"RightUpperArm").rotation.z=0.434965;
                //右手捩
                returnBone(vrm,"RightHand").rotation.x=-0.488669+Math.PI/2;
                returnBone(vrm,"RightHand").rotation.y=-0.350198;
                returnBone(vrm,"RightHand").rotation.z=0.001780;

                //左肩
                returnBone(vrm,"LeftShoulder").rotation.x=0.093042;
                returnBone(vrm,"LeftShoulder").rotation.y=-0.170585;
                returnBone(vrm,"LeftShoulder").rotation.z=0.036446;
                // //左腕
                returnBone(vrm,"LeftUpperArm").rotation.x=-0.200913;
                returnBone(vrm,"LeftUpperArm").rotation.y=-0.152795+Math.PI/4;
                returnBone(vrm,"LeftUpperArm").rotation.z=-0.248597+Math.PI/2;
                // //左ひじ
                returnBone(vrm,"LeftLowerArm").rotation.x=0.697229;
                returnBone(vrm,"LeftLowerArm").rotation.y=0.642157-Math.PI;
                returnBone(vrm,"LeftLowerArm").rotation.z=0.049018;
                // //左手捩
                returnBone(vrm,"LeftHand").rotation.x=0.232429;
                returnBone(vrm,"LeftHand").rotation.y=-0.166567;
                returnBone(vrm,"LeftHand").rotation.z=0.000847;
                //首
                returnBone(vrm,"Neck").rotation.z=0.010000;
                //頭
                returnBone(vrm,"Head").rotation.x=0.089717;
                returnBone(vrm,"Head").rotation.y=-0.005389;
                returnBone(vrm,"Head").rotation.z=0.059721;

                //右親指1
                returnBone(vrm,"RightThumbIntermediate").rotation.x=0.118556;
                returnBone(vrm,"RightThumbIntermediate").rotation.y=-0.120695-Math.PI/4;
                //右親指2
                returnBone(vrm,"RightThumbDistal").rotation.x=0.077010;
                returnBone(vrm,"RightThumbDistal").rotation.y=0.091654-Math.PI/4;
                //右小指1
                returnBone(vrm,"RightLittleProximal").rotation.x=-0.118397;
                returnBone(vrm,"RightLittleProximal").rotation.y=-0.067940;
                returnBone(vrm,"RightLittleProximal").rotation.z=-0.706264-Math.PI/8;
                //右小指2
                returnBone(vrm,"RightLittleIntermediate").rotation.y=-0.000001;
                returnBone(vrm,"RightLittleIntermediate").rotation.z=-0.593177-Math.PI/4;
                //右小指3
                returnBone(vrm,"RightLittleDistal").rotation.x=-0.000001;
                returnBone(vrm,"RightLittleDistal").rotation.z=-0.518418-Math.PI/8;
                //右薬指1
                returnBone(vrm,"RightRingProximal").rotation.x=-0.065159;
                returnBone(vrm,"RightRingProximal").rotation.y=-0.048479;
                returnBone(vrm,"RightRingProximal").rotation.z=-0.648399-Math.PI/8;
                //右薬指2
                returnBone(vrm,"RightRingIntermediate").rotation.y=-0.000001;
                returnBone(vrm,"RightRingIntermediate").rotation.z=-0.597195-Math.PI/4;
                //右薬指3
                returnBone(vrm,"RightRingDistal").rotation.x=-0.000001;
                returnBone(vrm,"RightRingDistal").rotation.z=-0.593177-Math.PI/8;
                //右中指1
                returnBone(vrm,"RightMiddleProximal").rotation.y=-0.000001;
                returnBone(vrm,"RightMiddleProximal").rotation.z=-0.539632-Math.PI/8;
                //右中指2
                returnBone(vrm,"RightMiddleIntermediate").rotation.y=-0.000001;
                returnBone(vrm,"RightMiddleIntermediate").rotation.z=-0.744643-Math.PI/4;
                //右中指3
                returnBone(vrm,"RightMiddleDistal").rotation.x=-0.000001;
                returnBone(vrm,"RightMiddleDistal").rotation.z=-0.539631-Math.PI/8;
                //右人差指1
                returnBone(vrm,"RightIndexProximal").rotation.x=0.037964;
                returnBone(vrm,"RightIndexProximal").rotation.y=0.052706;
                returnBone(vrm,"RightIndexProximal").rotation.z=-0.313901-Math.PI/8;
                //右人差指2
                returnBone(vrm,"RightIndexIntermediate").rotation.x=-0.000002;
                returnBone(vrm,"RightIndexIntermediate").rotation.y=-0.000001;
                returnBone(vrm,"RightIndexIntermediate").rotation.z=-0.867422-Math.PI/8;
                //右人差指3
                returnBone(vrm,"RightIndexDistal").rotation.y=0.000001;
                returnBone(vrm,"RightIndexDistal").rotation.z=-0.457338-Math.PI/4;

                //左親指1
                returnBone(vrm,"LeftThumbIntermediate").rotation.x=-0.118556;
                returnBone(vrm,"LeftThumbIntermediate").rotation.y=-0.120695+Math.PI/4;
                //右親指2
                returnBone(vrm,"LeftThumbDistal").rotation.x=-0.077010;
                returnBone(vrm,"LeftThumbDistal").rotation.y=-0.091654+Math.PI/4;
                //右小指1
                returnBone(vrm,"LeftLittleProximal").rotation.x=-0.118397;
                returnBone(vrm,"LeftLittleProximal").rotation.y=0.067940;
                returnBone(vrm,"LeftLittleProximal").rotation.z=0.706264+Math.PI/8;
                //右小指2
                returnBone(vrm,"LeftLittleIntermediate").rotation.y=0.000001;
                returnBone(vrm,"LeftLittleIntermediate").rotation.z=0.593177+Math.PI/4;
                //右小指3
                returnBone(vrm,"LeftLittleDistal").rotation.x=0.000001;
                returnBone(vrm,"LeftLittleDistal").rotation.z=0.518418+Math.PI/8;
                //右薬指1
                returnBone(vrm,"LeftRingProximal").rotation.x=0.065159;
                returnBone(vrm,"LeftRingProximal").rotation.y=0.048479;
                returnBone(vrm,"LeftRingProximal").rotation.z=0.648399+Math.PI/8;
                //右薬指2
                returnBone(vrm,"LeftRingIntermediate").rotation.y=0.000001;
                returnBone(vrm,"LeftRingIntermediate").rotation.z=0.597195+Math.PI/4;
                //右薬指3
                returnBone(vrm,"LeftRingDistal").rotation.x=-0.000001;
                returnBone(vrm,"LeftRingDistal").rotation.z=0.593177+Math.PI/8;
                //右中指1
                returnBone(vrm,"LeftMiddleProximal").rotation.y=0.000001;
                returnBone(vrm,"LeftMiddleProximal").rotation.z=0.539632+Math.PI/8;
                //右中指2
                returnBone(vrm,"LeftMiddleIntermediate").rotation.y=0.000001;
                returnBone(vrm,"LeftMiddleIntermediate").rotation.z=0.744643+Math.PI/4;
                //右中指3
                returnBone(vrm,"LeftMiddleDistal").rotation.x=0.000001;
                returnBone(vrm,"LeftMiddleDistal").rotation.z=0.539631+Math.PI/8;
                //右人差指1
                returnBone(vrm,"LeftIndexProximal").rotation.x=0.037964;
                returnBone(vrm,"LeftIndexProximal").rotation.y=-0.052706;
                returnBone(vrm,"LeftIndexProximal").rotation.z=0.313901+Math.PI/8;
                //右人差指2
                returnBone(vrm,"LeftIndexIntermediate").rotation.x=-0.000002;
                returnBone(vrm,"LeftIndexIntermediate").rotation.y=0.000001;
                returnBone(vrm,"LeftIndexIntermediate").rotation.z=0.867422+Math.PI/8;
                //右人差指3
                returnBone(vrm,"LeftIndexDistal").rotation.y=-0.000001;
                returnBone(vrm,"LeftIndexDistal").rotation.z=0.457338+Math.PI/4;

                vrm.humanoid!.setPose(
                    {[VRMSchema.HumanoidBoneName.LeftLowerLeg] : {
                        rotation: [  -0.844162,0.000000,0.000000,0.536089 ],
                        position: [  1.150000/a,7.185793/a,0.574168/a ]
                    }}
                );
            })
        }
    )

    const update = () => {
        requestAnimationFrame(update);
        // returnBone(vrmupdate,"RightThumbDistal").rotation.y-=0.01;
        let x = returnBone(vrmupdate,"LeftUpperLeg").position.x-returnBone(vrmupdate,"LeftLowerLeg").position.x;
        let y = returnBone(vrmupdate,"LeftUpperLeg").position.y-returnBone(vrmupdate,"LeftLowerLeg").position.y;
        let z = returnBone(vrmupdate,"LeftUpperLeg").position.z-returnBone(vrmupdate,"LeftLowerLeg").position.z;
        controls.update();
        renderer.render(scene, camera);
    };
    update();
})