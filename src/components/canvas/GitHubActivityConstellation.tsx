"use client";

// Drafted in a Claude Design session and ported in via steal-ui-style handoff (see
// THIRD_PARTY_NOTICES.md). A force-directed 3D node graph of GitHub commit activity —
// nodes cluster by repo, drift continuously, and repel/attract based on cursor proximity.
//
// Ported from the Claude Design demo: swapped the CDN-loaded THREE + d3-force-3d for this
// project's own `three` dependency and a real `d3-force-3d` npm install, and replaced the
// demo's hardcoded placeholder commits with real data from useGitHubActivity (the same
// hook Terminal.tsx already uses) — falling back to clearly-labeled placeholder commits
// only while the live feed is loading or if it errors, matching Terminal.tsx's own
// fallback convention.

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { forceSimulation, forceManyBody, forceLink, forceCenter } from "d3-force-3d";
import { useGitHubActivity } from "@/lib/useGitHubActivity";
import { useReducedMotion } from "@/lib/useReducedMotion";

const GITHUB_USERNAME = "Pb1323";
const REPO_COLORS = [0x8b5cf6, 0xc4b5fd, 0xd946ef, 0x5b21b6];

// Shown only while the live feed is loading or if it errors — clearly a placeholder, not
// presented as real activity (mirrors Terminal.tsx's SCRIPTED_LINES fallback convention).
const PLACEHOLDER_COMMITS = [
  { repo: "summit-tuition", message: "Add Stripe checkout webhook" },
  { repo: "summit-tuition", message: "Launch to first cohort" },
  { repo: "quickdraw-ai", message: "Train CNN on Quick, Draw! subset" },
  { repo: "portfolio-site", message: "R3F hero scene morph shader" },
];

type Repo = { repo: string; color: number; commits: { message: string }[] };

function groupByRepo(commits: { repo: string; message: string }[]): Repo[] {
  const byRepo = new Map<string, { message: string }[]>();
  commits.forEach((c) => {
    const list = byRepo.get(c.repo) ?? [];
    list.push({ message: c.message });
    byRepo.set(c.repo, list);
  });
  return Array.from(byRepo.entries())
    .slice(0, 4)
    .map(([repo, list], i) => ({ repo, color: REPO_COLORS[i % REPO_COLORS.length], commits: list }));
}

type SimNode = { id: string; x: number; y: number; z: number; vx?: number; vy?: number; vz?: number };

