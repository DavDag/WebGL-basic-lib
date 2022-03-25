/** @author: Davide Risaliti davdag24@gmail.com */

import {Vec2, Vec3} from "../all.js";

/*
 * Retrieve a lines array of indexes from triangles list and vertexes.
 * 
 * @params {list of Vec3} vertexes the list of vertexes
 * @params {list of Vec3} triangles the list of triangles
 * 
 * @return {list of Vec2} the lines
 */
export function LinesFromTriangles(vertexes, triangles) {
  const lines = [];
  const cache2 = new Set();

  triangles.forEach((face) => {
    // Add lines
    [[face.x, face.y], [face.y, face.z], [face.z, face.x]].forEach(([a, b]) => {
      // Compute key
      const vecA = vertexes[a];
      const vecB = vertexes[b];
      const key = Math.max(a, b) + "_" + Math.min(a, b);
      
      // Check if line is in cache
      if (!cache2.has(key)) {
        lines.push(new Vec2(a, b));
        cache2.add(key);
      }
    });
  });

  return lines;
}

/*
 * Retrieve a tangents array from triangles list, uvs and vertexes.
 * 
 * @params {list of Vec3} vertexes the list of vertexes
 * @params {list of Vec2} uvs the list of uvs
 * @params {list of Vec3} triangles the list of triangles
 * 
 * @return {list of Vec3} the tangents
 */
export function TangentsFromTriangles(vertexes, uvs, triangles) {
  // Create array filled with zeros
  const tangents = new Array(vertexes.length).fill(null).map((_) => Vec3.Zeros());

  // Iterate through faces
  triangles.forEach((face) => {
    // Retrieve face data
    const [i0, i1, i2] = face.values;
    const v0 = vertexes[i0];
    const v1 = vertexes[i1];
    const v2 = vertexes[i2];
    const n0 = uvs[i0];
    const n1 = uvs[i1];
    const n2 = uvs[i2];

    // Compute tangent
    const edge1 = v1.clone().sub(v0);
    const edge2 = v2.clone().sub(v0);

    const deltaU1 = n1.x - n0.x;
    const deltaV1 = n1.y - n0.y;
    const deltaU2 = n2.x - n0.x;
    const deltaV2 = n2.y - n0.y;

    const f = 1.0 / (deltaU1 * deltaV2 - deltaU2 * deltaV1);

    const tangent = Vec3.Zeros();
    tangent.x = f * (deltaV2 * edge1.x - deltaV1 * edge2.x);
    tangent.y = f * (deltaV2 * edge1.y - deltaV1 * edge2.y);
    tangent.z = f * (deltaV2 * edge1.z - deltaV1 * edge2.z);

    const t0 = tangents[i0];
    const t1 = tangents[i1];
    const t2 = tangents[i2];

    t0.add(tangent);
    t1.add(tangent);
    t2.add(tangent);
  });

  return tangents;
}