import { Framebuffer } from '../Framebuffer';
import { Vertex } from '../Vertex';
import { AbstractScannlineTriangleRasterizer } from './AbstractScanlineTriangleRasterizer';

export class TexturedTriangleRasterizer2D extends AbstractScannlineTriangleRasterizer{

    // requires
    // bob und wbuffer
    constructor(private framebuffer: Framebuffer) {
        super();
    }

    protected fillLongRightTriangle(framebuffer: Framebuffer, v1: Vertex, v2: Vertex, v3: Vertex): void {

        // left slope
        let yDistanceLeft = v2.projection.y - v1.projection.y;
        let slope1 = (v2.projection.x - v1.projection.x) / yDistanceLeft;
        let tslope1u = (v2.textureCoordinate.u  - v1.textureCoordinate.u ) / yDistanceLeft;
        let tslope1v = (v2.textureCoordinate.v  - v1.textureCoordinate.v ) / yDistanceLeft;
       
    
        let curu1 = v1.textureCoordinate.u;
        let curv1 = v1.textureCoordinate.v ;
        let xPosition = v1.projection.x;

        // right slope
        const yDistanceRight = v3.projection.y - v1.projection.y;
        const slope2 = (v3.projection.x - v1.projection.x) / yDistanceRight;
        const tslope2u = (v3.textureCoordinate.u  - v1.textureCoordinate.u) / yDistanceRight;
        const tslope2v = (v3.textureCoordinate.v  - v1.textureCoordinate.v) / yDistanceRight;
       
    
        let curu2 = v1.textureCoordinate.u ;
        let curv2 = v1.textureCoordinate.v ;
        let xPosition2 = v1.projection.x;

        let yPosition = v1.projection.y;

        for (let i = 0; i < yDistanceLeft; i++) {
            const length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * framebuffer.width + Math.round(xPosition)

            const spanuStep = (curu2 - curu1) / length;
            const spanvStep = (curv2 - curv1) / length;


            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
               
                  

                    let u = Math.max(Math.min((uStart * framebuffer.bob.width), framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * framebuffer.bob.height), framebuffer.bob.height - 1), 0) | 0;
                    let color2 = framebuffer.bob.texture[u + v * framebuffer.bob.width];

                    framebuffer.framebuffer[framebufferIndex] = color2;
            
                framebufferIndex++;
                uStart += spanuStep;
                vStart += spanvStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;


            curu1 += tslope1u;
            curu2 += tslope2u;

            curv1 += tslope1v;
            curv2 += tslope2v;
        }


        yDistanceLeft = v3.projection.y - v2.projection.y;

        if (yDistanceLeft === 0) {
            return;
        }

        slope1 = (v3.projection.x - v2.projection.x) / yDistanceLeft;
       
        tslope1u = (v3.textureCoordinate.u  - v2.textureCoordinate.u ) / yDistanceLeft;
        tslope1v = (v3.textureCoordinate.v - v2.textureCoordinate.v) / yDistanceLeft;

       
        curu1 = v2.textureCoordinate.u ;
        curv1 = v2.textureCoordinate.v ;
        xPosition = v2.projection.x;
        yPosition = v2.projection.y;

        for (let i = 0; i < yDistanceLeft; i++) {
            const length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * framebuffer.width + Math.round(xPosition)

           
            const spanuStep = (curu2 - curu1) / length;
            const spanvStep = (curv2 - curv1) / length;
            

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
               


                    let u = Math.max(Math.min((uStart  * framebuffer.bob.width), framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart  * framebuffer.bob.height), framebuffer.bob.height - 1), 0) | 0;
                    let color2 = framebuffer.bob.texture[u + v * framebuffer.bob.width];

                  

                    framebuffer.framebuffer[framebufferIndex] = color2;
                
                framebufferIndex++;
             
                uStart += spanuStep;
                vStart += spanvStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;




            curu1 += tslope1u;
            curu2 += tslope2u;

            curv1 += tslope1v;
            curv2 += tslope2v;
        }
    }

    protected fillLongLeftTriangle(framebuffer: Framebuffer, v1: Vertex, v2: Vertex, v3: Vertex): void {

        let yDistanceRight = v2.projection.y - v1.projection.y;
        const yDistanceLeft = v3.projection.y - v1.projection.y;

        let slope2 = (v2.projection.x - v1.projection.x) / yDistanceRight;
        const slope1 = (v3.projection.x - v1.projection.x) / yDistanceLeft;

        const tslope1u = (v3.textureCoordinate.u  - v1.textureCoordinate.u ) / yDistanceLeft;
        let tslope2u = (v2.textureCoordinate.u  - v1.textureCoordinate.u ) / yDistanceRight;

        const tslope1v = (v3.textureCoordinate.v  - v1.textureCoordinate.v ) / yDistanceLeft;
        let tslope2v = (v2.textureCoordinate.v  - v1.textureCoordinate.v ) / yDistanceRight;




        let curu1 = v1.textureCoordinate.u ;
        let curv1 = v1.textureCoordinate.v ;
        let curu2 = v1.textureCoordinate.u ;
        let curv2 = v1.textureCoordinate.v ;

        let xPosition = v1.projection.x;
        let xPosition2 = v1.projection.x;
        let yPosition = v1.projection.y;

        for (let i = 0; i < yDistanceRight; i++) {
            const length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * framebuffer.width + Math.round(xPosition)
  
            const spanuStep = (curu2 - curu1) / length;
            const spanvStep = (curv2 - curv1) / length;
          

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
              


                    let u = Math.max(Math.min((uStart  * framebuffer.bob.width), framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart  * framebuffer.bob.height), framebuffer.bob.height - 1), 0) | 0;
                    let color2 = framebuffer.bob.texture[u + v * framebuffer.bob.width];



                 

                    framebuffer.framebuffer[framebufferIndex] = color2;
               
                framebufferIndex++;
               
                uStart += spanuStep;
                vStart += spanvStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;


            curu1 += tslope1u;
            curu2 += tslope2u;

            curv1 += tslope1v;
            curv2 += tslope2v;
        }

        yDistanceRight = v3.projection.y - v2.projection.y;
        slope2 = (v3.projection.x - v2.projection.x) / yDistanceRight;
       

        tslope2u = (v3.textureCoordinate.u  - v2.textureCoordinate.u ) / yDistanceRight;
        tslope2v = (v3.textureCoordinate.v  - v2.textureCoordinate.v ) / yDistanceRight;

       

        curu2 = v2.textureCoordinate.u ;
        curv2 = v2.textureCoordinate.v;

        xPosition2 = v2.projection.x;
        yPosition = v2.projection.y;

        for (let i = 0; i < yDistanceRight; i++) {
            const length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * framebuffer.width + Math.round(xPosition)


            
            const spanuStep = (curu2 - curu1) / length;
            const spanvStep = (curv2 - curv1) / length;
            

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
               

                    let u = Math.max(Math.min((uStart  * framebuffer.bob.width), framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart  * framebuffer.bob.height), framebuffer.bob.height - 1), 0) | 0;
                    let color2 = framebuffer.bob.texture[u + v * framebuffer.bob.width];

                  

                    framebuffer.framebuffer[framebufferIndex] = color2;
               
                framebufferIndex++;
               
                uStart += spanuStep;
                vStart += spanvStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;

           

            curu1 += tslope1u;
            curu2 += tslope2u;

            curv1 += tslope1v;
            curv2 += tslope2v;
        }
    }

}
