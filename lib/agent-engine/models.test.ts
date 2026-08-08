import { describe, expect, it } from 'vitest';

import { openAiAgentModel, openAiClassifierModel } from './models';

describe('modelos OpenAI configuráveis', () => {
  it('usa os defaults oficiais seguros quando o ambiente não define modelos', () => {
    expect(openAiAgentModel({})).toBe('gpt-5.2');
    expect(openAiClassifierModel({})).toBe('gpt-5-mini');
  });

  it('aceita a configuração explícita da instalação', () => {
    expect(openAiAgentModel({ OPENAI_AGENT_MODEL: 'gpt-5.2' })).toBe('gpt-5.2');
    expect(openAiClassifierModel({ OPENAI_CLASSIFIER_MODEL: 'gpt-5-mini' })).toBe('gpt-5-mini');
  });
});
