import bpy
import json
import os

def Key_Frame_Points():

    KEYFRAME_POINTS_ARRAY = []
    camera = bpy.data.objects["Camera"]
    fcurves = camera.animation_data.action.fcurves


    for i in range(len(fcurves[0].keyframe_points)):
        frame = fcurves[0].keyframe_points[i].co[0]

        # Location
        x = fcurves[0].keyframe_points[i].co[1]
        y = fcurves[1].keyframe_points[i].co[1]
        z = fcurves[2].keyframe_points[i].co[1]

        # Rotation
        rx = fcurves[3].keyframe_points[i].co[1]
        ry = fcurves[4].keyframe_points[i].co[1]
        rz = fcurves[5].keyframe_points[i].co[1]

        keyframe = {
            "frame": frame,
            "location": [x, y, z],
            "rotation": [rx, ry, rz]
        }

        KEYFRAME_POINTS_ARRAY.append(keyframe)

    return KEYFRAME_POINTS_ARRAY

json_string = json.dumps(Key_Frame_Points(), sort_keys=True, indent=4)

os.makedirs("c:\\blender\\", exist_ok=True)

NameForFile=open("c:\\blender\\camera-path.json","w")
NameForFile.write(json_string)
NameForFile.close()
