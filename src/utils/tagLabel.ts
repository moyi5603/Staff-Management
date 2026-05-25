export function normalizeTagLabel(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

/** 匹配标签库已有名称则返回规范名；否则返回规范化后的自定义文案 */
export function labelForEmployeeTag(rawName: string, catalogNames: string[]): string | null {
  const trimmed = normalizeTagLabel(rawName);
  if (!trimmed) return null;
  const fromCatalog = catalogNames.find((n) => n.toLowerCase() === trimmed.toLowerCase());
  return fromCatalog ?? trimmed;
}
