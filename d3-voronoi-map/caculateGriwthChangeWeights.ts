/*
 * @Author: cyy
 * @Date: 2023-01-17 20:44:30
 * @LastEditors: cyy
 * @LastEditTime: 2023-01-17 20:45:59
 * @Description: fm一个文件夹
 */
function direction(h0, h1) {
    return (h0 >= h1)? 1 : -1;
}

function generateGrowthChangeWeights(length) {
    let initialWeight = 3;   // a magic number
    let weightDecrement = 1; // a magic number
    let minWeight = 1;

    let weightedCount = initialWeight;
    let growthChangeWeights:any[] = [];

    for (let i=0; i<length; i++) {
      growthChangeWeights.push(weightedCount);
      weightedCount -= weightDecrement;
      if (weightedCount<minWeight) { weightedCount = minWeight; }
    }
    return growthChangeWeights;
}

function computeGrowthChangeWeightsSum (growthChangeWeights) {
    let growthChangeWeightsSum = 0;
    for (let i=0; i<growthChangeWeights.length; i++) {
      growthChangeWeightsSum += growthChangeWeights[i];
    }
    return growthChangeWeightsSum;
}

export {
    direction,
    generateGrowthChangeWeights,
    computeGrowthChangeWeightsSum
}