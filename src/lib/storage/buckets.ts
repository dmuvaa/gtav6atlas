export const STORAGE_BUCKETS = {
  entityMedia: "entity-media",
  mapAssets: "map-assets",
  submissionEvidence: "submission-evidence",
  avatars: "avatars",
} as const;

export type StorageBucketId =
  (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export const BUCKET_META: Record<
  StorageBucketId,
  { public: boolean; maxBytes: number; label: string }
> = {
  "entity-media": {
    public: true,
    maxBytes: 10 * 1024 * 1024,
    label: "Entity media",
  },
  "map-assets": {
    public: true,
    maxBytes: 20 * 1024 * 1024,
    label: "Map assets",
  },
  "submission-evidence": {
    public: false,
    maxBytes: 10 * 1024 * 1024,
    label: "Submission evidence",
  },
  avatars: {
    public: true,
    maxBytes: 2 * 1024 * 1024,
    label: "Avatars",
  },
};