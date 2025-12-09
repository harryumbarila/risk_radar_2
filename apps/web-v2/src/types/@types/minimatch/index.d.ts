// Type declarations for minimatch
// This file provides type definitions for minimatch to prevent TypeScript errors
// when minimatch is used as an implicit type library by dependencies

export interface MinimatchOptions {
  debug?: boolean;
  nobrace?: boolean;
  noglobstar?: boolean;
  dot?: boolean;
  noext?: boolean;
  nocase?: boolean;
  nonull?: boolean;
  matchBase?: boolean;
  nocomment?: boolean;
  nonegate?: boolean;
  flipNegate?: boolean;
}

export class Minimatch {
  constructor(pattern: string, options?: MinimatchOptions);
  pattern: string;
  options: MinimatchOptions;
  makeRe(): RegExp | false;
  match(fname: string): boolean;
  matchOne(files: string[], pattern: string[], partial: boolean): boolean;
}

export function minimatch(target: string, pattern: string, options?: MinimatchOptions): boolean;
export default minimatch;




