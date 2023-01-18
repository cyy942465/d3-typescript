/*
 * @Author: cyy
 * @Date: 2023-01-17 21:19:04
 * @LastEditors: cyy
 * @LastEditTime: 2023-01-17 21:20:54
 * @Description: default
 */
class d3VoronoiMapError implements Error{
    public message: string;
    public stack?: string | undefined;
    public name: string;

    constructor (message) {
        this.message = message;
        this.stack = new Error().stack;
        this.name = 'd3VoronoiMapError';
    }
}

export {
    d3VoronoiMapError
}