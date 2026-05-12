import test from "node:test";
import assert from "node:assert/strict";
import { loginSchema, registerSchema } from "@isms/shared";
import { toRoleEnum, toRoleSlug } from "../src/lib/roles.js";

test("toRoleEnum and toRoleSlug normalize auth roles", () => {
  assert.equal(toRoleEnum("security-personnel"), "SECURITY_PERSONNEL");
  assert.equal(toRoleSlug("SECURITY_PERSONNEL"), "security-personnel");
});

test("registerSchema rejects mismatched passwords", () => {
  const result = registerSchema.safeParse({
    fullName: "Test User",
    email: "test@example.com",
    phoneNumber: "08012345678",
    password: "Password123",
    confirmPassword: "Password321",
    role: "visitor"
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.match(result.error.issues[0]?.message ?? "", /Passwords do not match/);
  }
});

test("loginSchema defaults rememberMe to false", () => {
  const parsed = loginSchema.parse({
    email: "admin@example.com",
    password: "Password123"
  });

  assert.equal(parsed.rememberMe, false);
});