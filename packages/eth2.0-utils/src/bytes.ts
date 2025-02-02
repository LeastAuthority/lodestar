import {bytes} from "@chainsafe/eth2.0-types";
import {toBufferLE, toBigIntLE} from "bigint-buffer";
/**
 * Return a byte array from a number or BigInt
 */
export function intToBytes(value: bigint | number, length: number): bytes {
  if (typeof  value === "number" && length <= 6) { // value is a number and length is at most 6 bytes
    const b = Buffer.alloc(length);
    b.writeUIntLE(value, 0, length);
    return b;
  } else { // value is number and is too large, or a BigInt
    value = BigInt(value);
    return toBufferLE(value, length);
  }
}

/**
 * Convert byte array in LE to integer.
 */
export function bytesToInt(value: bytes): number {
  const length = value.length;
  let result = 0;
  for (let i = 0; i < length; i++) {
    result += value[i] * 2 ** (8 * i);
  }
  return result;
}

export function bytesToBigInt(value: bytes): bigint {
  return toBigIntLE(value);
}


export function toHex(buffer: Buffer): string {
  return "0x" + buffer.toString("hex");
}
