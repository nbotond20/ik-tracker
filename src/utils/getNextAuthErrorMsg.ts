export const getNextAuthErrorMsg = (error: string | undefined) => {
  if (!error) return null
  if (error === 'OAuthAccountNotLinked') {
    return 'You have not linked your account with this provider! Please sign in using the same provider you used to sign up.'
  }
  if (error === 'EmailSignin') {
    return 'Sending the e-mail with the verification token failed! Check your e-mail address and try again.'
  }
  if (error === 'Verification') {
    return 'The verification token is invalid or has expired! Please try again.'
  }

  return 'An unknown error occurred. Please try again.'
}
