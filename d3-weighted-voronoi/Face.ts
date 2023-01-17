/*
 * @Author: cyy
 * @Date: 2023-01-15 15:42:46
 * @LastEditors: cyy
 * @LastEditTime: 2023-01-15 17:26:01
 * @Description: default
 */
import { ConflictList } from "./ConflictList";
import { Vector } from "./Vector";
import { Plane3D } from "./Plane3D";
import { HEdge } from "./HEdge"
import { dot } from "./calculateWeight";
import { d3WeightedVoronoiError } from "./d3WeightedVoronoiError";
 
var epsilon = 1e-10;
class Face {
    public conflicts: any;
    public verts: any[];
    public marked: boolean;
    public normal: any;
    public dualPoint: any;
    public edges: any[];
    public t: any;

    constructor(a: any, b: any, c: any, orient?: any) {
        this.conflicts = new ConflictList(true);
        this.verts = [a, b, c];
        this.marked = false;
        this.t = a.subtract(b).crossproduct(b.subtract(c));
        this.normal = new Vector(-this.t.x, -this.t.y, -this.t.z);
        this.normal.normalize();
        this.createEdges();
        this.dualPoint = null;

        if (orient != undefined) {
            this.orient(orient);
        }
    }

    // OUT: Point2D
    public getDualPoint = function() {
        if (this.dualPoint == null) {
            var plane3d = new Plane3D(this);
            this.dualPoint = plane3d.getDualPointMappedToPlane();
        }
        return this.dualPoint;
    }

    public isVisibleFromBelow = function () {
        return this.normal.z < -1.4259414393190911e-9;
    };

    public createEdges = function() {
        this.edges = [];
        this.edges[0] = new HEdge(this.verts[0], this.verts[1], this);
        this.edges[1] = new HEdge(this.verts[1], this.verts[2], this);
        this.edges[2] = new HEdge(this.verts[2], this.verts[0], this);
        this.edges[0].next = this.edges[1];
        this.edges[0].prev = this.edges[2];
        this.edges[1].next = this.edges[2];
        this.edges[1].prev = this.edges[0];
        this.edges[2].next = this.edges[0];
        this.edges[2].prev = this.edges[1];
    }

    // IN: vertex orient
    public orient = function (orient) {
        if (!(dot(this.normal, orient) < dot(this.normal, this.verts[0]))) {
          var temp = this.verts[1];
          this.verts[1] = this.verts[2];
          this.verts[2] = temp;
          this.normal.negate();
          this.createEdges();
        }
    };

    // IN: two vertices v0 and v1
    public getEdge = function (v0, v1) {
        for (var i = 0; i < 3; i++) {
          if (this.edges[i].isEqual(v0, v1)) {
            return this.edges[i];
          }
        }
        return null;
    };

    public link = function (face?: any, v0? : any, v1? :any) {
        if (face instanceof Face) {
          var twin = face.getEdge(v0, v1);
          if (twin === null) {
            throw new d3WeightedVoronoiError('when linking, twin is null');
          }
          var edge = this.getEdge(v0, v1);
          if (edge === null) {
            throw new d3WeightedVoronoiError('when linking, twin is null');
          }
          twin.twin = edge;
          edge.twin = twin;
        } else {
          var twin = face; // face is a hEdge
          var edge = this.getEdge(twin.orig, twin.dest);
          twin.twin = edge;
          edge.twin = twin;
        }
    };

    // IN: vertex v
    public conflict = function (v) {
        return dot(this.normal, v) > dot(this.normal, this.verts[0]) + epsilon;
    };

    public getHorizon = function () {
        for (var i = 0; i < 3; i++) {
          if (this.edges[i].twin !== null && this.edges[i].twin.isHorizon()) {
            return this.edges[i];
          }
        }
        return null;
    };

    public removeConflict = function () {
        this.conflicts.removeAll();
    };
}

export {
    Face
}