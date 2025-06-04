export function extractErrorReason(errorMessage: string): string | undefined {
  console.log(errorMessage);

  // First, try to extract reason after 'reason:'
  const reasonMatch = errorMessage.match(/reason:\s*\n([^\n]+)/i);
  if (reasonMatch && reasonMatch[1]) {
    return reasonMatch[1].trim();
  }

  // Fallback to previous pattern
  const pattern = /Error:\s+([^(]+)\(.*?\)\s+\((.*?)\)/;
  const match = errorMessage.match(pattern);

  return match ? (match[1]?.trim() ?? "") : undefined;
}
