export class Document {
  constructor(
    public readonly id: string,
    public ownerId: string,
    public title: string,
    public description?: string,
    public url?: string,
    public createdAt?: Date,
  ) {}
  static fromPrimitives(p: any) {
    return new Document(p.id, p.ownerId, p.title, p.description, p.url, p.createdAt ? new Date(p.createdAt) : undefined);
  }
  toPrimitives() {
    return { id: this.id, ownerId: this.ownerId, title: this.title, description: this.description, url: this.url, createdAt: this.createdAt?.toISOString() };
  }
}
