/*
 * @Author: cyy
 * @Date: 2023-01-17 21:09:48
 * @LastEditors: cyy
 * @LastEditTime: 2023-01-17 21:35:43
 * @Description: default
 */
import * as d3Polygon from "d3-polygon";

function randomInitialPosition () {

    //begin: internals
    var clippingPolygon,
      extent,
      minX, maxX,
      minY, maxY,
      dx, dy;
    //end: internals

    ///////////////////////
    ///////// API /////////
    ///////////////////////

    function _random(d, i, arr, voronoiMapSimulation) {
      var shouldUpdateInternals = false;
      var x, y;

      if (clippingPolygon !== voronoiMapSimulation.clip()) {
        clippingPolygon = voronoiMapSimulation.clip();
        extent = voronoiMapSimulation.extent();
        shouldUpdateInternals = true;
      }

      if (shouldUpdateInternals) {
        updateInternals();
      }

      x = minX + dx * voronoiMapSimulation.prng()();
      y = minY + dy * voronoiMapSimulation.prng()();
      while (!d3Polygon.polygonContains(clippingPolygon, [x, y])) {
        x = minX + dx * voronoiMapSimulation.prng()();
        y = minY + dy * voronoiMapSimulation.prng()();
      }
      return [x, y];
    };

    ///////////////////////
    /////// Private ///////
    ///////////////////////

    function updateInternals() {
      minX = extent[0][0];
      maxX = extent[1][0];
      minY = extent[0][1];
      maxY = extent[1][1];
      dx = maxX - minX;
      dy = maxY - minY;
    };

    return _random;
};

function pie () {
    //begin: internals
    var startAngle = 0;
    var clippingPolygon,
      dataArray,
      dataArrayLength,
      clippingPolygonCentroid,
      halfIncircleRadius,
      angleBetweenData;
    //end: internals

    ///////////////////////
    ///////// API /////////
    ///////////////////////

    function _pie(d, i, arr, voronoiMapSimulation) {
      let shouldUpdateInternals = false;

      if (clippingPolygon !== voronoiMapSimulation.clip()) {
        clippingPolygon = voronoiMapSimulation.clip();
        shouldUpdateInternals = shouldUpdateInternals || true;
      }
      if (dataArray !== arr) {
        dataArray = arr;
        shouldUpdateInternals = shouldUpdateInternals || true;
      }

      if (shouldUpdateInternals) {
        updateInternals();
      }

      // add some randomness to prevent colinear/cocircular points
      // substract -0.5 so that the average jitter is still zero
      return [
        clippingPolygonCentroid[0] + Math.cos(startAngle + i * angleBetweenData) * halfIncircleRadius + (voronoiMapSimulation.prng()() - 0.5) * 1E-3,
        clippingPolygonCentroid[1] + Math.sin(startAngle + i * angleBetweenData) * halfIncircleRadius + (voronoiMapSimulation.prng()() - 0.5) * 1E-3
      ];
    };

    _pie.startAngle = function (_) {
      if (!arguments.length) {
        return startAngle;
      }

      startAngle = _;
      return _pie;
    };

    ///////////////////////
    /////// Private ///////
    ///////////////////////

    function updateInternals() {
      clippingPolygonCentroid = d3Polygon.polygonCentroid(clippingPolygon);
      halfIncircleRadius = computeMinDistFromEdges(clippingPolygonCentroid, clippingPolygon) / 2;
      dataArrayLength = dataArray.length;
      angleBetweenData = 2 * Math.PI / dataArrayLength;
    };

    function computeMinDistFromEdges(vertex, clippingPolygon) {
      var minDistFromEdges = Infinity,
        edgeIndex = 0,
        edgeVertex0 = clippingPolygon[clippingPolygon.length - 1],
        edgeVertex1 = clippingPolygon[edgeIndex];
      var distFromCurrentEdge;

      while (edgeIndex < clippingPolygon.length) {
        distFromCurrentEdge = vDistance(vertex, edgeVertex0, edgeVertex1);
        if (distFromCurrentEdge < minDistFromEdges) {
          minDistFromEdges = distFromCurrentEdge;
        }
        edgeIndex++;
        edgeVertex0 = edgeVertex1;
        edgeVertex1 = clippingPolygon[edgeIndex];
      }

      return minDistFromEdges;
    }

    //from https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
    function vDistance(vertex, edgeVertex0, edgeVertex1) {
      var x = vertex[0],
        y = vertex[1],
        x1 = edgeVertex0[0],
        y1 = edgeVertex0[1],
        x2 = edgeVertex1[0],
        y2 = edgeVertex1[1];
      var A = x - x1,
        B = y - y1,
        C = x2 - x1,
        D = y2 - y1;
      var dot = A * C + B * D;
      var len_sq = C * C + D * D;
      var param = -1;

      if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;

      var xx, yy;

      if (param < 0) { // this should not arise as clippingpolygon is convex
        xx = x1;
        yy = y1;
      } else if (param > 1) { // this should not arise as clippingpolygon is convex
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }

      var dx = x - xx;
      var dy = y - yy;
      return Math.sqrt(dx * dx + dy * dy);
    }

    return _pie;
}

function halfAverageAreaInitialWeight () {
  //begin: internals
  var clippingPolygon,
    dataArray,
    siteCount,
    totalArea,
    halfAverageArea;
  //end: internals

  ///////////////////////
  ///////// API /////////
  ///////////////////////
  function _halfAverageArea(d, i, arr, voronoiMapSimulation) {
    var shouldUpdateInternals = false;
    if (clippingPolygon !== voronoiMapSimulation.clip()) {
      clippingPolygon = voronoiMapSimulation.clip();
      shouldUpdateInternals = shouldUpdateInternals || true;
    }
    if (dataArray !== arr) {
      dataArray = arr;
      shouldUpdateInternals = shouldUpdateInternals || true;
    }

    if (shouldUpdateInternals) {
      updateInternals();
    }

    return halfAverageArea;
  };

  ///////////////////////
  /////// Private ///////
  ///////////////////////

  function updateInternals() {
    siteCount = dataArray.length;
    totalArea = d3Polygon.polygonArea(clippingPolygon);
    halfAverageArea = totalArea / siteCount / 2; // half of the average area of the the clipping polygon
  }

  return _halfAverageArea;
};

export {
  randomInitialPosition,
  pie,
  halfAverageAreaInitialWeight
}