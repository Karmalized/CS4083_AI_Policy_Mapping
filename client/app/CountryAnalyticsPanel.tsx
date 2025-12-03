import React from 'react'

interface countryIdentityProps {
        name: string;
        data: any;
    }

export default function CountryAnalyticsPanel({name, data}: countryIdentityProps) {

  return (
    <div className="analytics-panel">
      <h2>{name}</h2>
      {/* <PolicyBarChart policies={data.policies} />
      <PrinciplesPieChart policy={data.policies[0]} /> */}
    </div>
  )
}
