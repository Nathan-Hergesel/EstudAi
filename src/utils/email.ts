export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export const normalizeEmail = (value: string): string => value.trim().toLowerCase();

export const parseEmailDraft = (
  draft: string,
  requireAtLeastOne: boolean
): { emails: string[]; error?: string } => {
  const candidates = draft.split(/[\s,;]+/).map(normalizeEmail).filter(Boolean);

  if (candidates.length === 0) {
    return requireAtLeastOne
      ? { emails: [], error: 'Digite pelo menos um e-mail válido para adicionar.' }
      : { emails: [] };
  }

  const invalid = candidates.find((email) => !EMAIL_REGEX.test(email));
  if (invalid) return { emails: [], error: `E-mail inválido: ${invalid}` };

  return { emails: candidates };
};
