export const createObject = (
  fields: string[],
  value: string | number | boolean | boolean[] | string[]
) => {
  const reducer: any = (
    acc: string,
    item: string,
    index: number,
    arr: string[]
  ) => ({
    [item]: index + 1 < arr.length ? acc : value,
  });
  return fields.reduceRight(reducer, {});
};
