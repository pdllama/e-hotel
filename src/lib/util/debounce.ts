export function debounce<T>(
  fn: (val: T) => void,
  timeout: number = 750
) {
  let timer: ReturnType<typeof setTimeout>;

  return (value: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(value), timeout);
  };
}