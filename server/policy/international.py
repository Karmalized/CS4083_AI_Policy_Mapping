from fastapi import APIRouter, Depends, HTTPException
import os
import httpx
from typing import List
import json
from fastapi.responses import StreamingResponse
import asyncio
from pydantic import BaseModel
import pycountry

class InternationalAgreement(BaseModel):
    id: int
    englishName: str
    description: str
    website: str | None
    responsibleOrganization: str | None
    startYear: int | None
    endYear: int | None
    gaiinCountry: dict | None
    targetSectors: List[dict] | None
    initiativeType: dict | None
    principles: List[dict]

router = APIRouter(
    prefix="/policy/international",
    tags=["international"],
    redirect_slashes=True
)

# list_of_countries = ['Afghanistan', 'Aland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia, Plurinational State of', 'Bonaire, Sint Eustatius and Saba', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Congo, The Democratic Republic of the', 'Cook Islands', 'Costa Rica', "Côte d'Ivoire", 'Croatia', 'Cuba', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard Island and McDonald Islands', 'Holy See (Vatican City State)', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran, Islamic Republic of', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', "Korea, Democratic People's Republic of", 'Korea, Republic of', 'Kuwait', 'Kyrgyzstan', "Lao People's Democratic Republic", 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Macedonia, Republic of', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States of', 'Moldova, Republic of', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestinian Territory, Occupied', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Barthélemy', 'Saint Helena, Ascension and Tristan da Cunha', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin (French part)', 'Saint Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten (Dutch part)', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia and the South Sandwich Islands', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'South Sudan', 'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan, Province of China', 'Tajikistan', 'Tanzania, United Republic of', 'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'United States Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela, Bolivarian Republic of', 'Viet Nam', 'Virgin Islands, British', 'Virgin Islands, U.S.', 'Wallis and Futuna', 'Yemen', 'Zambia', 'Zimbabwe']
num_of_countries = 195 # Total number of recognized countries

BASE_URL = "https://oecd-ai.case-api.buddyweb.fr/policy-initiatives"  # Placeholder URL

@router.get("/obtainCountryMapping", response_model=dict)
async def obtain_country_map():
    """Fetch country IDs for international AI policy agreements.
    Returns:
        A dictionary mapping country names to their IDs.
    """
    format_URL = f"{BASE_URL}"
    # params = {
    #     "countryIds": 164
    # }
    timeout = httpx.Timeout(10.0, read=20.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        tasks = [fetch_country_data(client=client, url=format_URL, country_id=c) for c in range(1, num_of_countries + 1)]
        responses = await asyncio.gather(*tasks)

        country_id_map = {}
        for r in responses:
            data = r.get("data", [])
            count = r.get("total")
            for p in data:
                country = p.get("gaiinCountry")
                if country["id"] == 35:
                    country_id_map["China"] = {"id": country["id"], "code": country["code"], "policyCount": count}
                    break
                if country["name"] not in country_id_map:
                    country_id_map[country["name"]] = {"id": country["id"], "code": country["code"], "policyCount": count}
                    break
        # Write to JSON file
        try:
            os.makedirs("policy/data", exist_ok=True)
            filepath = os.path.join("policy/data", "country_id_map.json")
            with open(filepath, "w") as f:
                json.dump(country_id_map, f, indent=4)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error writing to file: {str(e)}")
        return country_id_map

@router.get("/callCountryMapping", response_model=dict)
async def call_country_map():
    """Fetch country IDs for international AI policy agreements.
    Returns:
        A dictionary mapping country names to their IDs.
    """
    if os.path.exists("policy/data/country_id_map.json"):
        with open("policy/data/country_id_map.json", "r") as f:
            country_ids = json.load(f)
        return country_ids
    else:
        mapping = await obtain_country_map()
        return mapping
    
@router.get("/countryCodes", response_model=dict)
async def get_country_codes():
    """Fetch Numeric ISO Codes based on the Names of the Countries.
    Returns:
        A dictionary mapping country names to their Numeric ISO Codes.
    """
    country_id_map = {c.numeric: c.name for c in pycountry.countries}
    return country_id_map
    
@router.get("/countryPolicies/{id:int}")
async def get_country_policies(id):
    """Fetch AI Initiatives/Policies related to a specific country denoted by their ID
    Returns:
        A dictionary of legislative policy initiatives from a country denoted by their country ID
    """
    params = {"page": 1, "countryIds": id}
    format_URL = f"{BASE_URL}"
    timeout = httpx.Timeout(10.0, read=20.0)
    policyData = []
    async with httpx.AsyncClient(timeout=timeout) as client:
        while True:
            response = await client.get(format_URL, params=params)
            data = response.json().get("data", [])

            if not data:
                break

            for policy in data:
                ia = InternationalAgreement(
                    id=policy.get("id"),
                    englishName=policy.get("englishName") or "",
                    description=policy.get("description") or "",
                    website=policy.get("website"),
                    responsibleOrganization=policy.get("responsibleOrganization"),
                    startYear=policy.get("startYear"),
                    endYear=policy.get("endYear"),
                    gaiinCountry=policy.get("gaiinCountry"),
                    targetSectors=policy.get("targetSectors"),
                    initiativeType=policy.get("initiativeType"),
                    principles=policy.get("principles") or []
                    )
                policyData.append(ia)
            
            params["page"] += 1

        return policyData
                
                    
    

@router.get("/policycounts", response_model=dict)
async def get_policy_counts():

    """Fetch counts of international AI policy agreements.
    Returns:
        A dictionary containing counts of international AI policy agreements.
    """
    format_URL = f"{BASE_URL}"
    timeout = httpx.Timeout(10.0, read=20.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.get(format_URL)
        response.raise_for_status()
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code,
                                detail=f"Error fetching data: {response.text}")

        return response.json()

async def fetch_country_data(client, url: str, country_id: int):
    """Helper function to fetch data from the API.
    Args:
        client: The HTTP client to use for the request.
        url (str): The API endpoint URL.
        params (dict): The query parameters for the request.
    Returns:
        A dictionary containing the API response data.
    """
    params = {"countryIds": country_id}  
    response = await client.get(url, params=params)
    response.raise_for_status()
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code,
                            detail=f"Error fetching data: {response.text}")

    return response.json()