const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Неверный логин или пароль',
  account_locked: 'Аккаунт временно заблокирован. Попробуйте позже',
  rate_limited: 'Слишком много попыток входа. Попробуйте позже',
  validation_error: 'Проверьте введённые данные',
}

export function getAuthErrorMessage(code: string) {
  return AUTH_ERROR_MESSAGES[code]
}
