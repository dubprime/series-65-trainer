-- Seed script for questions table
-- This will populate the questions table with Series 65 exam questions

-- Clear existing questions (if any)
DELETE FROM public.questions;

-- Clear existing users (if any)
DELETE FROM public.users;

-- Note: We don't create auth users here - you'll sign up normally
-- But we can create a test user profile that will be linked when you sign up
-- Just sign up with test@example.com and it will work

-- Insert questions from fixtures/questions_nasaa.json
-- Note: This is a sample of questions - the full dataset will be imported via the API

INSERT INTO public.questions (
	question_text,
	question_type,
	choices,
	correct_answer,
	explanation,
	category,
	subcategory,
	difficulty_level,
	tags,
	source
) VALUES 
(
	'Which of the following best describes the primary role of the Securities and Exchange Commission (SEC)?',
	'multiple_choice',
	'[
		{"id": "A", "text": "To enforce federal securities laws and regulate the securities industry."},
		{"id": "B", "text": "To provide insurance for bank deposits."},
		{"id": "C", "text": "To set interest rates for commercial banks."},
		{"id": "D", "text": "To guarantee returns on municipal bonds."}
	]',
	'A',
	'The SEC enforces securities laws and regulates the industry; other agencies handle banking and insurance.',
	'EFBI',
	'Regulation',
	2,
	ARRAY['regulation', 'SEC', 'basics'],
	'NASAA Series 65'
),
(
	'A broker-dealer must register with which of the following organizations to conduct securities transactions with the public?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Federal Reserve"},
		{"id": "B", "text": "FINRA"},
		{"id": "C", "text": "FDIC"},
		{"id": "D", "text": "OCC"}
	]',
	'B',
	'FINRA is the primary self-regulatory organization for broker-dealers.',
	'EFBI',
	'Registration',
	2,
	ARRAY['registration', 'broker-dealer', 'FINRA'],
	'NASAA Series 65'
),
(
	'Which of the following is NOT considered a security under federal law?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Common stock"},
		{"id": "B", "text": "Municipal bond"},
		{"id": "C", "text": "Fixed annuity"},
		{"id": "D", "text": "Investment contract"}
	]',
	'C',
	'Fixed annuities are insurance products, not securities.',
	'EFBI',
	'Security Definition',
	3,
	ARRAY['security definition', 'annuity'],
	'NASAA Series 65'
),
(
	'An investment adviser representative (IAR) is required to register in which of the following situations?',
	'multiple_choice',
	'[
		{"id": "A", "text": "When advising only institutional clients in their home state"},
		{"id": "B", "text": "When soliciting five or fewer retail clients in another state"},
		{"id": "C", "text": "When they have a place of business in the state"},
		{"id": "D", "text": "When only providing advice on U.S. government securities"}
	]',
	'C',
	'Registration is required if the IAR has a place of business in the state.',
	'EFBI',
	'Registration',
	3,
	ARRAY['registration', 'IAR'],
	'NASAA Series 65'
),
(
	'Which of the following best describes a "broker" under the Uniform Securities Act?',
	'multiple_choice',
	'[
		{"id": "A", "text": "A person who effects securities transactions for their own account"},
		{"id": "B", "text": "A person who effects securities transactions for the accounts of others"},
		{"id": "C", "text": "A person who manages investment portfolios"},
		{"id": "D", "text": "A person who guarantees investment returns"}
	]',
	'B',
	'A broker effects transactions for others; for their own account is a dealer.',
	'EFBI',
	'Definitions',
	2,
	ARRAY['definitions', 'broker'],
	'NASAA Series 65'
),
(
	'Which of the following investments is most suitable for an investor seeking regular income with low risk?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Growth stocks"},
		{"id": "B", "text": "High-yield bonds"},
		{"id": "C", "text": "U.S. Treasury notes"},
		{"id": "D", "text": "International equity funds"}
	]',
	'C',
	'U.S. Treasury notes offer regular income and are low risk.',
	'IVC',
	'Suitability',
	2,
	ARRAY['suitability', 'income', 'risk'],
	'NASAA Series 65'
),
-- Additional bulk-inserted questions
(
	'Which financial statement best reflects a company’s liquidity at a specific point in time?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Income statement"},
		{"id": "B", "text": "Balance sheet"},
		{"id": "C", "text": "Statement of cash flows"},
		{"id": "D", "text": "Retained earnings statement"}
	]',
	'B',
	'The balance sheet shows assets and liabilities at a single point, revealing liquidity.',
	'EFBI',
	'Financial Statements',
	2,
	ARRAY['liquidity', 'balance sheet', 'statements'],
	'Original'
),
(
	'An investor seeking tax-free income would most likely invest in which of the following?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Corporate bonds"},
		{"id": "B", "text": "Municipal bonds"},
		{"id": "C", "text": "U.S. Treasury bills"},
		{"id": "D", "text": "REITs"}
	]',
	'B',
	'Interest from municipal bonds is generally exempt from federal income tax.',
	'IVC',
	'Tax Considerations',
	3,
	ARRAY['tax', 'income', 'municipal bonds'],
	'Original'
),
(
	'Which of the following is a non-systematic risk?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Market risk"},
		{"id": "B", "text": "Interest rate risk"},
		{"id": "C", "text": "Business risk"},
		{"id": "D", "text": "Inflation risk"}
	]',
	'C',
	'Business risk affects individual companies, not the whole market.',
	'IVC',
	'Risk',
	2,
	ARRAY['risk', 'non-systematic', 'business'],
	'Original'
),
(
	'Under the Uniform Securities Act, which of the following is NOT considered a security?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Stock option"},
		{"id": "B", "text": "Variable annuity"},
		{"id": "C", "text": "Fixed annuity"},
		{"id": "D", "text": "Debenture"}
	]',
	'C',
	'Fixed annuities are insurance products, not securities.',
	'EFBI',
	'Securities Definition',
	2,
	ARRAY['security definition', 'annuity'],
	'Original'
),
(
	'Which investment is most appropriate for an investor with a short-term horizon and low risk tolerance?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Long-term bond fund"},
		{"id": "B", "text": "Money market fund"},
		{"id": "C", "text": "International equity fund"},
		{"id": "D", "text": "Balanced mutual fund"}
	]',
	'B',
	'Money market funds offer low risk and high liquidity for short-term needs.',
	'IVC',
	'Suitability',
	2,
	ARRAY['suitability', 'liquidity', 'risk'],
	'Original'
),
(
	'Which of the following is a characteristic of a closed-end investment company?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Shares are redeemable by the issuer"},
		{"id": "B", "text": "Shares trade on secondary markets"},
		{"id": "C", "text": "Continuous offering of shares"},
		{"id": "D", "text": "Priced at NAV at all times"}
	]',
	'B',
	'Closed-end company shares trade on exchanges after the IPO.',
	'CIRS',
	'Investment Companies',
	3,
	ARRAY['closed-end', 'funds', 'secondary market'],
	'Original'
),
(
	'Which ratio best measures a firm’s ability to meet short-term obligations?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Current ratio"},
		{"id": "B", "text": "Price-to-earnings ratio"},
		{"id": "C", "text": "Debt-to-equity ratio"},
		{"id": "D", "text": "Return on equity"}
	]',
	'A',
	'The current ratio compares current assets to current liabilities.',
	'EFBI',
	'Financial Ratios',
	2,
	ARRAY['ratios', 'liquidity', 'current'],
	'Original'
),
(
	'Which of the following is NOT a feature of a limited partnership?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Pass-through taxation"},
		{"id": "B", "text": "Limited liability for limited partners"},
		{"id": "C", "text": "Freely transferable interests"},
		{"id": "D", "text": "At least one general partner"}
	]',
	'C',
	'Interests in limited partnerships are generally not freely transferable.',
	'CIRS',
	'Partnerships',
	3,
	ARRAY['partnership', 'liability', 'taxation'],
	'Original'
),
(
	'Which of the following is considered a leading economic indicator?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Unemployment rate"},
		{"id": "B", "text": "Stock market prices"},
		{"id": "C", "text": "GDP"},
		{"id": "D", "text": "Inflation rate"}
	]',
	'B',
	'Stock prices often change in advance of the economy as a whole.',
	'LRG',
	'Economic Indicators',
	3,
	ARRAY['economics', 'leading', 'indicators'],
	'Original'
),
(
	'Which of the following best describes the purpose of diversification?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Increase returns"},
		{"id": "B", "text": "Eliminate all risk"},
		{"id": "C", "text": "Reduce unsystematic risk"},
		{"id": "D", "text": "Maximize tax benefits"}
	]',
	'C',
	'Diversification reduces non-systematic (company-specific) risk.',
	'IVC',
	'Portfolio Management',
	2,
	ARRAY['diversification', 'risk', 'portfolio'],
	'Original'
),
(
	'Which type of order guarantees execution but not price?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Market order"},
		{"id": "B", "text": "Limit order"},
		{"id": "C", "text": "Stop order"},
		{"id": "D", "text": "Fill-or-kill order"}
	]',
	'A',
	'Market orders are executed immediately at current prices.',
	'CIRS',
	'Trading Markets',
	2,
	ARRAY['orders', 'execution', 'market'],
	'Original'
),
(
	'Which of the following is a qualified retirement plan?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Roth IRA"},
		{"id": "B", "text": "Section 529 plan"},
		{"id": "C", "text": "401(k) plan"},
		{"id": "D", "text": "Coverdell ESA"}
	]',
	'C',
	'401(k) plans are employer-sponsored qualified retirement plans.',
	'CIRS',
	'Retirement Plans',
	3,
	ARRAY['retirement', 'qualified', '401k'],
	'Original'
),
(
	'Which investment vehicle is most suitable for an investor seeking capital preservation?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Money market fund"},
		{"id": "B", "text": "Small-cap equity fund"},
		{"id": "C", "text": "High-yield bond fund"},
		{"id": "D", "text": "International stock fund"}
	]',
	'A',
	'Money market funds are designed for capital preservation.',
	'IVC',
	'Suitability',
	2,
	ARRAY['capital preservation', 'suitability', 'money market'],
	'Original'
),
(
	'Which of the following is a characteristic of a growth stock?',
	'multiple_choice',
	'[
		{"id": "A", "text": "High dividend yield"},
		{"id": "B", "text": "Above-average earnings growth"},
		{"id": "C", "text": "Low price-to-earnings ratio"},
		{"id": "D", "text": "Stable cash flows"}
	]',
	'B',
	'Growth stocks are expected to have higher-than-average earnings growth.',
	'IVC',
	'Equities',
	3,
	ARRAY['growth', 'stocks', 'equity'],
	'Original'
),
(
	'Which of the following statements about municipal bonds is TRUE?',
	'multiple_choice',
	'[
		{"id": "A", "text": "They are always taxable at the federal level"},
		{"id": "B", "text": "They are generally exempt from federal income tax"},
		{"id": "C", "text": "They pay higher interest than corporate bonds"},
		{"id": "D", "text": "They are issued by the federal government"}
	]',
	'B',
	'Municipal bonds are usually exempt from federal income tax.',
	'CIRS',
	'Debt Securities',
	2,
	ARRAY['municipal bonds', 'tax', 'debt'],
	'Original'
),
(
	'Which of the following is a lagging economic indicator?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Stock prices"},
		{"id": "B", "text": "Average duration of unemployment"},
		{"id": "C", "text": "Building permits"},
		{"id": "D", "text": "Manufacturers’ new orders"}
	]',
	'B',
	'Average duration of unemployment is a lagging indicator.',
	'LRG',
	'Economic Indicators',
	3,
	ARRAY['lagging', 'economics', 'unemployment'],
	'Original'
),
(
	'Which of the following is NOT a benefit of investing in mutual funds?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Professional management"},
		{"id": "B", "text": "Diversification"},
		{"id": "C", "text": "Guaranteed returns"},
		{"id": "D", "text": "Liquidity"}
	]',
	'C',
	'Mutual funds do not guarantee returns.',
	'CIRS',
	'Investment Companies',
	2,
	ARRAY['mutual funds', 'benefits', 'liquidity'],
	'Original'
),
(
	'Which of the following would be considered an aggressive investment strategy?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Investing in blue-chip stocks"},
		{"id": "B", "text": "Investing in small-cap growth stocks"},
		{"id": "C", "text": "Investing in Treasury bills"},
		{"id": "D", "text": "Investing in municipal bonds"}
	]',
	'B',
	'Small-cap growth stocks are typically riskier and more aggressive.',
	'IVC',
	'Portfolio Management',
	4,
	ARRAY['aggressive', 'small-cap', 'strategy'],
	'Original'
),
(
	'Which of the following is a feature of a Roth IRA?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Tax-deductible contributions"},
		{"id": "B", "text": "Tax-free qualified withdrawals"},
		{"id": "C", "text": "Required minimum distributions at age 72"},
		{"id": "D", "text": "Contributions limited to earned income"}
	]',
	'B',
	'Qualified withdrawals from a Roth IRA are tax-free.',
	'CIRS',
	'Retirement Plans',
	3,
	ARRAY['roth', 'ira', 'retirement'],
	'Original'
),
(
	'Which of the following would be considered a defensive stock?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Pharmaceutical company"},
		{"id": "B", "text": "Technology startup"},
		{"id": "C", "text": "Luxury retailer"},
		{"id": "D", "text": "Automotive manufacturer"}
	]',
	'A',
	'Defensive stocks are companies whose products are always in demand, like pharmaceuticals.',
	'IVC',
	'Equities',
	3,
	ARRAY['defensive', 'stock', 'pharmaceutical'],
	'Original'
),
(
	'Which of the following best describes a unit investment trust (UIT)?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Actively managed portfolio"},
		{"id": "B", "text": "Fixed portfolio for a specific period"},
		{"id": "C", "text": "Continuously issued shares"},
		{"id": "D", "text": "Shares trade on exchanges"}
	]',
	'B',
	'UITs have fixed portfolios and a set termination date.',
	'CIRS',
	'Investment Companies',
	2,
	ARRAY['UIT', 'investment company', 'fixed'],
	'Original'
),
(
	'Which of the following is a feature of a traditional IRA?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Tax-free withdrawals"},
		{"id": "B", "text": "Tax-deductible contributions"},
		{"id": "C", "text": "No required minimum distributions"},
		{"id": "D", "text": "Unlimited contributions"}
	]',
	'B',
	'Traditional IRA contributions may be tax-deductible.',
	'CIRS',
	'Retirement Plans',
	2,
	ARRAY['IRA', 'traditional', 'retirement'],
	'Original'
),
(
	'Which of the following investments is most susceptible to purchasing power risk?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Treasury Inflation-Protected Securities (TIPS)"},
		{"id": "B", "text": "Long-term fixed-rate bonds"},
		{"id": "C", "text": "Growth stocks"},
		{"id": "D", "text": "REITs"}
	]',
	'B',
	'Fixed-rate bonds lose value if inflation rises.',
	'IVC',
	'Risk',
	3,
	ARRAY['purchasing power', 'inflation', 'bonds'],
	'Original'
),
(
	'Which of the following is a primary market transaction?',
	'multiple_choice',
	'[
		{"id": "A", "text": "An investor buying shares on the NYSE"},
		{"id": "B", "text": "A company issuing new shares to the public"},
		{"id": "C", "text": "A broker selling bonds to a client"},
		{"id": "D", "text": "An investor selling shares to another investor"}
	]',
	'B',
	'Primary market transactions involve new securities issued by the company.',
	'EFBI',
	'Markets',
	2,
	ARRAY['primary market', 'issuance', 'securities'],
	'Original'
),
(
	'Which of the following is a characteristic of a zero-coupon bond?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Pays interest semiannually"},
		{"id": "B", "text": "Sold at a discount and matures at par"},
		{"id": "C", "text": "Pays periodic dividends"},
		{"id": "D", "text": "Has no maturity date"}
	]',
	'B',
	'Zero-coupon bonds are sold below par and pay no periodic interest.',
	'CIRS',
	'Debt Securities',
	3,
	ARRAY['zero-coupon', 'bond', 'discount'],
	'Original'
),
(
	'Which of the following would be most appropriate for an investor seeking income and safety of principal?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Preferred stock"},
		{"id": "B", "text": "High-yield bonds"},
		{"id": "C", "text": "U.S. Treasury bonds"},
		{"id": "D", "text": "Emerging market equities"}
	]',
	'C',
	'U.S. Treasury bonds offer income and are backed by the U.S. government.',
	'IVC',
	'Suitability',
	2,
	ARRAY['income', 'safety', 'treasury'],
	'Original'
),
(
	'Which of the following best describes the efficient market hypothesis?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Markets always overreact to news"},
		{"id": "B", "text": "Prices reflect all available information"},
		{"id": "C", "text": "Markets are inefficient in the short run"},
		{"id": "D", "text": "Insider trading is common and legal"}
	]',
	'B',
	'Efficient market hypothesis states prices reflect all known information.',
	'LRG',
	'Markets',
	4,
	ARRAY['efficient market', 'hypothesis', 'information'],
	'Original'
),
(
	'Which of the following is a benefit of dollar-cost averaging?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Eliminates all investment risk"},
		{"id": "B", "text": "Reduces the average cost per share over time"},
		{"id": "C", "text": "Guarantees profits"},
		{"id": "D", "text": "Maximizes short-term returns"}
	]',
	'B',
	'Dollar-cost averaging can reduce the average cost per share in volatile markets.',
	'IVC',
	'Investment Strategies',
	3,
	ARRAY['dollar-cost averaging', 'strategy', 'risk'],
	'Original'
),
(
	'Which of the following is a characteristic of preferred stock?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Voting rights"},
		{"id": "B", "text": "Fixed dividend payments"},
		{"id": "C", "text": "Higher claim than bonds"},
		{"id": "D", "text": "Tax-deductible dividends"}
	]',
	'B',
	'Preferred stock typically pays a fixed dividend.',
	'CIRS',
	'Equities',
	2,
	ARRAY['preferred stock', 'dividend', 'equity'],
	'Original'
),
(
	'Which of the following is NOT a requirement for a security to be listed on a national exchange?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Minimum number of shareholders"},
		{"id": "B", "text": "Minimum share price"},
		{"id": "C", "text": "SEC approval of the company’s business plan"},
		{"id": "D", "text": "Minimum market capitalization"}
	]',
	'C',
	'SEC does not approve business plans for listing; exchanges have their own requirements.',
	'EFBI',
	'Markets',
	3,
	ARRAY['listing', 'exchange', 'requirements'],
	'Original'
),
(
	'Which of the following is a feature of an ETF (exchange-traded fund)?',
	'multiple_choice',
	'[
		{"id": "A", "text": "Actively managed portfolio"},
		{"id": "B", "text": "Trades like a stock on exchanges"},
		{"id": "C", "text": "Sold only at NAV"},
		{"id": "D", "text": "No diversification"}
	]',
	'B',
	'ETFs trade throughout the day like stocks.',
	'CIRS',
	'Investment Companies',
	2,
	ARRAY['ETF', 'exchange-traded', 'funds'],
	'Original'
);

-- Verify the data was inserted
SELECT 'Questions' as table_name, COUNT(*) as count FROM public.questions;
