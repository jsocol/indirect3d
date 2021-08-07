import { XRGB, ColorToLab, LabToColor } from './indirect3d/color';

const red = XRGB(0xff, 0, 0);
console.log('red as int:', red);

const lab = ColorToLab(red);
console.log('in lab:', lab);

const rered = LabToColor(...lab);
console.log('as int again:', rered);
