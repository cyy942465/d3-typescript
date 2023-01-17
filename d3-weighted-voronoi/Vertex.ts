/*
 * @Author: cyy
 * @Date: 2023-01-15 15:10:54
 * @LastEditors: cyy
 * @LastEditTime: 2023-01-15 15:36:31
 * @Description: default
 */
import * as d3Array from "d3-array";
import * as d3Polygon from "d3-polygon";
import { ConflictList } from "./ConflictList";
const epsilon = 1e-10;
class Vertex {
  public x: any;
  public y: any;
  public z: any;
  public weight: any;
  public index: any;
  public conflicts: any;
  public neighbours: any;
  public nonClippedPolygon: any;
  public polygon: number[] | any;
  public originalObject: any;
  public isDummy: boolean;
  constructor(x: any, y: any, z: any, weight?: any, orig?: any, isDummy?: boolean){
    this.x = x;
    this.y = y;
    this.weight = epsilon;
    this.index = 0;
    this.conflicts = new ConflictList(false);
    this.neighbours = null;  // Potential trouble
    this.nonClippedPolygon = null;
    this.polygon = null;
    this.originalObject = null;
    this.isDummy = false;
  
    if (orig !== undefined) {
      this.originalObject = orig;
    }
    if (isDummy != undefined) {
      this.isDummy = isDummy;
    }
    if (weight != null) {
      this.weight = weight;
    }
    if (z != null) {
      this.z = z;
    } else {
      this.z = this.projectZ(this.x, this.y, this.weight);
    }
  }
  public projectZ(x: any, y:any, weight: any) {
    return ((x*x) + (y*y) - weight);
  }
  public setWeight(weight: any) {
    this.weight = weight;
    this.z = this.projectZ(this.x, this.y, this.weight);
  }
  public subtract(v: any) {
    return new Vertex(v.x - this.x, v.y - this.y, v.z - this.z);
  }
  public crossproduct(v: any) {
    return new Vertex((this.y * v.z) - (this.z * v.y), (this.z * v.x) - (this.x * v.z), (this.x * v.y) - (this.y * v.x));
  }
  public equals(v: any) {
    return (this.x === v.x && this.y === v.y && this.z === v.z);
  }
}

export {
  Vertex
}