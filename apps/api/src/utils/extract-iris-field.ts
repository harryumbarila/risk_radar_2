import { IrisField } from '../shared/constanst/iris';

export function extractMappedValues(
  fields: IrisField[],
  searchKey: keyof IrisField, // "id" | "uid" | "field"
  searchValues: (string | number)[],
  mappedNames: string[]
): Record<string, string | null> {
  const result: Record<string, string | null> = {};

  if (searchValues.length !== mappedNames.length) {
    throw new Error('searchValues and mappedNames must be the same length');
  }

  for (let i = 0; i < searchValues.length; i++) {
    const valueToFind = searchValues[i];
    const mappedKey = mappedNames[i];

    const foundField = fields.find(
      (f) =>
        f[searchKey] === valueToFind || f[searchKey] === Number(valueToFind)
    );
    result[mappedKey] = foundField?.value ?? '';
  }

  return result;
}
