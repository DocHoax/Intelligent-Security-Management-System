import test from "node:test";
import assert from "node:assert/strict";
import { canAccessRole, roleHierarchy } from "../../../packages/shared/src/permissions.js";

test("role hierarchy grants access downward", () => {
  assert.equal(canAccessRole("admin", "staff"), true);
  assert.equal(canAccessRole("staff", "admin"), false);
});

test("role hierarchy ranks admin highest", () => {
  assert.equal(roleHierarchy.admin > roleHierarchy.visitor, true);
});