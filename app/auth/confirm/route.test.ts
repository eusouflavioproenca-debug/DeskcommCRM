import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const verifyOtp = vi.fn();
const ensureTenantForUser = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { verifyOtp } }),
}));
vi.mock("@/lib/auth/provision", () => ({ ensureTenantForUser }));
vi.mock("@/lib/audit", () => ({ audit: vi.fn() }));
vi.mock("@/lib/supabase/cookie-secure", () => ({ cookieSecure: () => true }));

const { GET } = await import("./route");

describe("GET /auth/confirm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifyOtp.mockResolvedValue({
      data: { user: { id: "user-1", email: "admin@acme.test", user_metadata: {} } },
      error: null,
    });
    ensureTenantForUser.mockResolvedValue({
      provisioned: true,
      organizationId: "org-1",
    });
  });

  it("define a organização provisionada como ativa antes de abrir o onboarding", async () => {
    const request = new NextRequest(
      "https://crm.example.test/auth/confirm?token_hash=valid&type=signup",
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://crm.example.test/onboarding/welcome");
    expect(response.cookies.get("active_org")?.value).toBe("org-1");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("SameSite=strict");
    expect(response.headers.get("set-cookie")).toContain("Secure");
  });

  it("também restaura como ativa uma organização já existente", async () => {
    ensureTenantForUser.mockResolvedValue({
      provisioned: false,
      organizationId: "org-existing",
    });
    const request = new NextRequest(
      "https://crm.example.test/auth/confirm?token_hash=valid&type=signup",
    );

    const response = await GET(request);

    expect(response.cookies.get("active_org")?.value).toBe("org-existing");
  });
});
