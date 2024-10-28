import { FFIType, dlopen, suffix } from "bun:ffi";

// Export sum function from Rust
const { symbols: { sum: FFISum } } = dlopen(`libsum.${suffix}`, {
  sum: {
    args: [FFIType.ptr, FFIType.u64],
    returns: FFIType.f32,
  },
});

// Wrapper for sum function
export const sum = (numbers: Float32Array) => FFISum(numbers, numbers.length);