export default function GitHubActivityConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { lines: commits } = useGitHubActivity(GITHUB_USERNAME, 24);
  const reduceMotion = useReducedMotion();
  const [legend, setLegend] = useState<{ name: string; color: string }[]>([]);
  const [usingLive, setUsingLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const source = commits && commits.length > 0 ? commits : PLACEHOLDER_COMMITS;
    setUsingLive(Boolean(commits && commits.length > 0));
    const REPOS = groupByRepo(source);
    setLegend(REPOS.map((r) => ({ name: r.repo, color: "#" + r.color.toString(16).padStart(6, "0") })));

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const clusterRadius = 6;
    type Node = {
      mesh: THREE.Mesh;
      home: THREE.Vector3;
      vel: THREE.Vector3;
      isCenter: boolean;
      center?: THREE.Mesh;
      line?: THREE.Line;
      phase: number;
      freq: number;
      simId: string;
    };
    const nodes: Node[] = [];
    const simNodes: SimNode[] = [];
    const simLinks: { source: string; target: string }[] = [];
    const group = new THREE.Group();
    scene.add(group);

    REPOS.forEach((r, ri) => {
      const angle = (ri / REPOS.length) * Math.PI * 2;
      const cx = Math.cos(angle) * clusterRadius;
      const cy = Math.sin(angle) * clusterRadius * 0.6;
      const cz = (Math.random() - 0.5) * 2;

      const repoSize = 0.18 + r.commits.length * 0.02;
      const repoMesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(repoSize, 1),
        new THREE.MeshBasicMaterial({ color: r.color, transparent: true, opacity: 0.9, wireframe: true })
      );
      repoMesh.position.set(cx, cy, cz);
      group.add(repoMesh);
      const centerId = "c" + ri;
      simNodes.push({ id: centerId, x: cx, y: cy, z: cz });
      nodes.push({
        mesh: repoMesh,
        home: new THREE.Vector3(cx, cy, cz),
        vel: new THREE.Vector3(),
        isCenter: true,
        phase: Math.random() * Math.PI * 2,
        freq: 0.15 + Math.random() * 0.1,
        simId: centerId,
      });

      r.commits.forEach((c, ci) => {
        const a2 = (ci / r.commits.length) * Math.PI * 2 + ri;
        const rad = 1.1 + Math.random() * 0.6;
        const px = cx + Math.cos(a2) * rad;
        const py = cy + Math.sin(a2) * rad;
        const pz = cz + (Math.random() - 0.5) * 1.2;
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 8, 8),
          new THREE.MeshBasicMaterial({ color: r.color, transparent: true, opacity: 0.75 })
        );
        mesh.position.set(px, py, pz);
        group.add(mesh);

        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([repoMesh.position, mesh.position]),
          new THREE.LineBasicMaterial({ color: r.color, transparent: true, opacity: 0.18 })
        );
        group.add(line);

        const nodeId = "c" + ri + "-" + ci;
        simNodes.push({ id: nodeId, x: px, y: py, z: pz });
        simLinks.push({ source: centerId, target: nodeId });
        nodes.push({
          mesh,
          home: new THREE.Vector3(px, py, pz),
          vel: new THREE.Vector3(),
          isCenter: false,
          center: repoMesh,
          line,
          phase: Math.random() * Math.PI * 2,
          freq: 0.3 + Math.random() * 0.3,
          simId: nodeId,
        });
      });
    });

    const sim = forceSimulation(simNodes, 3)
      .force("charge", forceManyBody().strength(-1.2))
      .force(
        "link",
        forceLink(simLinks)
          .id((d) => (d as SimNode).id)
          .distance(1.2)
          .strength(0.6)
      )
      .force("center", forceCenter(0, 0, 0).strength(0.02))
      .alphaDecay(0)
      .velocityDecay(0.35)
      .stop();

    const mouse = new THREE.Vector2(10, 10);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    function onPointerLeave() {
      mouse.set(10, 10);
    }
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    function onResize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf = 0;

    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      const animate = () => {
        raf = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        raycaster.setFromCamera(mouse, camera);
        const intersect = new THREE.Vector3();
        const hit = raycaster.ray.intersectPlane(plane, intersect);

        if (hit && mouse.x < 5) {
          simNodes.forEach((sn) => {
            const dx = sn.x - intersect.x;
            const dy = sn.y - intersect.y;
            const dz = sn.z - intersect.z;
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const radius = 4;
            if (d < radius && d > 0.001) {
              const f = ((radius - d) / radius) * 0.02;
              sn.vx = (sn.vx ?? 0) + (dx / d) * f;
              sn.vy = (sn.vy ?? 0) + (dy / d) * f;
              sn.vz = (sn.vz ?? 0) + (dz / d) * f;
            }
          });
        }
        sim.tick();

        nodes.forEach((n) => {
          const idle = new THREE.Vector3(
            Math.sin(t * n.freq + n.phase) * 0.15,
            Math.cos(t * n.freq * 0.8 + n.phase) * 0.15,
            Math.sin(t * n.freq * 0.6 + n.phase * 2) * 0.15
          );
          const sn = simNodes.find((s) => s.id === n.simId)!;
          const target = new THREE.Vector3(sn.x, sn.y, sn.z).add(idle);

          const spring = target.clone().sub(n.mesh.position).multiplyScalar(0.06);
          n.vel.add(spring).multiplyScalar(0.88);
          n.mesh.position.add(n.vel);

          if (!n.isCenter && n.line && n.center) {
            const pos = n.line.geometry.attributes.position.array as Float32Array;
            pos[0] = n.center.position.x;
            pos[1] = n.center.position.y;
            pos[2] = n.center.position.z;
            pos[3] = n.mesh.position.x;
            pos[4] = n.mesh.position.y;
            pos[5] = n.mesh.position.z;
            n.line.geometry.attributes.position.needsUpdate = true;
          }
        });

        // Slow multi-axis tumble instead of a flat single-axis spin — a real 3D turn, not
        // a merry-go-round.
        group.rotation.y = t * 0.02;
        group.rotation.x = Math.sin(t * 0.07) * 0.12;
        renderer.render(scene, camera);
      };
      animate();
    }

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, [commits, reduceMotion]);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden rounded-2xl border border-hairline bg-black/40">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute left-6 top-6 max-w-[440px] text-ink">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">
          {usingLive ? "Live activity" : "Loading live activity…"}
        </p>
        <p className="mt-1.5 text-lg font-semibold">GitHub Activity Constellation</p>
        {!usingLive && (
          <p className="mt-2.5 font-mono text-xs leading-relaxed text-ink-dim">
            Showing placeholder commits while the live GitHub feed loads.
          </p>
        )}
      </div>
      <div className="absolute bottom-6 left-6 flex max-w-[70%] flex-wrap gap-5">
        {legend.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
            <span className="font-mono text-[11px] text-ink-dim">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
