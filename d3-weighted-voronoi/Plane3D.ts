/*
 * @Author: cyy
 * @Date: 2023-01-15 16:01:28
 * @LastEditors: cyy
 * @LastEditTime: 2023-01-15 16:06:33
 * @Description: default
 */
// Plane3D and Point2D

// IN: Face face
class Plane3D {

    public a: any;
    public b: any;
    public c: any;
    public d: any;

    constructor(face) {
        let p1 = face.verts[0];
        let p2 = face.verts[1];
        let p3 = face.verts[2];

        this.a = p1.y * (p2.z-p3.z) + p2.y * (p3.z-p1.z) + p3.y * (p1.z-p2.z);
        this.b = p1.z * (p2.x-p3.x) + p2.z * (p3.x-p1.x) + p3.z * (p1.x-p2.x);
        this.c = p1.x * (p2.y-p3.y) + p2.x * (p3.y-p1.y) + p3.x * (p1.y-p2.y);
        this.d = -1 * (p1.x * (p2.y*p3.z - p3.y*p2.z) + p2.x * (p3.y*p1.z - p1.y*p3.z) + p3.x * (p1.y*p2.z - p2.y*p1.z));
    }

    public getNormZPlane() {
        return [
            -1 * (this.a / this.c),
            -1 * (this.b / this.c),
            -1 * (this.d / this.c)
          ];
    }

    public getDualPointMappedToPlane() {
        var nplane = this.getNormZPlane();
        var dualPoint = new Point2D(nplane[0]/2, nplane[1]/2);
        return dualPoint;
    }
}

class Point2D {
    public x: any;
    public y: any;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export{
    Point2D,
    Plane3D
}