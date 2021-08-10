import {I3DColor} from "./color"
import {I3DXVec} from "./matrix"

export enum I3DLightType {
    Point = 1,
    Spot,
    Directional,
};

export class I3DLight {
    type: I3DLightType
    diffuse?: I3DColor 
    specular?: I3DColor
    ambient?: I3DColor
    position?: I3DXVec
    direction?: I3DXVec
    atten0: number = 1
    atten1: number = 0
    atten2: number = 0

    constructor(type: I3DLightType) {
        this.type = type;
    }
}
