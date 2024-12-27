export interface ExpiredBatchLog {
  id: number;
  batch_id: number;
  expired_on: Date;
  moved: boolean;
  created_at: Date;
  updated_at: Date;
  batch_name?: string; // Optional, populated from the JOIN query
}
