declare module 'yeoman-environment/lib/resolver' {
  export function findGeneratorsIn(searchPaths: string[], pattern?: string): string[];
  export function getNpmPaths(localOnly?: boolean): string[];
}