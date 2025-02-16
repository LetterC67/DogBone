export async function getOriginOSAPY() {
  const URL = 'https://api.originprotocol.com/api/v2/os/apr/trailing/14';
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return Number(data.apy);
}
