export type GhgEmission = {
  yearMonth: string;
  source: string;
  emissions: number;
};

export type Company = {
  id: string;
  name: string;
  country: string;
  emissions: GhgEmission[];
};

export interface CompanyStatistics {
  lastMonth: number;
  prevMonth: number;
  total: number;
  totalCompanyValue: number;
  otherAverage: number;
  sameCompanyAverage: number;
  isAboveAverage: boolean;
}

export function calculateCompanyStatistics(
  selectedCompany: Company,
  companies: Company[]
): CompanyStatistics {
  const emissions = selectedCompany.emissions;

  const lastMonth = emissions.slice(-1)[0]?.emissions || 0;
  const prevMonth = emissions.slice(-2, -1)[0]?.emissions || 0;

  const total = emissions.reduce((sum, e) => sum + e.emissions, 0);

  const totalCompanyValue = companies.reduce(
    (sum, c) => sum + c.emissions.reduce((s, e) => s + e.emissions, 0),
    0
  );

  const otherCompanies = companies.filter((c) => c.id !== selectedCompany.id);

  const otherAverage =
    otherCompanies.reduce(
      (sum, c) => sum + (c.emissions.slice(-1)[0]?.emissions || 0),
      0
    ) / otherCompanies.length;

  const sameCompanyAverage =
    emissions.reduce((sum, e) => sum + e.emissions, 0) / emissions.length;

  const isAboveAverage = lastMonth > otherAverage;

  return {
    lastMonth,
    prevMonth,
    total,
    totalCompanyValue,
    otherAverage,
    sameCompanyAverage,
    isAboveAverage,
  };
}
