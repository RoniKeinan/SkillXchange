export default function isTokenValid(token: string): boolean {
    try {
      const [, payload] = token.split(".");
      const decoded = JSON.parse(atob(payload)) as { exp: number };
  
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp > now) return true; // Check if token is still valid
      else {
        localStorage.clear();
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  