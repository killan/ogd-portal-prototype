import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  // https://graphicdesign.stackexchange.com/a/83867
  // Returns a single rgb color interpolation between given rgb color
  // based on the factor given; via https://codepen.io/njmcode/pen/axoyD?editors=0010
  interpolateColor(color1: number[], color2: number[], factor: number = .5) {
    let result = color1.slice();
    for (var i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
  };
  // My function to interpolate between two colors completely, returning an array
  interpolateColors(color1: string, color2: string, steps: number) {
    let stepFactor: number = 1 / (steps - 1)
    let interpolatedColorArray: any[] = [];

    let colorA: number[] = color1.match(/\d+/g)!.map(Number);
    let colorB: number[] = color2.match(/\d+/g)!.map(Number);

    for (var i = 0; i < steps; i++) {
      interpolatedColorArray.push(this.interpolateColor(colorA, colorB, stepFactor * i));
    }

    return interpolatedColorArray;
  }
}
