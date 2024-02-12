import * as React from "react";
interface Props {
    arrows: Arrow[];
    defaultArrowStyle?: Partial<ArrowStyle>;
    children: React.ReactNode;
}
export type Point = [number, number];
export interface DirectedPoint {
    point: Point;
    direction: Point;
}
export interface Arrows {
    arrows: Arrow[];
    defaultArrowStyle: ArrowStyle;
}
export interface Value {
    value: number;
    unit: "px" | "%";
}
export interface ExtraPoint {
    x: Value;
    y: Value;
    absolute: boolean;
}
export interface MidPointSpec {
    curved: boolean;
    points: ExtraPoint[] | ((from: DirectedPoint, to: DirectedPoint) => ExtraPoint[]);
}
export interface HeadPointSpec {
    size: number;
    adjust: number;
    hollow: boolean;
    svgPath: string;
}
export type ArrowStyleAlias = "none" | "clipClockwise" | "clipCounterclockwise" | "arcClockwise" | "arcCounterclockwise" | "corners" | "smooth";
export type HeadStyleAlias = "default" | "hollow" | "filledDiamond" | "diamond" | "disk" | "circle" | "none";
export interface ArrowStyle {
    width: number;
    color: string;
    arrow: ArrowStyleAlias | MidPointSpec;
    head: HeadStyleAlias;
}
export type PosXLocation = "left" | "middle" | "right";
export type PosYLocation = "top" | "middle" | "bottom";
export interface ArrowLocation {
    id: string;
    posX?: PosXLocation;
    posY?: PosYLocation;
}
export interface Arrow {
    from: string | ArrowLocation;
    to: string | ArrowLocation;
    style?: Partial<ArrowStyle>;
}
export interface PathSpec {
    points: Point[];
    curved: boolean;
    width: number;
    color: string;
    headPoints: HeadPointSpec | null;
}
export declare const ArrowArea: ({ arrows, children, defaultArrowStyle, }: Props) => React.JSX.Element;
export default ArrowArea;
