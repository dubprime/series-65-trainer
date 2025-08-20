export interface VocabTerm {
	id: string
	term: string
	definition: string
	example?: string
	category: string
}

export const vocabTerms: VocabTerm[] = [
	{
		id: "sec",
		term: "Securities and Exchange Commission (SEC)",
		definition:
			"A federal agency responsible for enforcing federal securities laws and regulating the securities industry, including stock exchanges, broker-dealers, investment advisers, and mutual funds.",
		example:
			"The SEC requires companies to file quarterly and annual reports to ensure transparency for investors.",
		category: "Regulatory Bodies",
	},
	{
		id: "iar",
		term: "Investment Adviser Representative (IAR)",
		definition:
			"Any partner, officer, director, or other individual employed by or associated with an investment adviser who provides investment advice to clients, manages client accounts, or solicits advisory services.",
		example:
			"An IAR must pass the Series 65 exam to provide investment advice to retail clients.",
		category: "Professional Roles",
	},
	{
		id: "money-market",
		term: "Money Market Instruments",
		definition:
			"Short-term, highly liquid, low-risk debt instruments with maturities typically less than one year, designed for capital preservation rather than long-term appreciation.",
		example:
			"Treasury bills, commercial paper, and certificates of deposit are common money market instruments.",
		category: "Investment Types",
	},
	{
		id: "investment-contract",
		term: "Investment Contract",
		definition:
			"A security as defined by the Howey Test, involving an investment of money in a common enterprise with the expectation of profits derived from the efforts of others.",
		example:
			"A real estate investment trust (REIT) that pools investor money to purchase and manage properties.",
		category: "Securities",
	},
	{
		id: "limited-partnership",
		term: "Limited Partnership",
		definition:
			"A business structure with at least one general partner (unlimited liability and management responsibility) and one limited partner (limited liability and no management responsibility).",
		example:
			"A real estate development project where the developer is the general partner and investors are limited partners.",
		category: "Business Structures",
	},
	{
		id: "municipal-bond",
		term: "Municipal Bond",
		definition:
			"A debt security issued by state or local governments to finance public projects, with interest typically exempt from federal income tax and sometimes state/local taxes.",
		example:
			"A city issues municipal bonds to build a new school, with interest payments exempt from federal taxes.",
		category: "Fixed Income",
	},
	{
		id: "uniform-securities-act",
		term: "Uniform Securities Act",
		definition:
			"A model law adopted by many states to regulate securities transactions and prevent fraud, providing a framework for state-level securities regulation.",
		example:
			"Most states have adopted the Uniform Securities Act to regulate investment advisers and broker-dealers operating within their borders.",
		category: "Regulations",
	},
	{
		id: "investment-advisers-act",
		term: "Investment Advisers Act of 1940",
		definition:
			"Federal legislation that regulates investment advisers, requiring registration with the SEC or state authorities and adherence to fiduciary duty and conduct rules.",
		example:
			"Under the Investment Advisers Act, advisers must act in their clients' best interests and disclose conflicts of interest.",
		category: "Federal Laws",
	},
]
