import json
import codecs
import sys
args = sys.argv
import math
pi = math.pi

# bone name rotation position x y z
bone = [
    ["上半身","chest",1,1,0,0,0],
    ["頭","head",-1,1,0,0,0],
    # ["","hips",1,1,0,0,0],
    ["あご","jaw",1,1,0,0,0],
    ["左目","leftEye",1,1,0,0,0],
    ["左足首","leftFoot",1,1,0,0,0],
    ["左手捩","leftHand",-1,1,0,0,0],
    ["左人指３","leftIndexDistal",-1,1,0,0,pi/4], #To Do z
    ["左人指２","leftIndexIntermediate",-1,1,0,0,pi/8], #To Do z
    ["左人指１","leftIndexProximal",-1,1,0,0,pi/8],
    ["左小指３","leftLittleDistal",-1,1,0,0,pi/8],
    ["左小指２","leftLittleIntermediate",-1,1,0,0,pi/4],
    ["左小指１","leftLittleProximal",-1,1,0,0,pi/8],
    ["左ひじ","leftLowerArm",1,1,0,-pi,0],
    ["左足ＩＫ","leftLowerLeg",1,1/200,0,0,0],
    ["左中指３","leftMiddleDistal",-1,1,0,0,pi/8],
    ["左中指２","leftMiddleIntermediate",-1,1,0,0,pi/4],
    ["左中指１","leftMiddleProximal",-1,1,0,0,pi/8],
    ["左薬指３","leftRingDistal",-1,1,0,0,pi/8],
    ["左薬指２","leftRingIntermediate",-1,1,0,0,pi/4],
    ["左薬指１","leftRingProximal",-1,1,0,0,pi/8],
    ["左肩","leftShoulder",1,1,0,0,0],
    ["左親指２","leftThumbDistal",-1,1,0,pi/4,0],
    ["左親指１","leftThumbIntermediate",-1,1,0,pi/4,0],
    ["左親指０","leftThumbProximal",-1,1,0,0,0],
    ["左つま先ＩＫ","leftToes",1,1,0,0,0],
    ["左腕","leftUpperArm",1,1,0,pi/4,pi/2],
    ["左足","leftUpperLeg",1,1,0,0,0],
    ["首","neck",-1,1,0,0,0],
    ["右目","rightEye",1,1,0,0,0],
    ["右足首","rightFoot",1,1,0,0,0],
    ["右手捩","rightHand",-1,1,pi/2,0,0],
    ["右人指３","rightIndexDistal",-1,1,0,0,-pi/4], #To Do z
    ["右人指２","rightIndexIntermediate",-1,1,0,0,-pi/8], #To Do z
    ["右人指１","rightIndexProximal",-1,1,0,0,-pi/8],
    ["右小指３","rightLittleDistal",-1,1,0,0,-pi/8],
    ["右小指２","rightLittleIntermediate",-1,1,0,0,-pi/4],
    ["右小指１","rightLittleProximal",-1,1,0,0,-pi/8],
    ["右ひじ","rightLowerArm",1,1,0,0,0],
    ["右足ＩＫ","rightLowerLeg",1,1/200,0,0,0],
    ["右中指３","rightMiddleDistal",-1,1,0,0,-pi/8],
    ["右中指２","rightMiddleIntermediate",-1,1,0,0,-pi/4],
    ["右中指１","rightMiddleProximal",-1,1,0,0,-pi/8],
    ["右薬指３","rightRingDistal",-1,1,0,0,-pi/8],
    ["右薬指２","rightRingIntermediate",-1,1,0,0,-pi/4],
    ["右薬指１","rightRingProximal",-1,1,0,0,-pi/8],
    ["右肩","rightShoulder",1,1,0,0,pi/2],
    ["右親指２","rightThumbDistal",-1,1,0,-pi/4,0],
    ["右親指１","rightThumbIntermediate",-1,1,0,-pi/4,0],
    ["右親指０","rightThumbProximal",-1,1,0,0,0],
    ["右つま先ＩＫ","rightToes",1,1,0,0,0],
    ["右腕","rightUpperArm",-1,1,0,0,0],
    ["右足","rightUpperLeg",1,1,0,0,0],
    ["上半身2","spine",-1,1,0,0,0],
    # ["","upperChest",1,1,0,0,0]
]

n = []
ret = []
vrm_format = "vrm.humanoid!.getBoneNode(vrms.HumanoidBoneName.{0}).{1}.{2}{3}={4}"
xyz = ["x","y","z"]

f = codecs.open(args[1], 'r', 'sjis')
i=0
for line in f:
    n.append(line)
for i in range(0,len(n)):
    for l in range(0,len(bone)):
        if("Bone" in n[i]):
            if(bone[l][0] == n[i].strip().split("{")[1]):
                i+=1
                # position
                a=[]
                a = n[i].strip().split(";")[0].split(",")
                a = [float(s)*bone[l][3] for s in a]
                i+=1
                # rotation
                b=[]
                b = n[i].strip().split(";")[0].split(",")
                b = [float(s)*bone[l][2] for s in b]

                vrmbone = bone[l][1][0].upper() + bone[l][1][1:]
                for k in range(0,3):
                    ret.append(vrm_format.format(vrmbone,"position",xyz[k],"+",a[k]))
                for j in range(0,3):
                    ret.append(vrm_format.format(vrmbone,"rotation",xyz[j],"",b[j]+bone[l][4+j]))
f.close()

f = codecs.open('..\src\pose.ts', 'w','utf-8')
f.write("export function bonevpd(vrm:any,vrms:any) {"+"\n")
for i in ret:
    f.write(i+"\n")
f.write("}"+"\n")
f.close()