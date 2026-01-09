import { supabase } from "./supabase";

const API_BASE_URL = import.meta.env.VITE_API_URL;

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${session?.access_token}`,
    "Content-Type": "application/json",
  };
}

export const api = {
  // Identity
  async getProfile() {
    const headers = await getAuthHeaders();
    // Cache busting parameters to ensure fresh data after deletions
    const timestamp = new Date().getTime();
    const res = await fetch(`${API_BASE_URL}/users/me?t=${timestamp}`, {
      headers: {
        ...headers,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return res.json();
  },

  async syncProfile(referralCode?: string) {
    const headers = await getAuthHeaders();
    const url = referralCode
      ? `${API_BASE_URL}/users/sync?referral_code=${referralCode}`
      : `${API_BASE_URL}/users/sync`;
    const res = await fetch(url, { method: "POST", headers });
    return res.json();
  },

  // Videos
  async generateVideo(prompt: string, quality: "sd" | "hq" = "sd") {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/vibes/generate`, {
      method: "POST",
      headers,
      body: JSON.stringify({ prompt, quality }),
    });
    return res.json();
  },

  async getVideoStatus(videoId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/vibes/${videoId}`, { headers });
    return res.json();
  },

  async deleteVideo(videoId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/vibes/${videoId}`, {
      method: "DELETE",
      headers,
    });
    return res.json();
  },

  // Referrals
  async getReferralStats() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/referrals/me`, { headers });
    return res.json();
  },

  // Payments
  async createOrder(planId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${API_BASE_URL}/payments/create-order?plan_id=${planId}`,
      {
        method: "POST",
        headers,
      }
    );
    return res.json();
  },

  async verifyPayment(orderId: string, paymentId: string, signature: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        order_id: orderId,
        payment_id: paymentId,
        signature,
      }),
    });
    return res.json();
  },

  // Storage
  async getUploadUrl(filename: string, contentType: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${API_BASE_URL}/storage/upload-url?filename=${filename}&content_type=${contentType}`,
      { headers }
    );
    return res.json();
  },

  async uploadFile(file: File) {
    const headers = await getAuthHeaders();
    // Remove Content-Type from headers as fetch will set it for FormData
    const { "Content-Type": _, ...restHeaders } = headers;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/storage/upload`, {
      method: "POST",
      headers: restHeaders,
      body: formData,
    });

    const data = await res.json();
    if (data.status === "error") throw new Error(data.message);
    return data.data; // Includes file_url
  },
};
