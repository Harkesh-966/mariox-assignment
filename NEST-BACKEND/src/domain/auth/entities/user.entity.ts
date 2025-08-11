export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public passwordHash: string,
    public roles: string[],
  ) {}

  static create(params: { id: string; name: string; email: string; passwordHash: string; roles?: string[] }) {
    return new User(params.id, params.name, params.email, params.passwordHash, params.roles ?? ['viewer']);
  }

  toPrimitives() {
    return { id: this.id, name: this.name, email: this.email, passwordHash: this.passwordHash, roles: this.roles };
  }

  static fromPrimitives(p: any) {
    return new User(p.id, p.name, p.email, p.passwordHash, p.roles ?? []);
  }
}
