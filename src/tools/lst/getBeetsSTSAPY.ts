export async function getBeetsSTSAPY() {
  const query = `
  query {
    stsGetGqlStakedSonicData {
      stakingApr
    }
  }
`;

  const response = await fetch('https://backend-v3.beets-ftm-node.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return Number(data.data.stsGetGqlStakedSonicData.stakingApr) * 100;
}
