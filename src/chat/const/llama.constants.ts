/**
 * Enum for Llama configuration parameters.
 *
 * This enum stores specific configuration values related to Llama usage in the
 * application, helping in maintaining consistency and ease of updates.
 *
 * @enum llama
 *
 * @member LLAMA_MODEL_NAME - Identifier for the specific Llama model version used.
 * @member LLAMA_TEMPERATURE - Controls the randomness in the model's responses,
 *                              with a higher value resulting in more random responses.
 */
export enum llama {
  LLAMA_MODEL_NAME = "llama3:8b",
  LLAMA_TEMPERATURE = 0.8,
}

export enum vercelRoles {
  user = "user",
  assistant = "assistant",
}
