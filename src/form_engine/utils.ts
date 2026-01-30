export function getIn(obj: Record<string, unknown>, path: string) {
  if (!path) return undefined;
  const parts = path.split(".");
  let cur: unknown = obj;

  for (const p of parts) {
    if (cur == null) return undefined;

    const num = Number(p);
    const isIndex = !Number.isNaN(num) && Number.isFinite(num);

    if (isIndex) {
      if (!Array.isArray(cur)) return undefined;
      cur = (cur as unknown[])[num];
    } else {
      if (typeof cur === "object" && cur !== null) {
        cur = (cur as Record<string, unknown>)[p];
      } else {
        return undefined;
      }
    }
  }

  return cur;
}

export function setIn(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
) {
  const parts = path.split(".");
  const last = parts.pop();
  if (!last) return obj;

  let cur: unknown = obj;

  for (const p of parts) {
    const num = Number(p);
    const isIndex = !Number.isNaN(num) && Number.isFinite(num);

    if (isIndex) {
      // ensure current is an array
      if (!Array.isArray(cur)) {
        // create array on parent if possible
        if (typeof cur === "object" && cur !== null) {
          (cur as Record<string, unknown>)[p] = [];
          cur = (cur as Record<string, unknown>)[p];
        } else {
          // cannot traverse
          return obj;
        }
      }

      // ensure element exists
      if ((cur as unknown[])[num] == null) {
        (cur as unknown[])[num] = {};
      }

      cur = (cur as unknown[])[num];
    } else {
      if (cur == null || typeof cur !== "object") {
        return obj;
      }

      if ((cur as Record<string, unknown>)[p] == null) {
        (cur as Record<string, unknown>)[p] = {};
      }

      cur = (cur as Record<string, unknown>)[p];
    }
  }

  const lastNum = Number(last);
  const lastIsIndex = !Number.isNaN(lastNum) && Number.isFinite(lastNum);

  if (lastIsIndex) {
    if (!Array.isArray(cur)) {
      if (typeof cur === "object" && cur !== null) {
        (cur as Record<string, unknown>)[last] = [];
        cur = (cur as Record<string, unknown>)[last];
      } else {
        return obj;
      }
    }
    (cur as unknown[])[lastNum] = value;
  } else {
    if (cur == null || typeof cur !== "object") return obj;
    (cur as Record<string, unknown>)[last] = value;
  }

  return obj;
}
