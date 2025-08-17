export function safeProp<T>(
  value: T | null | undefined,
  propName: keyof any,
  fallback?: any
): any {
  // If primitive, just return it
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  // If object-like, try to get the property
  if (value != null && propName in (value as any)) {
    return (value as any)[propName];
  }

  return fallback;
} 