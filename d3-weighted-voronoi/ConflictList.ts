import * as d3Array from "d3-array";
import * as d3Polygon from "d3-polygon";
  // ConflictList and ConflictListNode

class ConflictListNode {
  face: any;
  vert: any;
  nextf: any;
  prevf: any;
  nextv: any;
  prevv: any;
  constructor(face: any, vert: any) {
    this.face = face;
    this.vert = vert;
    this.nextf = null;
    this.prevf = null;
    this.nextv = null;
    this.prevv = null;
  }
}

  // IN: boolean forFace
class ConflictList {
  forFace: any;
  head: any;  
  constructor(forFace: any) {
    this.forFace = forFace;
    this.head = null;
  }
  public add(cln: any) {
    if (this.head === null) {
      this.head = cln;
    } else {
      if (this.forFace) {  // Is FaceList
        this.head.prevv = cln;
        cln.nextv = this.head;
        this.head = cln;
      } else {  // Is VertexList
        this.head.prevf = cln;
        cln.nextf = this.head;
        this.head = cln;
      }
    }
  }
  public isEmpty(){
    return this.head === null;
  }
  public fill(visible: any) {
    if (this.forFace) {
      return;
    }
    var curr = this.head;
    do {
      visible.push(curr.face);
      curr.face.marked = true;
      curr = curr.nextf;
    } while (curr !== null);
  }
  public removeAll(){
    if (this.forFace) {  // Remove all vertices from Face
      var curr = this.head;
      do {
        if (curr.prevf === null) {  // Node is head
          if (curr.nextf === null) {
            curr.vert.conflicts.head = null;
          } else {
            curr.nextf.prevf = null;
            curr.vert.conflicts.head = curr.nextf;
          }
        } else {  // Node is not head
          if (curr.nextf != null) {
            curr.nextf.prevf = curr.prevf;
          }
          curr.prevf.nextf = curr.nextf;
        }
        curr = curr.nextv;
        if (curr != null) {
          curr.prevv = null;
        }
      } while (curr != null);
    } else {  // Remove all JFaces from vertex
      var curr = this.head;
      do {
        if (curr.prevv == null) {  // Node is head
          if (curr.nextv == null) {
            curr.face.conflicts.head = null;
          } else {
            curr.nextv.prevv = null;
            curr.face.conflicts.head = curr.nextv;
          }
        } else {  // Node is not head
          if (curr.nextv != null) {
            curr.nextv.prevv = curr.prevv;
          }
          curr.prevv.nextv = curr.nextv;
        }
        curr = curr.nextf;
        if (curr != null)
          curr.prevf = null;
      } while (curr != null);
    }
  }
  public getVertices() {
    var list:any[] = [],
    		curr = this.head;
    while (curr !== null) {
      list.push(curr.vert);
      curr = curr.nextv;
    }
    return list;
  }
}
export {
  ConflictListNode,
  ConflictList
}
