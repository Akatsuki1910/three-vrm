import * as THREE from 'three'
import {
	GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader'
import {
	VRM,
	VRMSchema
} from '@pixiv/three-vrm'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { DeviceOrientationControls } from "three/examples/jsm/controls/DeviceOrientationControls"
import Stats from 'stats.js';
import * as nipplejs from 'nipplejs'
import * as PIXI from 'pixi.js'

// import {bonevpd} from "./pose";

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

const ua:string[] = [
	"iPod",
	"iPad",
	"iPhone"
];

function success() {
	(document.getElementById("txt") as HTMLElement).innerHTML = "ボタンを押してください!";
	(document.getElementById("check") as HTMLInputElement).disabled = false;
}

function failure() {
	(document.getElementById("txt") as HTMLElement).innerHTML = "このデバイスでは対応しておりません";
}


(document.getElementById("test") as HTMLElement).innerHTML = window.navigator.userAgent;
let iosflg:boolean = false;
if (((window.DeviceOrientationEvent) && ('ontouchstart' in window))) {
	//mobile
	for (let i:number = 0; i < ua.length; i++) {
		if (window.navigator.userAgent.indexOf(ua[i]) > 0) {
			iosflg = true;
			success();
			break;
		}
	}

	if (!iosflg && window.navigator.userAgent.indexOf("Android") > 0) {
		success();
	}

} else {
	//pc
	failure();
}

function check() {
	(document.getElementById("check") as HTMLInputElement).disabled = true;
	if (iosflg) {
		//ios
		try {
			DeviceOrientationEvent.requestPermission().then(res => {
				//yes
				if (res === 'granted') {
					main();
					//no
				} else {
					failure();
				}
			});
		} catch (e) {
			failure();
			alert(e);
		}
	} else {
		//android
		main();
	}
}

(document.getElementById("check") as HTMLInputElement).onclick = check;

const xzManager = nipplejs.create({
	zone: document.getElementById("xzBox") as HTMLElement,
	// mode: 'static',
	// position: {left: '50%', top: '50%'},
	color: 'white'
});

const yManager = nipplejs.create({
	zone: document.getElementById("yBox") as HTMLElement,
	// mode: 'static',
	// position: {left: '50%', top: '50%'},
	color: 'red',
	lockY:true
});

function main(){
	(document.getElementById("canvas-wrapper-main") as HTMLElement).style.display = "inline";
	(document.getElementById("title") as HTMLElement).style.display = "none";
	// document.body.requestFullscreen();//ios非対応

	window.resizeTo(window.innerWidth, window.innerHeight);
	const width:number = window.innerWidth;
	const height:number = window.innerHeight;

	const stats = new Stats();
	stats.showPanel(0);
	document.body.appendChild(stats.dom);

	const stage = new PIXI.Container();
	const renderer = PIXI.autoDetectRenderer({
		width: width,
		height: height,
		resolution: 1,
		antialias: true,
		transparent: true
	});
	(document.getElementById("pixiview") as HTMLElement).appendChild(renderer.view);

	//xz軸
	xzManager.on("move",(e,n)=>{
		let deg_see:number = n.angle.degree;
		if(deg_see<=270){
			deg_see-=90;
		}else{
			deg_see-=360+90;
		}
		deg_see = Math.floor(deg_see * 1000)/1000;//小数3桁まで

		let deg_move:number = (camera.rotation.y * 180 / Math.PI) + deg_see;
		if(deg_move<-90){
			deg_move+=360+90;
		}else{
			deg_move+=90;
		}
		camera.position.x += Math.cos(deg_move*(Math.PI / 180)) * 0.01;
		camera.position.z -= Math.sin(deg_move*(Math.PI / 180)) * 0.01;
	});

	//y軸
	yManager.on("move",(e,n)=>{
		if(n.direction!=undefined){
			const force:number = n.force;
			const p:number = (n.direction.y=="up")?1:-1;
			camera.position.y += force * 0.01 * p;
		}
	});

	//three
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	const cameraY:number = 0.8;
	camera.position.set(0, cameraY, 2);

	const controls = new DeviceOrientationControls(camera);
	controls.connect();

	// const controls2 = new THREE.OrbitControls(camera, rendererThree.domElement);//pc用
	// controls2.enableDamping = true;

	// const axes = new THREE.AxesHelper(1000);//デバッグ
	// scene.add(axes);

	const rendererThree = new THREE.WebGLRenderer({
		canvas: (document.querySelector('canvas') as HTMLCanvasElement),
		antialias: true
	});
	rendererThree.setPixelRatio(window.devicePixelRatio);
	rendererThree.setSize(width, height);
	rendererThree.setClearColor(0x000000);

	const light = new THREE.DirectionalLight(0xffffff);
	light.position.set(1, 1, 1).normalize();
	scene.add(light);

	let geometry = new THREE.SphereGeometry(10);
	let material = new THREE.MeshBasicMaterial({
		vertexColors: THREE.FaceColors as any
	});
	for (let l:number = 0; l < geometry.faces.length; l++) {
		geometry.faces[l].color.set(Math.random() * 0xCC0000);
	}

	let box:any[] = [];
	let num:number = 4000;

	for (let i:number = 0; i < 5000; i++) {
		box[i] = new THREE.Mesh(geometry, material);
		box[i].position.set((Math.random() * num) - num / 2, (Math.random() * num) - num / 2, (Math.random() * num) - num / 2);
		scene.add(box[i]);
	}

	let vrmupdate:any;

	const loader = new GLTFLoader();

	// const a:number = 100;

	loader.load(
		'./models/test.vrm',

		(gltf) => {
			VRM.from(gltf).then((vrm) => {
				scene.add(vrm.scene);
				vrm.scene.rotation.y = Math.PI;
				vrmupdate = vrm;

				// bonevpd(vrm,VRMSchema);

				// returnBone(vrm,"LeftFoot").position.x-=1.150000/a;
			})
		}
	)

	// window.addEventListener("deviceorientation", handleOrientation, true);//デバッグ
	// function handleOrientation(event:any) {
	// 	const absolute:number = event.absolute;
	// 	const alpha:number    = event.alpha;
	// 	const beta:number     = event.beta;
	// 	const gamma:number    = event.gamma;
	// 	console.log(alpha,beta,gamma);
	// }

	const update = () => {
		requestAnimationFrame(update);
		stats.begin();
		for (let i:number = 0; i < box.length; i++) {
			box[i].rotation.y += 0.1;
		}
		stats.end();
		//初期カメラ調整
		if(controls.alphaOffset==0 && camera.rotation.y!=0){
			controls.alphaOffset = camera.rotation.y * -1;
		}
		controls.update();
		renderer.render(stage);
		rendererThree.render(scene, camera);
	};
	update();
}