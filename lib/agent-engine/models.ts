/** Defaults oficiais da OpenAI configuráveis para instalações self-hosted. */
export const DEFAULT_OPENAI_AGENT_MODEL = 'gpt-5.2';
export const DEFAULT_OPENAI_CLASSIFIER_MODEL = 'gpt-5-mini';

type ModelEnvironment = {
  OPENAI_AGENT_MODEL?: string;
  OPENAI_CLASSIFIER_MODEL?: string;
};

function configuredModel(value: string | undefined, fallback: string): string {
  return value?.trim() || fallback;
}

export function openAiAgentModel(env: ModelEnvironment = process.env as ModelEnvironment): string {
  return configuredModel(env.OPENAI_AGENT_MODEL, DEFAULT_OPENAI_AGENT_MODEL);
}

export function openAiClassifierModel(env: ModelEnvironment = process.env as ModelEnvironment): string {
  return configuredModel(env.OPENAI_CLASSIFIER_MODEL, DEFAULT_OPENAI_CLASSIFIER_MODEL);
}
