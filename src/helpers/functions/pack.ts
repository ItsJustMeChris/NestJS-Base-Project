import { isArray } from 'class-validator';

export class Bits {
  private current = 0;

  pack(add: number | number[]) {
    if (isArray(add)) {
      (<number[]>add).forEach((n) => (this.current |= n));
      return this.current;
    }
    return (this.current |= <number>add);
  }

  unpack(remove: number) {
    return (this.current -= remove);
  }

  has(want: number) {
    return this.current & want;
  }

  value() {
    return this.current;
  }
}
