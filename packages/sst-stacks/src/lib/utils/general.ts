export function prefixObjectKeys(object: Record<string, unknown>, prefix: string) {
  return Object.entries(object).reduce(
    (acc, [key, value]) => ({ ...acc, [`${prefix}_${key}`]: value }),
    {}
  );
}
