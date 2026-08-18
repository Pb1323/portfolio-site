// d3-force-3d ships no type declarations (checked: no @types/d3-force-3d package exists).
// Minimal ambient typing for the exact surface GitHubActivityConstellation.tsx uses.
declare module "d3-force-3d" {
  export interface SimulationNodeDatum3D {
    id?: string;
    x?: number;
    y?: number;
    z?: number;
    vx?: number;
    vy?: number;
    vz?: number;
  }

  export interface SimulationLinkDatum3D {
    source: string | SimulationNodeDatum3D;
    target: string | SimulationNodeDatum3D;
  }

  export interface Simulation3D {
    force(name: string, force: unknown): Simulation3D;
    alphaDecay(value: number): Simulation3D;
    velocityDecay(value: number): Simulation3D;
    stop(): Simulation3D;
    tick(): Simulation3D;
  }

  export function forceSimulation(nodes: SimulationNodeDatum3D[], numDimensions?: number): Simulation3D;
  export function forceManyBody(): { strength(value: number): unknown };
  export function forceLink(links: SimulationLinkDatum3D[]): {
    id(accessor: (d: SimulationNodeDatum3D) => string): {
      distance(value: number): { strength(value: number): unknown };
    };
    distance(value: number): { strength(value: number): unknown };
  };
  export function forceCenter(x?: number, y?: number, z?: number): { strength(value: number): unknown };
}
