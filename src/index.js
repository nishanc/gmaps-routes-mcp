import { WorkerEntrypoint } from 'cloudflare:workers'
import { ProxyToSelf } from 'workers-mcp'

export default class GMapsMCP extends WorkerEntrypoint {
	/**
	 * Function to get a route using Google Maps Directions API.
	 * @param {string} origin The starting address for the route.
	 * @param {string} destination The ending address for the route.
	 * @returns {Object} The result of the route request.
	 */
	async getRoute(origin, destination) {
		const baseUrl = 'https://routes.googleapis.com';
		const apiKey = await this.env.GOOGLE_MAPS_PLATFORM_API_KEY.get();
		try {
			// Construct the request body
			const body = JSON.stringify({
				origin: { address: origin },
				destination: { address: destination },
				languageCode: 'en-US',
			});

			// Set up headers for the request
			const headers = {
				'X-Goog-FieldMask': '*',
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': apiKey
			};

			// Perform the fetch request
			const response = await fetch(`${baseUrl}/directions/v2:computeRoutes`, {
				method: 'POST',
				headers,
				body
			});

			// Check if the response was successful
			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error from Maps API!', {
					status: response.status,
					statusText: response.statusText,
					errorData: errorData
				});
				throw new Error(`Maps API Error (${response.status}): ${JSON.stringify(errorData)}`);
			}

			// Parse and return the response data
			const data = await response.json();
			return JSON.stringify(data);
		} catch (error) {
			console.error('Error getting route:', error);
			return { error: 'An error occurred while getting the route.' };
		}
	}

  /**
   * @ignore
   **/
  async fetch(request) {
    return new ProxyToSelf(this).fetch(request)
  }
}
