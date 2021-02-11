import { CameraKeyFrame } from '../animation/CameraKeyFrame';
import { Vector3f } from '../math';
import { CameraFrame, CameraPath } from './CameraPath';

export class CameraLoader {

    public static load(filename: string): Promise<Array<CameraKeyFrame>> {
        return fetch(filename).then((response: Response) => {
            return response.text();
        }).then((text: string): Array<CameraKeyFrame> => {

            const json: any = JSON.parse(text);
            const cameraPath: CameraPath = new CameraPath();
            const keys = new Array<CameraKeyFrame>();

            for (let i = 0; i < json.length; i++) {
                const frame = json[i];

                const myFrame = new CameraFrame(
                    frame.frame,
                    new Vector3f(
                        frame.location[0],
                        frame.location[1],
                        frame.location[2]
                    ),
                    new Vector3f(
                        frame.rotation[0],
                        frame.rotation[1],
                        frame.rotation[2]
                    ));

                cameraPath.frames.push(myFrame);
                keys.push(new CameraKeyFrame(new Vector3f(
                    frame.location[0],
                    frame.location[2],
                    -frame.location[1]
                ),
                    new Vector3f(
                        frame.rotation[0] - 90 * 0.0174533,
                        frame.rotation[2],
                        frame.rotation[1]
                    )));

            }

            return keys;
        });
    }

}
