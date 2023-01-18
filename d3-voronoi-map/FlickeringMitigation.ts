/*
 * @Author: cyy
 * @Date: 2023-01-17 20:41:36
 * @LastEditors: cyy
 * @LastEditTime: 2023-01-17 20:55:02
 * @Description: default
 */
import { direction } from "./caculateGriwthChangeWeights";
import { generateGrowthChangeWeights } from "./caculateGriwthChangeWeights";
import { computeGrowthChangeWeightsSum } from "./caculateGriwthChangeWeights";

let DEFAULT_LENGTH = 10;

class FlickeringMitigation {
    public growthChangesLength: any;
    public totalAvailableArea: any;
    public lastAreaError: any;
    public lastGrowth: any;
    public growthChanges: any[];
    public growthChangeWeights: any;
    public growthChangeWeightsSum: any;

    constructor() {
        /////// Inputs ///////
        this.growthChangeWeights = DEFAULT_LENGTH;
        this.totalAvailableArea = NaN;
        //begin: internals
        this.lastAreaError = NaN;
        this.lastGrowth = NaN;
        this.growthChanges = [];
        //used to make recent changes weighter than older changes
        this.growthChangeWeights = generateGrowthChangeWeights(this.growthChangesLength);
        this.growthChangeWeightsSum = computeGrowthChangeWeightsSum(this.growthChangeWeights);
        //end: internals
    }

    public reset = function () {
        this.lastAreaError = NaN;
        this.lastGrowth = NaN;
        this.growthChanges = [];
        this.growthChangesLength = DEFAULT_LENGTH;
        this.growthChangeWeights = generateGrowthChangeWeights(this.growthChangesLength);
        this.growthChangeWeightsSum = computeGrowthChangeWeightsSum(this.growthChangeWeights);
        this.totalAvailableArea = NaN;
    
        return this;
    };

    public clear = function () {
        this.lastAreaError = NaN;
        this.lastGrowth = NaN;
        this.growthChanges = [];
    
        return this;
    };

    public length = function (_) {
        if (!arguments.length) { return this.growthChangesLength; }
    
        if (parseInt(_)>0) {
          this.growthChangesLength = Math.floor(parseInt(_));
          this.growthChangeWeights = generateGrowthChangeWeights(this.growthChangesLength);
          this.growthChangeWeightsSum = computeGrowthChangeWeightsSum(this.growthChangeWeights);
        } else {
          console.warn("FlickeringMitigation.length() accepts only positive integers; unable to handle "+_);
        }
        return this;
    };

    public totalArea = function (_) {
        if (!arguments.length) { return this.totalAvailableArea; }
    
        if (parseFloat(_)>0) {
          this.totalAvailableArea = parseFloat(_);
        } else {
          console.warn("FlickeringMitigation.totalArea() accepts only positive numbers; unable to handle "+_);
        }
        return this;
    };

    public add = function (areaError) {
        let secondToLastAreaError, secondToLastGrowth;
    
        secondToLastAreaError = this.lastAreaError;
        this.lastAreaError = areaError;
        if (!isNaN(secondToLastAreaError)) {
          secondToLastGrowth = this.lastGrowth;
          this.lastGrowth = direction(this.lastAreaError, secondToLastAreaError);
        }
        if (!isNaN(secondToLastGrowth)) {
          this.growthChanges.unshift(this.lastGrowth!=secondToLastGrowth);
        }
    
        if (this.growthChanges.length>this.growthChangesLength) {
          this.growthChanges.pop();
        }
        return this;
    };

    public ratio = function () {
        let weightedChangeCount = 0;
        let ratio;
    
        if (this.growthChanges.length < this.growthChangesLength) { return 0; }
        if (this.lastAreaError > this.totalAvailableArea/10) { return 0; }
    
        for(let i=0; i<this.growthChangesLength; i++) {
          if (this.growthChanges[i]) {
            weightedChangeCount += this.growthChangeWeights[i];
          }
        }
    
        ratio = weightedChangeCount/this.growthChangeWeightsSum;
    
        /*
        if (ratio>0) {
          console.log("flickering mitigation ratio: "+Math.floor(ratio*1000)/1000);
        }
        */
    
        return ratio;
    };
}

export {
    FlickeringMitigation
}