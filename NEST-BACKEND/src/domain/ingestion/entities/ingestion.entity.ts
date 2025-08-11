export type IngestionStatus = 'queued' | 'running' | 'completed' | 'failed';

export class IngestionJob {
	constructor(
		public readonly id: string,
		public documentId: string,
		public status: IngestionStatus,
		public progress: number,
		public metadata?: Record<string, any>,
	) { }
	toPrimitives() { return { id: this.id, documentId: this.documentId, status: this.status, progress: this.progress, metadata: this.metadata ?? {} }; }
	static fromPrimitives(p: any) { return new IngestionJob(p.id, p.documentId, p.status, p.progress, p.metadata); }
}
