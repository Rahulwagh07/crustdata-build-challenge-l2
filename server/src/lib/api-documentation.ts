export const CRUSTDATA_API_DOCS = {
  company: {
    enrichment: {
      description: "Enrich company data with detailed information",
      method: "POST",
      endpoint: "https://api.crustdata.com/search/enrichment",
      parameters: {
        domain: {
          type: "string",
          required: true,
          example: "openai.com"
        }
      },
      credits_cost: 3,
      example_request: {
        domain: "openai.com"
      }
    },
    discovery: {
      description: "Screen and discover companies based on criteria",
      method: "POST",
      endpoint: "https://api.crustdata.com/screener/company/search",
      filters: {
        COMPANY_HEADCOUNT: {
          type: "in",
          values: ["1-10", "11-50", "51-200", "201-500", "501-1,000", "1,001-5,000", "5,001-10,000", "10,001+"]
        },
        REGION: {
          type: "in/not_in",
          values: "region_values"
        },
        INDUSTRY: {
          type: "in/not_in",
          values: "industry_values"
        }
      },
      credits_cost: 25,
      example_request: {
        filters: [
          {
            filter_type: "COMPANY_HEADCOUNT",
            type: "in",
            value: ["10,001+", "1,001-5,000"]
          }
        ],
        page: 1
      }
    }
  },

  dataset: {
    job_listings: {
      description: "Get company job listings",
      method: "POST",
      endpoint: "https://api.crustdata.com/dataset/company/jobs",
      parameters: {
        domain: { type: "string", required: true },
        time_range: { type: "object", required: false }
      }
    },
    funding_milestones: {
      description: "Get company funding information",
      method: "POST",
      endpoint: "https://api.crustdata.com/dataset/company/funding",
      parameters: {
        domain: { type: "string", required: true }
      }
    }
  },

  people: {
    enrichment: {
      description: "Enrich people profiles data",
      method: "POST",
      endpoint: "https://api.crustdata.com/screener/person/enrich",
      parameters: {
        linkedin_profile_url: {
          type: "string",
          required: false,
          example: "https://www.linkedin.com/in/johndoe/"
        },
        business_email: {
          type: "string",
          required: false,
          example: "john@company.com"
        },
        enrich_realtime: {
          type: "boolean",
          required: false,
          default: false
        }
      },
      credits_cost: {
        database: 3,
        realtime: 5
      }
    },
    search: {
      description: "Search for people profiles",
      method: "POST",
      endpoint: "https://api.crustdata.com/screener/person/search",
      filters: {
        CURRENT_COMPANY: {
          type: "in/not_in",
          example: ["openai.com", "anthropic.com"]
        },
        CURRENT_TITLE: {
          type: "in/not_in",
          example: ["engineer", "researcher"]
        }
      },
      credits_cost: 25
    }
  },

  linkedin_posts: {
    company: {
      description: "Get LinkedIn posts by company",
      method: "GET",
      endpoint: "https://api.crustdata.com/linkedin/company/posts",
      parameters: {
        company_linkedin_url: { type: "string", required: true },
        page: { type: "integer", default: 1 },
        limit: { type: "integer", default: 5 }
      },
      credits_cost: {
        without_reactors: 5,
        with_reactors: 25
      }
    },
    person: {
      description: "Get LinkedIn posts by person",
      method: "GET",
      endpoint: "https://api.crustdata.com/linkedin/person/posts",
      parameters: {
        person_linkedin_url: { type: "string", required: true },
        page: { type: "integer", default: 1 },
        limit: { type: "integer", default: 5 }
      },
      credits_cost: {
        without_reactors: 5,
        with_reactors: 25
      }
    }
  },

  usage: {
    credits: {
      description: "Get remaining API credits",
      method: "GET",
      endpoint: "https://api.crustdata.com/user/credits",
      parameters: {},
      example_response: {
        credits: 1000000
      }
    }
  }
};

 