export function moveArray(arr: Array<any>, oldIndex: number, newIndex: number) {
  if (newIndex >= arr.length) {
    return arr;
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
}
