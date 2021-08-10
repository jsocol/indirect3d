import { I3DColor } from "./color";
import { I3DXVec } from "./matrix";
export declare enum I3DLightType {
    Point = 1,
    Spot = 2,
    Directional = 3
}
export declare class I3DLight {
    type: I3DLightType;
    diffuse?: I3DColor;
    specular?: I3DColor;
    ambient?: I3DColor;
    position?: I3DXVec;
    direction?: I3DXVec;
    atten0: number;
    atten1: number;
    atten2: number;
    constructor(type: I3DLightType);
}
//# sourceMappingURL=lights.d.ts.map