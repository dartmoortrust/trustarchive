interface Locals {
  session: any; // Define the type of session as needed
}

export function load({ locals }: { locals: Locals }) {
  return {
    session: locals.session,
  };
}
