export async function refreshToken() {
  if (localStorage.getItem("refreshToken") == null) {
    alert("Failed to refresh session. Please sign in again.");
    window.location.href = "/signin";
  }
  const refreshResponse = await fetch("/api/users/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
    },
    body: JSON.stringify({
      refreshToken: localStorage.getItem("refreshToken"),
    }),
  });
  if (refreshResponse.ok) {
    const refreshData = await refreshResponse.json();
    localStorage.setItem("authToken", refreshData.accessToken);
    //alert("Session refreshed. Please try reloading or saving again.");
  } else {
    alert("Failed to refresh session. Please sign in again.");
    window.location.href = "/signin";
  }
  return refreshResponse;
}
