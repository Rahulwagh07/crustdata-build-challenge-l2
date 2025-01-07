export function getResponse(input: string): string {
  const lowercaseInput = input.toLowerCase()

  if (lowercaseInput.includes('search for people') || lowercaseInput.includes('find people')) {
    return `You can use the api.crustdata.com/screener/person/search endpoint to search for people. Here's an example curl request to find "people with title engineer at OpenAI in San Francisco":

\`\`\`
curl --location 'https://api.crustdata.com/screener/person/search' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Token $token \\
--data '{
    "filters": [
        {
            "filter_type": "CURRENT_COMPANY",
            "type": "in",
            "value": [
                "openai.com"
            ]
        },
        {
            "filter_type": "CURRENT_TITLE",
            "type": "in",
            "value": [
                "engineer"
            ]
        },
        {    "filter_type": "REGION",
            "type": "in",
            "value": [
                "San Francisco, California, United States"
            ]
        }        
    ],
    "page": 1
}'
\`\`\`

Make sure to replace $token with your actual API token.`
  }

  if (lowercaseInput.includes('region') || lowercaseInput.includes('location')) {
    return `For region values, Crustdata uses a specific list of standardized regions. You can find the complete list of supported regions at this URL: https://crustdata-docs-region-json.s3.us-east-2.amazonaws.com/updated_regions.json

It's recommended to first find the appropriate region from this list and then use the exact values in your search query. This ensures that your API calls will be successful when using the REGION filter.

For example, instead of using "San Francisco", you should use the full standardized format: "San Francisco, California, United States".`
  }

  return "I'm sorry, I don't have specific information about that. Could you please rephrase your question or ask about searching for people or region values?"
}

