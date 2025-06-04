import {
  parseAbiParameters,
  encodeAbiParameters,
  decodeAbiParameters,
  Hex,
} from "viem";

/**
 * Encode an array of values according to an ABI schema string.
 *
 * @example
 *   const schema = "string name, uint256 amount";
 *   const encoded = encodeData(schema, ["Alice", 123]);
 *   // encoded => "0x..."
 */
export function encodeData(schema: string, values: unknown[]): Hex {
  try {
    const abiParams = parseAbiParameters(schema);
    if (!abiParams) {
      throw new Error(`Failed to parse schema: "${schema}"`);
    }

    return encodeAbiParameters(abiParams, values);
  } catch (err) {
    console.log(err);
    return "0x";
  }
}

/**
 * Decode ABI-encoded data into an object keyed by parameter name.
 *
 * @example
 *   const schema = "string name, uint256 amount";
 *   const encoded = encodeData(schema, ["Alice", 123]);
 *   const result = decodeData(schema, encoded);
 *   // result => { name: 'Alice', amount: 123n }  // notice the BigInt
 */
export function decodeData(schema: string, data: Hex): Record<string, unknown> {
  try {
    const abiParams = parseAbiParameters(schema);
    if (!abiParams) {
      throw new Error(`Failed to parse schema: "${schema}"`);
    }

    const decodedValues = decodeAbiParameters(abiParams, data);

    // Convert the array of values into an object { paramName: value }
    return abiParams.reduce(
      (acc, param, i) => {
        if (param.name)
          acc[param.name] =
            typeof decodedValues[i] === "bigint"
              ? decodedValues[i].toString()
              : decodedValues[i];
        return acc;
      },
      {} as Record<string, unknown>
    );
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return {};
  }
}
