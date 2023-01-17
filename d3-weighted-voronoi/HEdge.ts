/*
 * @Author: cyy
 * @Date: 2023-01-15 16:08:21
 * @LastEditors: cyy
 * @LastEditTime: 2023-01-15 16:11:45
 * @Description: default
 */
// HEdge

// IN: vertex orig, vertex dest, Face face
class HEdge {
    public next: any;
    public prev: any;
    public twin: any;
    public orig: any;
    public dest: any;
    public iFace: any;

    constructor(orig, dest, face) {
        this.next = null;
        this.prev = null;
        this.twin = null;
        this.orig = orig;
        this.dest = dest;
        this.iFace = face;
    }

    public isHorizon = function() {
        return this.twin !== null && !this.iFace.marked && this.twin.iFace.marked;
    }

    // IN: array horizon
    public findHorizon = function(horizon) {
        if (this.isHorizon()) {
          if (horizon.length > 0 && this === horizon[0]) {
            return;
          } else {
            horizon.push(this);
            this.next.findHorizon(horizon);
          }
        } else {
          if (this.twin !== null) {
            this.twin.next.findHorizon(horizon);
          }
        }
    }

    public isEqual = function(origin, dest) {
        return ((this.orig.equals(origin) && this.dest.equals(dest)) || (this.orig.equals(dest) && this.dest.equals(origin)));
    }
}

export {
    HEdge
}