export type IngestionStatus = 'queued' | 'running' | 'completed' | 'failed';

export class IngestionJob {
	constructor(
		public readonly id: string,
		public documentId: string,
		public status: IngestionStatus,
		public progress: number,
		public paused: boolean,
		public triggeredById: string,
		public metadata?: Record<string, any>,
	) { }
	toPrimitives() { return { id: this.id, documentId: this.documentId, status: this.status, progress: this.progress, metadata: this.metadata ?? {}, paused: this.paused,triggeredById: this.triggeredById }; }
	static fromPrimitives(p: any) { return new IngestionJob(p.id, p.documentId, p.status, p.progress, p.metadata, p.paused, p.triggeredById); }
}
