import * as d3Polygon from "d3-polygon";


 epsilon = 1e-10;
function epsilonesque(n: any) {
  return n <= epsilon && n >= -epsilon;
}
// 求空间点积，点乘
function dot(v0: any, v1: any) {
  return v0.x * v1.x + v0.y * v1.y + v0.z * v1.z;
}
function linearDependent(v0: any, v1: any) {
  return (
    epsilonesque(v0.x * v1.y - v0.y * v1.x) &&
    epsilonesque(v0.y * v1.z - v0.z * v1.y) &&
    epsilonesque(v0.z * v1.x - v0.x * v1.z)
  );
}
// 判断是否为凸多边形
function polygonDirection(polygon: any[]) {
   sign, crossproduct, p0, p1, p2, v0, v1, i;

  //begin: initialization
  p0 = polygon[polygon.length - 2];
  p1 = polygon[polygon.length - 1];
  p2 = polygon[0];
  v0 = vect(p0, p1);
  v1 = vect(p1, p2);
  crossproduct = calculateCrossproduct(v0, v1);
  // console.log(`[[${p0}], [${p1}], [${p2}]] => (${v0}) x (${v1}) = ${crossproduct}`);
  sign = Math.sign(crossproduct);
  //end: initialization

  p0 = p1; // p0 = polygon[polygon.length - 1];
  p1 = p2; // p1 = polygon[0];
  p2 = polygon[1];
  v0 = v1;
  v1 = vect(p1, p2);
  crossproduct = calculateCrossproduct(v0, v1);
  // console.log(`[[${p0}], [${p1}], [${p2}]] => (${v0}) x (${v1}) = ${crossproduct}`);
  if (Math.sign(crossproduct) !== sign) {
    return undefined;
  } //different signs in cross products means concave polygon

  //iterate on remaining 3 consecutive points
  for (i = 2; i < polygon.length - 1; i++) {
    p0 = p1;
    p1 = p2;
    p2 = polygon[i];
    v0 = v1;
    v1 = vect(p1, p2);
    crossproduct = calculateCrossproduct(v0, v1);
    // console.log(`[[${p0}], [${p1}], [${p2}]] => (${v0}) x (${v1}) = ${crossproduct}`);
    if (Math.sign(crossproduct) !== sign) {
      return undefined;
    } //different signs in cross products means concave polygon
  }

  return sign;
}
// 两个向量相加得到的向量
function vect(from: any, to: any) {
  return [to[0] - from[0], to[1] - from[1]];
}
// 叉乘
function calculateCrossproduct(v0:any, v1:any) {
  return v0[0] * v1[1] - v0[1] * v1[0];
}

function polygonClip(clip: any, subject: any) {
  // Version 0.0.0. Copyright 2017 Mike Bostock.

  // Clips the specified subject polygon to the specified clip polygon;
  // requires the clip polygon to be counterclockwise and convex.
  // https://en.wikipedia.org/wiki/Sutherland–Hodgman_algorithm
  // https://observablehq.com/@d3/polygonclip

   input,
    closed = polygonClosed(subject),
    i = -1,
    n = clip.length - polygonClosed(clip),
    j,
    m,
    a = clip[n - 1],
    b,
    c,
    d,
    intersection;

  while (++i < n) {
    input = subject.slice();
    subject.length = 0;
    b = clip[i];
    c = input[(m = input.length - closed) - 1];
    j = -1;
    while (++j < m) {
      d = input[j];
      if (polygonInside(d, a, b)) {
        if (!polygonInside(c, a, b)) {
          intersection = polygonIntersect(c, d, a, b);
          if (isFinite(intersection[0])) {
            subject.push(intersection);
          }
        }
        subject.push(d);
      } else if (polygonInside(c, a, b)) {
        intersection = polygonIntersect(c, d, a, b);
        if (isFinite(intersection[0])) {
          subject.push(intersection);
        }
      }
      c = d;
    }
    if (closed) subject.push(subject[0]);
    a = b;
  }

  return subject;
}

