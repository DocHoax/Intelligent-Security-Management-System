import test from "node:test";
import assert from "node:assert/strict";
import { buildEvidenceUrl } from "../src/lib/uploads.js";

test("buildEvidenceUrl sanitizes the filename", () => {
  const originalNow = Date.now;
  Date.now = () => 1234567890;

  const url = buildEvidenceUrl("My Evidence File.mp4");

  Date.now = originalNow;

  assert.match(url, /^\/uploads\/1234567890-my-evidence-file\.mp4$/);
});