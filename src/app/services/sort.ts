// https://stackoverflow.com/a/1689726/6427809
export const sortByProperty = (arr: any[], property: string, descending: boolean): void => {
  arr.sort(function (a, b) {
    var c = a[property].toString()
      , d = b[property].toString()

    if (c == d) {
      return 0;
    }

    return Boolean(descending)
      ? d > c ? 1 : -1
      : d < c ? 1 : -1
  });
}
