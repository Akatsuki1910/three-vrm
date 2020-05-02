import * as THREE from 'three'
import {
	GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader'
import {
	VRM,
	VRMSchema
} from '@pixiv/three-vrm'
import {
	OrbitControls
} from "three/examples/jsm/controls/OrbitControls"

import {
	bonevpd
} from "./pose";
import {
	Vector3
} from 'three';
import {
	IK,
	IKChain,
	IKJoint,
	IKBallConstraint,
	IKHelper
} from 'three-ik';

const H_boneName = VRMSchema.HumanoidBoneName;
const H_bone = [
	["Chest", H_boneName.Chest],
	["Head", H_boneName.Head],
	["Hips", H_boneName.Hips],
	["Jaw", H_boneName.Jaw],
	["LeftEye", H_boneName.LeftEye],
	["LeftFoot", H_boneName.LeftFoot],
	["LeftHand", H_boneName.LeftHand],
	["LeftIndexDistal", H_boneName.LeftIndexDistal],
	["LeftIndexIntermediate", H_boneName.LeftIndexIntermediate],
	["LeftIndexProximal", H_boneName.LeftIndexProximal],
	["LeftLittleDistal", H_boneName.LeftLittleDistal],
	["LeftLittleIntermediate", H_boneName.LeftLittleIntermediate],
	["LeftLittleProximal", H_boneName.LeftLittleProximal],
	["LeftLowerArm", H_boneName.LeftLowerArm],
	["LeftLowerLeg", H_boneName.LeftLowerLeg],
	["LeftMiddleDistal", H_boneName.LeftMiddleDistal],
	["LeftMiddleIntermediate", H_boneName.LeftMiddleIntermediate],
	["LeftMiddleProximal", H_boneName.LeftMiddleProximal],
	["LeftRingDistal", H_boneName.LeftRingDistal],
	["LeftRingIntermediate", H_boneName.LeftRingIntermediate],
	["LeftRingProximal", H_boneName.LeftRingProximal],
	["LeftShoulder", H_boneName.LeftShoulder],
	["LeftThumbDistal", H_boneName.LeftThumbDistal],
	["LeftThumbIntermediate", H_boneName.LeftThumbIntermediate],
	["LeftThumbProximal", H_boneName.LeftThumbProximal],
	["LeftToes", H_boneName.LeftToes],
	["LeftUpperArm", H_boneName.LeftUpperArm],
	["LeftUpperLeg", H_boneName.LeftUpperLeg],
	["Neck", H_boneName.Neck],
	["RightEye", H_boneName.RightEye],
	["RightFoot", H_boneName.RightFoot],
	["RightHand", H_boneName.RightHand],
	["RightIndexDistal", H_boneName.RightIndexDistal],
	["RightIndexIntermediate", H_boneName.RightIndexIntermediate],
	["RightIndexProximal", H_boneName.RightIndexProximal],
	["RightLittleDistal", H_boneName.RightLittleDistal],
	["RightLittleIntermediate", H_boneName.RightLittleIntermediate],
	["RightLittleProximal", H_boneName.RightLittleProximal],
	["RightLowerArm", H_boneName.RightLowerArm],
	["RightLowerLeg", H_boneName.RightLowerLeg],
	["RightMiddleDistal", H_boneName.RightMiddleDistal],
	["RightMiddleIntermediate", H_boneName.RightMiddleIntermediate],
	["RightMiddleProximal", H_boneName.RightMiddleProximal],
	["RightRingDistal", H_boneName.RightRingDistal],
	["RightRingIntermediate", H_boneName.RightRingIntermediate],
	["RightRingProximal", H_boneName.RightRingProximal],
	["RightShoulder", H_boneName.RightShoulder],
	["RightThumbDistal", H_boneName.RightThumbDistal],
	["RightThumbIntermediate", H_boneName.RightThumbIntermediate],
	["RightThumbProximal", H_boneName.RightThumbProximal],
	["RightToes", H_boneName.RightToes],
	["RightUpperArm", H_boneName.RightUpperArm],
	["RightUpperLeg", H_boneName.RightUpperLeg],
	["Spine", H_boneName.Spine],
	["UpperChest", H_boneName.UpperChest],
]

const FingerNum = ["Proximal", "Intermediate", "Distal"];

function returnBoneH(vrm: any, boneSt: string) {
	let p = new RegExp(boneSt);
	for (let name of H_bone) {
		if (name[0].match(p)) {
			return vrm.humanoid!.getBoneNode(name[1]) !;
		}
	}
}

function returnBonePositionH(vrm: any, boneSt: string): Vector3 {
	const rBH = returnBoneH(vrm, boneSt).matrixWorld;
	return new THREE.Vector3(rBH.elements[12], rBH.elements[13], rBH.elements[14]);
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
	camera.position.set(0, cameraY, -2);

	const axes = new THREE.AxesHelper(1000);
	scene.add(axes);

	const renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x000000);
	document.body.appendChild(renderer.domElement);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target.y = cameraY;

	const light = new THREE.DirectionalLight(0xffffff);
	light.position.set(1, 1, 1).normalize();
	scene.add(light);

	let vrmupdate: any;

	const loader = new GLTFLoader();

	const a = 10;

	const movingTarget1 = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({
		color: 0xff0000
	}));
	const movingTarget2 = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({
		color: 0x00ff00
	}));
	const movingTarget3 = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({
		color: 0x0000ff
	}));

	const ik = new IK();
	const bones:any[] = [];
	const chain = new IKChain();
	const constraints = [new IKBallConstraint(270)];
	const movingTarget = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({
		color: 0xffffff
	}));
	movingTarget.position.x = -1;
	const pivot = new THREE.Object3D();
	pivot.add(movingTarget);
	scene.add(pivot);

	for (let i = 0; i < 3; i++) {
		const bone = new THREE.Bone();
		bone.position.z = i === 0 ? 1 : 1;

		if (bones[i - 1]) {
			bones[i - 1].add(bone);
		}
		bones.push(bone);

		const target = i === 2 ? movingTarget : null;
		chain.add(new IKJoint(bone, {	constraints}), {	target});
	}
	ik.add(chain);
	scene.add(ik.getRootBone());
	const helper = new IKHelper(ik);
	scene.add(helper);

	loader.load(
		'./models/akatsuki1910.vrm',

		(gltf) => {
			VRM.from(gltf).then((vrm) => {
				scene.add(vrm.scene);
				// vrm.scene.rotation.y = Math.PI;
				vrmupdate = vrm;

				// bonevpd(vrm,VRMSchema);

				// movingTarget1.position.set(returnBonePositionH(vrm, "LeftUpperLeg").x, returnBonePositionH(vrm, "LeftUpperLeg").y, returnBonePositionH(vrm, "LeftUpperLeg").z);
				// scene.add(movingTarget1);
				// movingTarget2.position.set(returnBonePositionH(vrm, "LeftLowerLeg").x, returnBonePositionH(vrm, "LeftLowerLeg").y, returnBonePositionH(vrm, "LeftLowerLeg").z);
				// scene.add(movingTarget2);
				// movingTarget3.position.set(returnBonePositionH(vrm, "LeftFoot").x, returnBonePositionH(vrm, "LeftFoot").y, returnBonePositionH(vrm, "LeftFoot").z);
				// scene.add(movingTarget3);
				bones[0].position.y = 1;
				movingTarget.position.set(returnBonePositionH(vrm, "LeftFoot").x, returnBonePositionH(vrm, "LeftFoot").y, returnBonePositionH(vrm, "LeftFoot").z);

				// scene.traverse(function(obj) {
				// console.log(obj.name)
				// if(obj.name == "J_Bip_L_UpperLeg"){
				// console.log(obj)
				// }
				// });
				// returnBone(vrm,"LeftFoot").position.x-=1.150000/a;
				// returnBone(vrm,"LeftFoot").position.y+=7.185793/a;
				// returnBone(vrm,"LeftFoot").position.z+=0.574168/a;
				// returnBone(vrm,"LeftFoot").rotation.x=-0.844162-Math.PI/2;
				// returnBone(vrm,"LeftLowerLeg").rotation.x-=20.150000/a;
				// returnBone(vrm,"LeftUpperLeg").rotation.x+=10.150000/a;
				// LeftLowerLeg
				// LeftUpperLeg
				// LeftToes
				// LeftFoot


			})
		},
		(progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
		(error) => console.error(error)
	)

	const update = () => {
		requestAnimationFrame(update);
		// movingTarget3.position.z +=0.01;
		ik.solve();
		controls.update();
		renderer.render(scene, camera);
	};
	update();
})