function polygonInside(p: any, a: any, b: any) {
  return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);
}

// Intersect two infinite lines cd and ab.
// Return Infinity if cd and ab colinear
function polygonIntersect(c: any, d: any, a: any, b: any) {
   x1 = c[0],
    x3 = a[0],
    x21 = d[0] - x1,
    x43 = b[0] - x3,
    y1 = c[1],
    y3 = a[1],
    y21 = d[1] - y1,
    y43 = b[1] - y3,
    ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
  return [x1 + ua * x21, y1 + ua * y21];
}

// Returns true if the polygon is closed.
function polygonClosed(coordinates: any[]) {
   a = coordinates[0],
    b = coordinates[coordinates.length - 1];
  // 起始xy坐标重合时返回true -> 1，否则返回false -> 0
  return Number(!(a[0] - b[0] || a[1] - b[1]));
}

// IN: HEdge edge
function getFacesOfDestVertex(edge: any) {
   faces:any[] = [];
   previous = edge;
   first = edge.dest;
   site = first.originalObject;
   neighbours:any[] = [];
  do {
    previous = previous.twin.prev;
     siteOrigin = previous.orig.originalObject;
    if (!siteOrigin.isDummy) {
      neighbours.push(siteOrigin);
    }
     iFace = previous.iFace;
    if (iFace.isVisibleFromBelow()) {
      faces.push(iFace);
    }
  } while (previous !== edge);
  site.neighbours = neighbours;
  return faces;
}
function computePowerDiagramIntegrated(sites: any, boundingSites: any, clippingPolygon: any) {
   convexHull: any = new convexHull();
  convexHull.clear();
  convexHull.init(boundingSites, sites);

   facets = convexHull.compute(sites);
   polygons:any[] = []; 
   verticesVisited:any[] = [];
   facetCount = facets.length;

  for ( i = 0; i < facetCount; i++) {
     facet = facets[i];
    if (facet.isVisibleFromBelow()) {
      for ( e = 0; e < 3; e++) {
        // go through the edges and start to build the polygon by going through the double connected edge list
         edge = facet.edges[e];
         destVertex = edge.dest;
         site = destVertex.originalObject; 

        if (!verticesVisited[destVertex.index]) {
          verticesVisited[destVertex.index] = true;
          if (site.isDummy) {
            // Check if this is one of the sites making the bounding polygon
            continue;
          }
          // faces around the vertices which correspond to the polygon corner points
           faces = getFacesOfDestVertex(edge);
           protopoly:any[] = [];
           lastX = null;
           lastY = null;
           dx = 1;
           dy = 1;
          for ( j = 0; j < faces.length; j++) {
             point = faces[j].getDualPoint();
             x1 = point.x;
             y1 = point.y;
            if (lastX !== null && lastY !== null) {
              dx = lastX - x1;
              dy = lastY - y1;
              if (dx < 0) {
                dx = -dx;
              }
              if (dy < 0) {
                dy = -dy;
              }
            }
            if (dx > epsilon || dy > epsilon) {
              protopoly.push([x1, y1]);
              lastX = x1;
              lastY = y1;
            }
          }
          
          site.nonClippedPolygon = protopoly.reverse();
          if (!site.isDummy && d3Polygon.polygonLength(site.nonClippedPolygon) > 0) {
             clippedPoly = polygonClip(clippingPolygon, site.nonClippedPolygon);
            site.polygon = clippedPoly;
            clippedPoly.site = site;
            if (clippedPoly.length > 0) {
              polygons.push(clippedPoly);
            }
          }
        }
      }
    }
  }
  return polygons;
}



export {
  epsilonesque,
  dot,
  linearDependent,
  polygonDirection,
  vect,
  calculateCrossproduct,
  polygonClip,
  polygonInside,
  polygonIntersect,
  polygonClosed,
  getFacesOfDestVertex,
  computePowerDiagramIntegrated,
}