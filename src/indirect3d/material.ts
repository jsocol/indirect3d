import { I3DColor } from './color';

export interface I3DMaterial {
    Ambient: I3DColor
    Diffuse: I3DColor
    Emissive: I3DColor
    Specular: I3DColor
    Power: number
}
