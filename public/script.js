document.addEventListener("DOMContentLoaded", function () {
    const panoramaContainer = document.getElementById('panorama-container');
    const queryForm = document.getElementById('query-form');
    const satelliteInfo = document.getElementById('satellite-info');
    const satelliteDetails = document.getElementById('satellite-details');
    const satelliteIdInput = document.getElementById('satellite-id');
    const queryButton = document.getElementById('query-button');

    async function querySatellite(id) {
        try {
            const response = await fetch('/graphql', {
                method: 'POST',
                headers: {
                    //'Content-Type': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',

                },
                //body: JSON.stringify({ query: `{ satellite(id: "${id}") { name, orbit, type } }` }),
                body: `id=${id}`
            });
            const data = await response.json();

            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            const satellite = data.data.satellite;
            satelliteDetails.innerHTML = `<p><strong>Name:</strong> ${satellite.name}</p>
                                          <p><strong>Orbit:</strong> ${satellite.orbit}</p>
                                          <p><strong>Type:</strong> ${satellite.type}</p>`;

            satelliteInfo.classList.remove('hidden');
        } catch (error) {
            console.error('Erro ao consultar satélite:', error);
        }
    }

    queryButton.addEventListener('click', function () {
        const satelliteId = satelliteIdInput.value.trim();
        if (satelliteId) {
            querySatellite(satelliteId);
        } else {
            alert('Please enter a Satellite ID.');
        }
    });

    const panorama = new PANOLENS.ImagePanorama('space.jpg');
    const viewer = new PANOLENS.Viewer({ container: panoramaContainer });
    viewer.add(panorama);
});

