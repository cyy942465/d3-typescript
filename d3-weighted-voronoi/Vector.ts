/*
 * @Author: cyy
 * @Date: 2023-01-15 15:54:15
 * @LastEditors: cyy
 * @LastEditTime: 2023-01-15 15:57:18
 * @Description: default
 */
// Vector

// IN: coordinates x, y, z
class Vector {
    public x: any;
    public y: any;
    public z: any;

    constructor(x: any, y: any, z: any) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public negate() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
    }

    // Normalizes X Y and Z in-place
    public normalize() {
        var lenght = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
        if (lenght > 0) {
            this.x /= lenght;
            this.y /= lenght;
            this.z /= lenght;
        }
    }
}

export {
    Vector
}