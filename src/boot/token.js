export default async ({ Vue, store }) => {
  await store.dispatch('auth/loginAttempt', localStorage.getItem('token'))
};
