import { sum } from "$lib/sum";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const numbers = new Float32Array([1.5, 2.5, 3.5, 7.5]);
  return {
    total: sum(numbers)
  };
};
