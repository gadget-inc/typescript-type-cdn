export function parsePackageVersion(input: string) {
  const atIndex = input.lastIndexOf("@");

  if (atIndex === -1) {
    throw new Error('Invalid input format: Missing "@"');
  }

  const packageName = input.slice(0, atIndex);
  const version = input.slice(atIndex + 1);

  if (!packageName || !version) {
    throw new Error("Invalid input format: Missing package name or version");
  }

  return [packageName, version];
}
