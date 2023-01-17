/*
 * @Author: cyy
 * @Date: 2023-01-15 16:49:28
 * @LastEditors: cyy
 * @LastEditTime: 2023-01-17 20:42:45
 * @Description: default
 */
class d3WeightedVoronoiError implements Error{
    public message: any;
    public stack: any;
    public name: any;

    constructor(message: any) {
        this.name = "d3WeightedVoronoiError";
        this.stack = new Error().stack;
        this.message = message;
    }
}

export {
    d3WeightedVoronoiError
}