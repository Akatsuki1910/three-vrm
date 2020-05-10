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

	const a = 15;

	const movingTarget1 = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({
		color: 0xff0000
	}));
	const movingTarget2 = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({
		color: 0x00ff00
	}));
	const movingTarget3 = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({
		color: 0x0000ff
	}));

	let movingTarget:any;
	const ik = new IK();
	const bones:any[] = [];

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
				const chain = new IKChain();
				movingTarget = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({color: 0xffffff,transparent: true,opacity: 0.5}));
				movingTarget.position.set(returnBonePositionH(vrm, "LeftFoot").x, returnBonePositionH(vrm, "LeftFoot").y, returnBonePositionH(vrm, "LeftFoot").z);
				scene.add(movingTarget);
				const boneN:string[] = ["LeftUpperLeg","LeftLowerLeg","LeftFoot"];
				for (let i = 0; i < 3; i++) {
					const bone = new THREE.Bone();
					const boneName = boneN[i];
					if(i==0){
						bone.position.set(returnBonePositionH(vrm, boneName).x, returnBonePositionH(vrm, boneName).y, returnBonePositionH(vrm, boneName).z);
					}else{
						bone.position.set(returnBoneH(vrm, boneName).position.x, returnBoneH(vrm, boneName).position.y, returnBoneH(vrm, boneName).position.z);
					}
					if (bones[i - 1]) {bones[i - 1].add(bone);}
					bones.push(bone);
					const target = i === 2 ? movingTarget : null;
					let constraints = (i==0)?[new IKBallConstraint(270)]:[new IKBallConstraint(90)];
					chain.add(new IKJoint(bone, {constraints}), {target});
				}
				ik.add(chain);
				scene.add(ik.getRootBone());
				const helper = new IKHelper(ik);
				scene.add(helper);
				// ik.add(chain);
				ik.solve();

				// 手を上げさせてみる
                returnBoneH(vrmupdate, "LeftUpperArm").rotation.x = 0.6;
				returnBoneH(vrmupdate, "LeftLowerArm").rotation.x = 0.8;
				returnBoneH(vrmupdate, "LeftLowerArm").rotation.y = -1.;
				returnBoneH(vrmupdate, "LeftHand").rotation.y = -0.5;
				returnBoneH(vrmupdate, "RightUpperArm").rotation.z = -1.3;

				var px = bones[0].rotation.x;
				var py = bones[0].rotation.y;
				var pz = bones[0].rotation.z;
				// movingTarget.position.x+=10;
				renderer.render(scene, camera);
				ik.add(chain);
				ik.solve();
				renderer.render(scene, camera);
				console.log(bones[0].quaternion)
				console.log(bones[0].rotation)
				returnBoneH(vrm,"LeftUpperLeg").rotation.set(bones[0].rotation.z-pz,bones[0].rotation.y-py,bones[0].rotation.x-px);
				// scene.traverse(function(obj) {
				// 	console.log(obj.name)
				// 	if(obj.name == "J_Bip_L_UpperLeg"){
				// 		console.log(obj)
				// 	}
				// });
				// movingTarget.position.x+=-1.150000/a;
				// movingTarget.position.y+=7.185793/a;
				// movingTarget.position.z+=0.574168/a;
				// returnBoneH(vrm,"LeftFoot").rotation.x=-0.844162-Math.PI/2;
				// returnBoneH(vrm,"LeftLowerLeg").rotation.x-=20.150000/a;
				// returnBoneH(vrm,"LeftUpperLeg").rotation.x+=10.150000/a;
				// LeftLowerLeg
				// LeftUpperLeg
				// LeftToes
				// LeftFoot

				update();
			})
		},
		(progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
		(error) => console.error(error)
	)

	var theta = 0.00;
	var t = 0;

	const update = () => {
		requestAnimationFrame(update);
		var px = bones[0].rotation.x;
		var py = bones[0].rotation.y;
		var pz = bones[0].rotation.z;
		var ppx = bones[1].rotation.x;
		var ppy = bones[1].rotation.y;
		var ppz = bones[1].rotation.z;
		if( t % 10 == 0 ) {
			console.log( bones[0] );
			console.log("X0:" + px + "Y0:" + py + "Z0:" + pz);
			console.log("X1:" +ppx + "Y1:" +ppy + "Z1:" +ppz);
		}
		movingTarget.position.x = bones[0].position.x;
		// movingTarget.position.y = bones[0].position.y-2;
		// movingTarget.position.z = bones[0].position.z;
		// movingTarget.position.x = Math.sin(theta*7);
		movingTarget.position.y = 0.5 + Math.sin(theta*7)/2;
		movingTarget.position.z = Math.sin(theta*2)*0.6;
		ik.solve();

		// returnBoneH(vrmupdate,"LeftUpperLeg").rotation.x = Math.PI/3;
		// returnBoneH(vrmupdate,"LeftUpperLeg").rotation.z = Math.PI/3;
		// offset( -90',0,0 )
		// legBone.X == IKBone.X
		// legBone.Y == IKBone.Z
		// legBone.Z == IKBone.Y
		returnBoneH(vrmupdate,"LeftUpperLeg").rotation.x = bones[0].rotation.x - Math.PI/2;
		// returnBoneH(vrmupdate,"LeftUpperLeg").rotation.y = bones[0].rotation.z;
		returnBoneH(vrmupdate,"LeftUpperLeg").rotation.z = bones[0].rotation.y;
		returnBoneH(vrmupdate,"LeftLowerLeg").rotation.x = -bones[1].rotation.x;
		// returnBoneH(vrmupdate,"LeftUpperLeg").rotation.y = bones[0].rotation.z;
		// returnBoneH(vrmupdate,"LeftLowerLeg").rotation.z = bones[1].rotation.y;

		controls.update();
		renderer.render(scene, camera);

		theta += 0.004;
		t++;

	};
})
