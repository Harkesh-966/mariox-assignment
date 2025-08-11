export interface IDocumentRepository {
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<any | null>;
  listByOwner(ownerId: string): Promise<any[]>;
}
export const DOCUMENT_REPOSITORY = Symbol('DOCUMENT_REPOSITORY');
