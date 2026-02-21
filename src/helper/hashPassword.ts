export type SupportedAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export async function hashPassword(
	text: string,
	algorithm: SupportedAlgorithm = "SHA-256",
): Promise<string> {
	const encoded: Uint8Array = new TextEncoder().encode(text);
	const hashBuffer: ArrayBuffer = await crypto.subtle.digest({ name: algorithm }, encoded);
	const bytes: Uint8Array = new Uint8Array(hashBuffer);

	return Array.from(bytes)
		.map((b: number): string => b.toString(16).padStart(2, "0"))
		.join("");
}
