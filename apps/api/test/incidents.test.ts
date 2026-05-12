import test from "node:test";
import assert from "node:assert/strict";
import { normalizeIncidentStatus } from "../src/lib/incidents.js";

test("normalizeIncidentStatus uppercases and underscores values", () => {
  assert.equal(normalizeIncidentStatus("in-review"), "IN_REVIEW");
  assert.equal(normalizeIncidentStatus("resolved"), "RESOLVED");
});